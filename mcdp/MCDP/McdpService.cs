using System;
using System.Collections.Generic;
using System.Configuration;
using System.ServiceProcess;
using System.Timers;
using Soti.MCDP.DataProcess;
using Soti.MCDP.Scheduler;
using Soti.MCDP.Scheduler.Model;
namespace Soti.MCDP
{
    /// <summary>
    /// MCDP is a windows service that pulls new analytics data comming from mobicontrol 
    /// and sends that data to our input data adapter that will, later, sends this data to the corresponding cloud storage. 
    /// </summary>
    public partial class MCDP : ServiceBase
    {
        /// <summary>
        /// get polling interval. This setting will determine how fast we poll the database to get posible new data
        /// </summary>
        private double _pollinginterval;

        // this timer is used to schedule the calls to the database according to the polling interval.
        private Timer _mcdpTimer = null;

        private readonly DataProcessProvider _dataProcessProvider = null;

        private Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;
        
        private Scheduler.Scheduler _scheduler;

        public MCDP()
        {
            this.InitializeComponent();
        }

        public void OnDebug()
        {
            this.OnStart(null);
        }

        /// <summary>
        /// This method starts the polling Timer each time the service is started
        /// </summary>
        protected override void OnStart(string[] args)
        {
            this.InitPollService();
        }

        /// <summary>
        /// This method stops the polling Timer each time the service is stopped
        /// </summary>
        protected override void OnStop()
        {
            this.StopPollService();
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void InitPollService()
        {
            try
            {
                this._deviceSyncStausList = new Dictionary<string, DeviceSyncStatus>();

                this._scheduler = new Scheduler.Scheduler(_deviceSyncStausList);

                Scheduler.Scheduler.LoadTasksIntoDataSet();
                Scheduler.Scheduler.LoadTasksAssembly();

                this._pollinginterval = Convert.ToDouble(ConfigurationManager.AppSettings["pollinginterval"]);

                //make default min value to 1 second
                if (this._pollinginterval < 60000)
                    this._pollinginterval = 60000;
                //LOADING Process PROVIDER
                //_dataProcessProvider = new DataProcessProvider(_deviceStatApplicationProvider, _deviceStatIntProvider, _deviceSyncStausList);

                this._mcdpTimer = new Timer(this._pollinginterval)
                {
                    Enabled = true,
                    AutoReset = true
                };
                this._mcdpTimer.Elapsed += Scheduler.Scheduler.RunTasks;
                this._mcdpTimer.Start();
            }
            catch (Exception ex)
            {
                
            }
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void StopPollService()
        {
            try
            {
                Scheduler.Scheduler.UpdateTasksConfigonDisk();
            }
            catch (Exception ex)
            {
            }
            //this._mcdpTimer.Dispose();
        }

        /// <summary>
        /// Start Process
        /// </summary>
        private void McdpTimerProcess(object sender, ElapsedEventArgs e)
        {
            _dataProcessProvider.McdpTimerProcess();
        }
    }
}