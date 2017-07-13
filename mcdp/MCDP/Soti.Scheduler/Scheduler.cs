using Newtonsoft.Json;
using Soti.MCDP.ConfigSet.Model;
using Soti.MCDP.Logger.Model;
using Soti.MCDP.Metadata;
using Soti.MCDP.Metadata.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Timers;

namespace Soti.MCDP.Scheduler
{
    public sealed class Scheduler 
    {
        private static ManualResetEvent _doneEvent;
        private static int _numBusy;
        private const string DateFormatString = "MM/dd/yyyy HH:mm";
        private static bool _workInProgress;
        
        /// <summary>
        ///     get Data Tracker Path.
        /// </summary>
        private readonly string _metaDataTrackerPath;

        /// <summary>
        ///     get Data Tracker Path.
        /// </summary>
        private readonly string _dataTrackerPath;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private readonly Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private readonly Dictionary<string, mcMetadata> _metaDataList;
        /// <summary>
        /// MC MetaDatas
        /// </summary>
        private readonly List<mcMetadata> _mcMetadatas;

        /// <summary>
        /// IdaEndpoint
        /// </summary>
        private readonly IdaEndpoint _idaEndpoints;

        public Scheduler(IdaEndpoint idaEndpoints, List<mcMetadata> mcMetadatas)
        {
            this._idaEndpoints = idaEndpoints;
            this._mcMetadatas = mcMetadatas;

            this._deviceSyncStausList = new Dictionary<string, DeviceSyncStatus>();
            this._metaDataList = new Dictionary<string, mcMetadata>();
            
            _metaDataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                ConfigurationManager.AppSettings["MetaDataTracker"]);

