using Soti.Scheduler;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Timers;
using System.Xml;
using Soti.MCDP.ConfigSet.Model;
using Soti.MCDP.Scheduler.Model;


namespace Soti.MCDP.Scheduler
{
    public class Scheduler : ITask
    { 
        private static ManualResetEvent doneEvent;
        private static string configPath = string.Empty;
        private static int numBusy;
        private static DataSet dsTasks;
        private const string TASKS_NAME_SPACE = "MailTasks."; //Period is needed
        private const string DATE_FORMAT_STRING = "MM/dd/yyyy HH:mm";
        private static Assembly tasksAssembly;
        private static EventLog eventLog1;
        readonly System.Timers.Timer _timer = new System.Timers.Timer();
        private static bool workInProgress;
        
        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private readonly Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        /// MC MetaDatas
        /// </summary>
        private readonly List<mcMetadata> _mcMetadatas;

        public Scheduler(Dictionary<string, DeviceSyncStatus> deviceSyncStausList, List<mcMetadata> mcMetadatas)
        {
            if (!EventLog.SourceExists("MailScheduler"))
                EventLog.CreateEventSource("MailScheduler", "Application");
            eventLog1 = new EventLog("Application", Environment.MachineName, "MailScheduler");

            this._deviceSyncStausList = deviceSyncStausList;
            this._mcMetadatas = mcMetadatas;
        }
        public static void LoadTasksIntoDataSet()
        {
            try
            {
                eventLog1.WriteEntry("Trying to Load Tasks into DataSet");
                configPath = ConfigurationManager.AppSettings["tasksConfigPath"];
                XmlTextReader xmlTextReader = new XmlTextReader(configPath);
                XmlDataDocument xdoc1 = new XmlDataDocument();
                xdoc1.DataSet.ReadXml(xmlTextReader, XmlReadMode.InferSchema);
                dsTasks = xdoc1.DataSet;
                xmlTextReader.Close();
                eventLog1.WriteEntry("Finished Loading Tasks into DataSet");
            }
            catch (Exception ex)
            {
                eventLog1.WriteEntry("Error occurred while loading tasks into DataSet " + ex.Message);
                throw;
            }
        }
        public static void LoadTasksAssembly()
        {
            try
            {
                if (tasksAssembly == null)
                    tasksAssembly = Assembly.GetAssembly(typeof(ITask));
            }
            catch (Exception ex)
            {
                eventLog1.WriteEntry("Error occurred while loading tasks Assembly " + ex.Message);
                throw;
            }
        }
        public static void RunTasks(object sender, ElapsedEventArgs args)
        {
            //If the processing of RunTasks lasts longer than the Timer's interval, RunTasks could be called
            //again before the previous call finished. To overcome this, using a bool variable workInProgress to track if this method is in progress
            //If not, go ahead else return
            if (workInProgress) return;
            numBusy = 0;
            // LoadTasksIntoDataSet();
            doneEvent = new ManualResetEvent(false);
            List<ITask> tasksList = GetTasksToRun();
            numBusy = tasksList.Count; //Number of threads to create is not constant, depends on the tasks ready to run at a given time
            if (numBusy > 0)
            {
                workInProgress = true;
                foreach (ITask task in tasksList)
                {
                    ThreadPool.QueueUserWorkItem(DoTask, task);
                }
                doneEvent.WaitOne();
            }
            //All scheduled tasks completed, persist the tasks data to disk,iteration over
            if (numBusy == 0 && tasksList.Count > 0)
            {
                workInProgress = false;
                UpdateTasksConfigonDisk();
            }
        }
        public static void UpdateTasksConfigonDisk()
        {
            try
            {
                eventLog1.WriteEntry("Attempting to save tasks information to disk ");
                StreamWriter sWrite = new StreamWriter(configPath);
                XmlTextWriter xWrite = new XmlTextWriter(sWrite);
                dsTasks.WriteXml(xWrite, XmlWriteMode.WriteSchema);
                xWrite.Close();
            }
            catch (Exception ex)
            {
                eventLog1.WriteEntry("Error occurred while savings tasks information to disk " + ex.Message);
                throw;
            }
        }
        public void RunTask()
        {

        }
        private static void DoTask(object o)
        {
            ITask task = o as ITask;
            if (task == null) return;
            string scheduleName = task.GetType().ToString();
            try
            {
                //Event Log, starting task at this time.
                task.RunTask();
                //Task completed successfuly at this time
                int lastIndexOfPeriod = scheduleName.LastIndexOf(".");
                UpdateNextRunTime(scheduleName.Substring(lastIndexOfPeriod + 1));
            }
            catch (Exception ex)
            {
                eventLog1.WriteEntry("Error occurred while executing task: " + scheduleName);
                eventLog1.WriteEntry("Stack Trace is: " + ex.Message);
            }
            finally
            {
                if (Interlocked.Decrement(ref numBusy) == 0)
                {
                    doneEvent.Set();
                }
            }
        }
        //updating the dataset is not thread safe
        private static void UpdateNextRunTime(string taskName)
        {
            if (dsTasks == null) return;
            foreach (DataRow row in dsTasks.Tables[0].Rows)
            {
                if (taskName.ToLower() != row[0].ToString().ToLower()) continue;
                DateTime scheduledTime = DateTime.Parse(row[1].ToString());
                string repeat = row["repeat"].ToString().ToUpper();
                switch (repeat)
                {
                    case "H":
                        scheduledTime = scheduledTime.AddHours(1);
                        if (scheduledTime < DateTime.Now)
                            scheduledTime = DateTime.Now.AddHours(1);
                        break;
                    case "D":
                        while (scheduledTime < DateTime.Now)
                        {
                            scheduledTime = scheduledTime.AddDays(1);
                        }
                        break;
                    case "W":
                        while (scheduledTime < DateTime.Now)
                        {
                            scheduledTime = scheduledTime.AddDays(7);
                        }
                        break;
                    case "M":
                        while (scheduledTime < DateTime.Now)
                        {
                            scheduledTime = scheduledTime.AddMonths(1);
                        }
                        break;
                }
                row[1] = scheduledTime.ToString(DATE_FORMAT_STRING);
                dsTasks.AcceptChanges();
            }
        }
        private static List<ITask> GetTasksToRun()
        {
            if (dsTasks == null) return null;
            List<ITask> tasks = new List<ITask>();
            foreach (DataRow row in dsTasks.Tables[0].Rows)
            {
                DateTime scheduledTime = DateTime.Parse(row[1].ToString());
                if (DateTime.Now < scheduledTime) continue;
                ITask task = CreateTaskInstance(row[0].ToString());
                if (task != null)
                    tasks.Add(task);
            }
            return tasks;
        }
        private static ITask CreateTaskInstance(string taskName)
        {
            string taskFullName = TASKS_NAME_SPACE + taskName;
            try
            {
                if (tasksAssembly == null)
                    throw new Exception("Tasks Assembly is null, cannot proceed further..");
                //Create an instance of the task
                ITask task = (ITask)tasksAssembly.CreateInstance(taskFullName, true);
                return task;
            }
            catch (Exception ex)
            {
                eventLog1.WriteEntry("Error occurred while creating Task Instance " + ex.Message);
            }
            return null;
        }
    }
}