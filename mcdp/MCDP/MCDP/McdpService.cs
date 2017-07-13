using Soti.MCDP.ConfigSet.Model;
using Soti.MCDP.Logger.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.ServiceProcess;
using System.Timers;
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
        private readonly Timer _mcdpTimer = null;

        private Scheduler.Scheduler _scheduler;

        /// <summary>
        ///     List of Metadata
        /// </summary>
        private List<mcMetadata> _metadataList;


        /// <summary>
        ///     List of Endpoints
        /// </summary>
        private IdaEndpoint _idaEndpoints;

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
                this._metadataList = ConfigSet.ConfigSet.Instance.MetadataList;
                this._idaEndpoints = ConfigSet.ConfigSet.Instance.IdaEndpoints;

                this._scheduler = new Scheduler.Scheduler(_idaEndpoints, _metadataList);

                _scheduler.LoadTasksIntoDataSet();
                
                this._pollinginterval = Convert.ToDouble(ConfigurationManager.AppSettings["pollinginterval"]);

                //make default min value to 1 sec
                if (this._pollinginterval < 1000)
                    this._pollinginterval = 1000;
                //LOADING Process PROVIDER

                //this._mcdpTimer = new Timer(this._pollinginterval)
                //{
                //    Enabled = true,
                //    AutoReset = true
                //};
                //this._mcdpTimer.Elapsed += _scheduler.RunTasks;
                //this._mcdpTimer.Start();

                _scheduler.RunTasks(null, null);
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "InitPollService Failed!" + ex);
            }
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void StopPollService()
        {
            try
            {
                _scheduler.UpdateTasksConfigonDisk();
                this._mcdpTimer.Stop();
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.CreateError, Priority.Critical, "StopPollService Failed!" + ex);
            }
            finally
            {
                this._mcdpTimer.Dispose();
            }
        }      
    }
}