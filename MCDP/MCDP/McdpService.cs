using System;
using System.Configuration;
using System.ServiceProcess;
using System.Timers;
using Soti.MCDP.DataProcess;

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
        private double pollinginterval;

        // this timer is used to schedule the calls to the database according to the polling interval.
        Timer mcdpTimer = null;

        private DataProcessProvider _dataProcessProvider = null;

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
            this.initPollService();
        }

        /// <summary>
        /// This method stops the polling Timer each time the service is stopped
        /// </summary>
        protected override void OnStop()
        {
            this.stopPollService();
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void initPollService()
        {
            this.pollinginterval = Convert.ToDouble(ConfigurationManager.AppSettings["pollinginterval"]);
            
            //LOADING Process PROVIDER
            _dataProcessProvider = new DataProcessProvider();

            this.mcdpTimer = new System.Timers.Timer(this.pollinginterval);
            this.mcdpTimer.Enabled = true;
            this.mcdpTimer.AutoReset = true;
            this.mcdpTimer.Elapsed += mcdpTimerProcess;
            this.mcdpTimer.Start();
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void stopPollService()
        {
            this.mcdpTimer.Dispose();
        }

        /// <summary>
        /// Start Process
        /// </summary>
        private void mcdpTimerProcess(object sender, ElapsedEventArgs e)
        {
            _dataProcessProvider.McdpTimerProcess();
        }
    }
}