            _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                ConfigurationManager.AppSettings["DataTracker"]);
        }
        public void LoadTasksIntoDataSet()
        {
            try
            {
                ExtractMetaDataList();
                ExtractDataTracker();
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "Schedule LoadTasksIntoDataSet Failed!" + ex);
            }
        }
       
        public void RunTasks(object sender, ElapsedEventArgs args)
        {
            //If the processing of RunTasks lasts longer than the Timer's interval, RunTasks could be called
            //again before the previous call finished. To overcome this, using a bool variable workInProgress to track if this method is in progress
            //If not, go ahead else return
            if (_workInProgress) return;
            _numBusy = 0;
            // LoadTasksIntoDataSet();
            _doneEvent = new ManualResetEvent(false);
            var tasksList = GetTasksToRun();
            _numBusy = tasksList.Count; //Number of threads to create is not constant, depends on the tasks ready to run at a given time
            if (_numBusy > 0)
            {
                _workInProgress = true;
                foreach (var task in tasksList)
                {
                    ThreadPool.QueueUserWorkItem(DoTask, task);
                }
                _doneEvent.WaitOne();
            }
            //All scheduled tasks completed, persist the tasks data to disk,iteration over
            if (_numBusy != 0 || tasksList.Count <= 0) return;
            _workInProgress = false;
            UpdateTasksConfigonDisk();
        }
        public void UpdateTasksConfigonDisk()
        {
            try
            {
                var json = new Dictionary<string, mcMetadata>();
                // serialize JSON to a string and then write string to a file
                if (File.Exists(_metaDataTrackerPath))
                {
                    json = JsonConvert.DeserializeObject<Dictionary<string, mcMetadata>>(File.ReadAllText(_metaDataTrackerPath));

                    foreach (var row in _metaDataList)
                    {
                        if (json.ContainsKey(row.Key))
                        {
                            json[row.Key] = _metaDataList[row.Key];
                        }
                        else
                        {
                            json.Add(row.Key, _metaDataList[row.Key]);
                        }
                    }
                }
                else
                {
                    foreach (var row in _metaDataList)
                    {
                        json.Add(row.Key, _metaDataList[row.Key]);
                    }
                }
                File.WriteAllText(_metaDataTrackerPath, JsonConvert.SerializeObject(json));
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "Scheduler UpdateTasksConfigonDisk Failed!" + ex);
            }
        }
        
        private void DoTask(object o)
        {
            var task = o as IMetadata;
            if (task == null) return;
            try
            {
                //Event Log, starting task at this time.
                var idaData = task.RetrieveDataByMetadata();
                if (idaData != "")
                {
                    //var watch = System.Diagnostics.Stopwatch.StartNew();
                    SendData2Ida(idaData, task.TableName);
                    //watch.Stop();
                    task.ConfirmStatusData(true);
                    // this shouuld go somewhere else later... 

                    // write to log the success of the operation
                    //Logger.Logger.Log(LogSeverity.Info, "DeviceStatInt new data has been sent. Total Size: "
                    //    + ASCIIEncoding.ASCII.GetByteCount(idaData) / 1024 + "kilobyte."
                    //    + " Total Time: " + watch.ElapsedMilliseconds / 1000 + "sec");
                    //Task completed successfuly at this time
                    UpdateNextRunTime(task.TableName);
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "DoTask Failed!" + ex);
            }
            finally
            {
                if (Interlocked.Decrement(ref _numBusy) == 0)
                {
                    _doneEvent.Set();
                }
            }
        }
        
        private List<IMetadata> GetTasksToRun()
        {
            if (_metaDataList.Count == 0) return null;
            var tasks = new List<IMetadata>();
            foreach (var row in _metaDataList)
            {
                var scheduledTime = DateTime.Parse(row.Value.scheduledTime);
                if (DateTime.Now < scheduledTime) continue;
                var task = CreateTaskInstance(row.Value);
                if (task != null)
                    tasks.Add(task);
            }
            return tasks;
        }
        private IMetadata CreateTaskInstance(mcMetadata task)
        {
            try
            {
                var type = new MetadataType
                {
                BatcheSize = task.batchSize,
                Filter = null,
                Projections = null,
                Repeat = task.repeat,
                ScheduledTime = task.scheduledTime,
                TableName = task.tableName,
                TimeColumnName = task.timeColumnName               
                };
           
                return new MetadataProvider(type, _deviceSyncStausList);           
            }
            catch (Exception ex)
            {
                //_eventLog1.WriteEntry("Error occurred while creating Task Instance " + ex.Message);
            }
            return null;
        }

        private static DataTable ToDataTable(IEnumerable<mcMetadata> collection)
        {
            DataTable dt = new DataTable("DataTable");
            Type t = typeof(mcMetadata);
            PropertyInfo[] pia = t.GetProperties();

            //Inspect the properties and create the columns in the DataTable
            foreach (PropertyInfo pi in pia)
            {
                Type ColumnType = pi.PropertyType;
                if ((ColumnType.IsGenericType))
                {
                    ColumnType = ColumnType.GetGenericArguments()[0];
                }
                dt.Columns.Add(pi.Name, ColumnType);
            }

            //Populate the data table
            foreach (var item in collection)
            {
                DataRow dr = dt.NewRow();
                dr.BeginEdit();
                foreach (PropertyInfo pi in pia)
                {
                    if (pi.GetValue(item, null) != null)
                    {
                        dr[pi.Name] = pi.GetValue(item, null);
                    }
                }
                dr.EndEdit();
                dt.Rows.Add(dr);
            }
            return dt;
        }

        //Schedule Metadata Tracker
        private void ExtractMetaDataList()
        {
            foreach (var data in _mcMetadatas)
            {  
                if(!_metaDataList.ContainsKey(data.tableName))
                    _metaDataList.Add(data.tableName, data);
                else
                {
                    _metaDataList[data.tableName] = data;
                }
            }
        }

        //Schedule Metadata Tracker
        private void ExtractDataTracker()
        {
            if (!File.Exists(_dataTrackerPath)) return;

            var result =
                JsonConvert.DeserializeObject<Dictionary<string, DeviceSyncStatus>>(
                    File.ReadAllText(_dataTrackerPath));

            if (result == null) return;

            foreach (var item in result)
            {
                //ignore inprogress when restart services.
                if (item.Value.Status == Status.Inprogress)
                {
                    item.Value.Status = Status.Failed;
                }
                _deviceSyncStausList.Add(item.Key, item.Value);
            }
        }
        //updating the dataset is not thread safe
        private void UpdateNextRunTime(string taskName)
        {
            if (_metaDataList.Count == 0) return;
            foreach (var row in _metaDataList)
            {
                if (!string.Equals(taskName, row.Key, StringComparison.CurrentCultureIgnoreCase)) continue;
                var scheduledTime = DateTime.Parse(row.Value.scheduledTime);
                var repeat = row.Value.repeat.ToUpper();
                switch (repeat)
                {
                    case "M":
                        while (scheduledTime < DateTime.Now)
                        {
                            scheduledTime = scheduledTime.AddMinutes(1);
                        }
                        break;
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
                    default:
                        while (scheduledTime < DateTime.Now)
                        {
                            if (int.TryParse(repeat, out int intValue))
                                scheduledTime = scheduledTime.AddMinutes(intValue);
                        }
                        break;
                }
                row.Value.scheduledTime = scheduledTime.ToString(DateFormatString);
                _metaDataList[row.Key] = row.Value;
            }
        }

        /// <summary>
        ///     This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="ida4Data">ida for Data.</param>
        /// <param name="tableName"></param>
        private void SendData2Ida(string ida4Data, string tableName)
        {
            var json = new StringBuilder();
            json.Append("\"metadata\": { \"dataSetId\": \"");
            json.Append(tableName);
            json.Append("\"},");
            json.Append("\"data\": ");
            json.Append(ida4Data);
            //json.Append("}");
            var data = json.ToString();
            try
            {
                using (var client = new WebClient())
                {
                    //client.Headers["x-api-key"] = "blah";
                    client.Headers["x-access-token"] = _idaEndpoints.ExpiredJwtToken;
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    ServicePointManager.ServerCertificateValidationCallback +=
                        (sender, certificate, chain, sslPolicyErrors) => true;

                    var result = client.UploadString(_idaEndpoints.IdaSendDataUrl, "POST", json.ToString());
                    
                    Logger.Logger.Log(Classifier.CreateSuccess,Priority.Info,"Send Data To IDA Success.");
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "Send Data To IDA Failed!" + ex);
            }
        }
    }
}