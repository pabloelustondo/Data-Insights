using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.ServiceProcess;
using System.Timers;
using MCDP.model;

namespace MCDP
{
    /// <summary>
    /// MCDP is a windows service that pulls new analytics data comming from mobicontrol 
    /// and sends that data to our input data adapter that will, later, sends this data to the corresponding cloud storage. 
    /// </summary>
    public partial class MCDP : ServiceBase
    {
        int datdatabasetimeout = Convert.ToInt16(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);

        int maxNumberOfConsecutiveDBFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveDBFailures"]);

        int maxNumberOfConsecutiveIDAFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveIDAFailures"]);

        int maxDBRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["DBRetryAfterFailureDelay"]);

        int maxIdaRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["IDARetryAfterFailureDelay"]);
        
        int dBSkippedAfterFailure = 0;

        int idaSkippedAfterFailure = 0;

        int numberOfConsecutiveDBFailures = 0;

        int numberOfConsecutiveIDAFailures = 0;

        // get Unput Data Adapter (Ida) URL. 
        string idaUrl = ConfigurationManager.AppSettings["IdaUrl"];
       
        // this timer is used to schedule the calls to the database according to the polling interval.
        Timer mcdpTimer = null;

        // TODO: Inject some hard dependencies for mocked unit testing..unless you are fine with doing integration test directly.

        // get mobicontrol Db connections string from config file
        string mobicontrolDatabaseConnectionString = ConfigurationManager.ConnectionStrings["MobiControlDB"].ConnectionString;

        // get polling interval. This setting will determine how fast we poll the database to get posible new data
        double pollinginterval = Convert.ToDouble(ConfigurationManager.AppSettings["pollinginterval"]);

        bool processing = false;

             // this variable is used to avoid starting one new process before finishing the other one.
        int servicesReceiveTimeout = Convert.ToInt16(ConfigurationManager.AppSettings["servicesReceiveTimeout"]);

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
        /// This method calls the database to confirm that the data has been received correctly.
        /// </summary>
        private void confirmData(bool pass)
        {
            SqlConnection sqlConnection = new SqlConnection(this.mobicontrolDatabaseConnectionString);
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Update", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;
          
            sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatInt");

            if (pass)
            {
                DeviceSyncStatus _DeviceSyncStatus = this.getLastSyncTime();

                sqlCommand.Parameters.AddWithValue("@Status", 0);
                sqlCommand.Parameters.AddWithValue("@PreviousSyncTime", _DeviceSyncStatus.LastSyncTime);
            }
            else
            {
                sqlCommand.Parameters.AddWithValue("@Status", -1);
            }

            sqlCommand.CommandTimeout = this.datdatabasetimeout;

            sqlCommand.ExecuteNonQuery();
            sqlConnection.Close();
        }

        /// <summary>
        /// This method calls the database to get data calling a store procedure. A connection is openned and closed.
        /// </summary>
        private DeviceSyncStatus getLastSyncTime()
        {
            SqlConnection sqlConnection = null;
            SqlDataReader rdr = null;
            DeviceSyncStatus _DeviceSyncStatus = new DeviceSyncStatus();
            try
            {
                sqlConnection = new SqlConnection(this.mobicontrolDatabaseConnectionString);
                sqlConnection.Open();
               
                SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Get", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.CommandTimeout = this.datdatabasetimeout;

                rdr = sqlCommand.ExecuteReader();

                while (rdr.Read())
                {
                    _DeviceSyncStatus.Name = rdr["Name"].ToString();
                    _DeviceSyncStatus.Status = rdr["Status"].ToString();
                    _DeviceSyncStatus.LastSyncTime = rdr["LastSyncTime"].ToString();
                    _DeviceSyncStatus.PreviousSyncTime = rdr["PreviousSyncTime"].ToString();
                    _DeviceSyncStatus.ServerTime = rdr["ServerTime"].ToString();
                }
            }
            finally
            {
                if (sqlConnection != null)
                    {sqlConnection.Close();}
                if (rdr != null)
                    {rdr.Close();}
            }
            return _DeviceSyncStatus;
        }

        /// <summary>
        /// This method calls the database to get data calling a store procedure. A connection is openned and closed.
        /// </summary>
        private Data4Ida getBIData()
        {
            SqlConnection sqlConnection = new SqlConnection(this.mobicontrolDatabaseConnectionString);
            sqlConnection.Open();

            SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceStatInt_GetAll",sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = this.datdatabasetimeout;

            DataSet ds = new DataSet();
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            sqlDataAdapter.Fill(ds);

            var idaData = this.map2Ida(ds);

            sqlConnection.Close();
            return idaData;
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void initPollService()
        {
            this.mcdpTimer = new System.Timers.Timer(this.pollinginterval);
            this.mcdpTimer.Enabled = true;
            this.mcdpTimer.AutoReset = true;
            this.mcdpTimer.Start();
            this.mcdpTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.mcdpTimerProcess);
        }

        private void Log(string message)
        {
            StreamWriter streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            streamWriter.WriteLine(message);
            streamWriter.Close();
            streamWriter = null;
        }

        private Data4Ida map2Ida(DataSet ds)
        {
            Data4Ida idaData = null;

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                // so we have something
                idaData = new Data4Ida();
                idaData.createdAt = DateTime.Now.ToString();
                idaData.metadata = "data from MCDA.DeviceStatInt_GetAll....";
                idaData.data = new List<DataRow4Ida>();

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    var idaDataRow = new DataRow4Ida();
                    idaDataRow.dev_id = ((int)dr["DeviceId"]).ToString();
                    idaDataRow.server_time_stamp = (DateTime)dr["TimeStamp"];
                    idaDataRow.stat_type = (int)dr["StatType"];
                    idaDataRow.int_value = Convert.ToInt16((long)dr["IntValue"]); // TODO: type problem!
                    idaDataRow.time_stamp = (DateTime)dr["TimeStamp"]; // TODO: - Put the real field for device time here
                    idaData.data.Add(idaDataRow);
                }
            }

            return idaData;
        }

        /// <summary>
        /// This process will run every interval, pool the database and then call Ida to send the data that has been received
        /// The process will count the times a possible DB failure occurs and will stop when this nnumbers has reached a configurable maximun.
        /// When the maximun is reached the process will skip as many cycles as defined in the delay.
        /// </summary>
        private void mcdpTimerProcess(object sender, ElapsedEventArgs e)
        {
            if (this.processing) return;
            this.processing = true; // this avvoid running one process when the other did not finish.

            if (this.numberOfConsecutiveDBFailures < this.maxNumberOfConsecutiveDBFailures
                && this.numberOfConsecutiveIDAFailures < this.maxNumberOfConsecutiveIDAFailures)
            {
                // we only call the database is the number of failures of any type is less than the permitted. 
                try
                {
                    var idaData = this.getBIData();
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    if (idaData != null && idaData.data != null && idaData.data.Count > 0)
                    {
                        var idaDataJson = Newtonsoft.Json.JsonConvert.SerializeObject(idaData);
                        logMessage += "new data to be sent:  " + idaDataJson;

                        // send for real
                        try
                        {
                            this.sendData2Ida(idaData);

                            this.confirmData(true); // this shouuld go somewhere else later... 
                        }
                        catch (Exception eIda)
                        {
                            // this expcetion is due to problems when sending data to input data adapter
                            this.numberOfConsecutiveIDAFailures += 1;
                            this.confirmData(false);
                            this.Log("Error communicating with input data adapter: " + eIda.ToString());
                        }
                    }

                    // write to log the success of the operation
                    this.Log(logMessage);
                }
                catch (Exception eDB)
                {
                    // we assume this exception is due to DB reasons as this is the only code that may rise exception at this point
                    this.numberOfConsecutiveDBFailures += 1;
                    
                    this.Log("Error reading database: " + eDB.ToString());
                }
            }
            else
            {
                // if we are here the number of failures have reached a maximun. so now we need to wait a number of cycles as defined in the delay
                // we are gong to wait until both 
                if (this.dBSkippedAfterFailure < this.maxDBRetryAfterFailureDelay
                    || this.idaSkippedAfterFailure < this.maxIdaRetryAfterFailureDelay)
                {
                    // we need to wait still. We increse both as same time becuase both are waiting at the same time.
                    this.dBSkippedAfterFailure += 1;

                    // we need to wait still
                    this.idaSkippedAfterFailure += 1;
                }
                else
                {
                    // this is the last skipped cycle. We have waited for probably both cases so we clear the number of retrials for the new cycle to kick in again
                    this.numberOfConsecutiveDBFailures = 0;
                    this.numberOfConsecutiveIDAFailures = 0;
                    this.dBSkippedAfterFailure = 0;
                    this.idaSkippedAfterFailure = 0;
                }

                this.Log("Skipping Cycling due to reach maximum retry and failure count.");
            }

            this.processing = false; // this will enable other attempts to process to go ahead.
        }

        /// <summary>
        /// This method is the one that actully send data to the input data adapter
        /// </summary>
        private void sendData2Ida(Data4Ida ida4Data)
        {
            // TODO: is too bad that here we will send the post one by one... we need to send a chunk..and we are sending one by one
            foreach (var data in ida4Data.data)
            {
                string result = string.Empty;
                string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                string url = this.idaUrl;
                using (var client = new WebClient())
                {
                    client.Headers["x-api-key"] = "blah";
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    this.Log("http request to send            url: " + url + "           data: " + json);
                    result = client.UploadString(url, "POST", json);

                    // client.UploadString will rise a web exception is communication did not go well (sure?)
                }
            }
        }

        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void stopPollService()
        {
            this.mcdpTimer.Dispose();
        }
    }
}