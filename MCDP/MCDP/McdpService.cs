using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.IO;
using Newtonsoft.Json.Serialization;
using System.Net;

namespace MCDP
{




    /// <summary>
    /// This class represents a new set of records that is going to be sent to the input data adapter
    /// </summary>
    public class Data4Ida
    {
        public string metadata;
        public string createdAt;
        public List<DataRow4Ida> data;
    }

    /// <summary>
    /// Used in the previous type, this class represents a specific row of the  records that are going to be sent to the input data adapter
    /// </summary>
    public class DataRow4Ida
    {

        public string dev_id;
        public DateTime server_time_stamp;
        public int stat_type;
        public int int_value;
        public DateTime time_stamp;
    }



    /// <summary>
    /// MCDP is a windows service that pulls new analytics data comming from mobicontrol 
    /// and sends that data to our input data adapter that will, later, sends this data to the corresponding cloud storage. 
    /// </summary>
    public partial class MCDP : ServiceBase
    {    
        //TODO: Inject some hard dependencies for mocked unit testing..unless you are fine with doing integration test directly.

        //get mobicontrol Db connections string from config file
        string mobicontrolDatabaseConnectionString = ConfigurationManager.ConnectionStrings["MobiControlDB"].ConnectionString;

        //get polling interval. This setting will determine how fast we poll the database to get posible new data
        double pollinginterval = Convert.ToDouble(ConfigurationManager.AppSettings["pollinginterval"]);

        //get Unput Data Adapter (Ida) URL. 
        string idaUrl = ConfigurationManager.AppSettings["IdaUrl"];

        int maxNumberOfConsecutiveDBFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveDBFailures"]);
        int maxNumberOfConsecutiveIDAFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveIDAFailures"]);
        int dBRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["DBRetryAfterFailureDelay"]);
        int idaRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["IDARetryAfterFailureDelay"]);

        int numberOfConsecutiveDBFailures = 0;
        int numberOfConsecutiveIDAFailures = 0;

        int dBSkippedAfterFailure = 0;
        int idaSkippedAfterFailure = 0;

        bool processing = false;  //this variable is used to avoid starting one new process before finishing the other one.

        //this timer is used to schedule the calls to the database according to the polling interval.
        System.Timers.Timer mcdpTimer = null;

        public MCDP()
        {
            InitializeComponent();
        }

        public void OnDebug() {
      
            OnStart(null);
        }

        /// <summary>
        /// This method starts the polling Timer each time the service is started
        /// </summary>
        protected override void OnStart(string[] args)
        {
            initPollService();
        }

        /// <summary>
        /// This method stops the polling Timer each time the service is stopped
        /// </summary>
        protected override void OnStop()
        {
            stopPollService();
        }

        /// <summary>
        /// This method calls the database to get data calling a store procedure. A connection is openned and closed.
        /// </summary>
        private Data4Ida getBIData()
        {

            SqlConnection sqlConnection = new SqlConnection(mobicontrolDatabaseConnectionString);
            sqlConnection.Open();

            SqlCommand sqlCommand = new SqlCommand();
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandText = "BI.BI_DeviceStatInt_GetAll";
            sqlCommand.Connection = sqlConnection;

            DataSet ds = new DataSet();
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            sqlDataAdapter.Fill(ds);

            var idaData = map2Ida(ds);

            sqlConnection.Close();
            return idaData;

        }

        /// <summary>
        /// This method calls the database to confirm that the data has been received correctly.
        /// </summary>
        private void confirmData()
        {
            SqlConnection sqlConnection = new SqlConnection(mobicontrolDatabaseConnectionString);
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand();
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandText = "BI.BI_DeviceSyncStatus_Update";
            sqlCommand.Connection = sqlConnection;
            sqlCommand.ExecuteNonQuery();
            sqlConnection.Close();
        }


        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void initPollService()
        {
            mcdpTimer = new System.Timers.Timer(pollinginterval);
            mcdpTimer.Enabled = true;
            mcdpTimer.AutoReset = true;
            mcdpTimer.Start();
            mcdpTimer.Elapsed += new System.Timers.ElapsedEventHandler(mcdpTimerProcess);
        }


        /// <summary>
        /// This method initialize the polling process that will run in a loop each polling interval
        /// </summary>
        private void stopPollService()
        {
            mcdpTimer.Dispose();
        }


        private Data4Ida map2Ida(DataSet ds)
            {

                Data4Ida idaData = null;

                if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
                {
                    //so we have something

                    idaData = new Data4Ida();
                    idaData.createdAt = DateTime.Now.ToString();
                    idaData.metadata = "data from BI.BI_DeviceStatInt_GetAll....";
                    idaData.data = new List<DataRow4Ida>();

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {

                    var idaDataRow = new DataRow4Ida();
                    idaDataRow.dev_id = ((int)dr["DeviceId"]).ToString();
                    idaDataRow.server_time_stamp = (DateTime)dr["TimeStamp"];
                    idaDataRow.stat_type = (int)dr["StatType"];
                    idaDataRow.int_value = Convert.ToInt16((long)dr["IntValue"]);  //TODO: type problem!
                    idaDataRow.time_stamp = (DateTime)dr["TimeStamp"]; //TODO: - Put the real field for device time here
                    idaData.data.Add(idaDataRow);

                }

                }
            return idaData;

        }

        /// <summary>
        /// This method is the one that actully send data to the input data adapter
        /// </summary>
        private void sendData2Ida(Data4Ida ida4Data) {
            //TODO: is too bad that here we will send the post one by one... we need to send a chunk..and we are sending one by one

            foreach (var data in ida4Data.data) { 
            string result = "";
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            string url = idaUrl;
            using (var client = new WebClient())
            {
                client.Headers["x-api-key"] = "blah";
                client.Headers[HttpRequestHeader.ContentType] = "application/json";

                Log("http request to send            url: " + url + "           data: " + json);
                result = client.UploadString(url, "POST", json);

                //client.UploadString will rise a web exception is communication did not go well (sure?)
            }
            }

        }

        /// <summary>
        /// This process will run every interval, pool the database and then call Ida to send the data that has been received
        /// The process will count the times a possible DB failure occurs and will stop when this nnumbers has reached a configurable maximun.
        /// When the maximun is reached the process will skip as many cycles as defined in the delay.
        /// </summary>
        private void mcdpTimerProcess(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (processing) return; processing = true;  //this avvoid running one process when the other did not finish.


            if (numberOfConsecutiveDBFailures < maxNumberOfConsecutiveDBFailures && numberOfConsecutiveIDAFailures < maxNumberOfConsecutiveIDAFailures)
            {//we only call the database is the number of failures of any type is less than the permitted. 
                try
                {

                    var idaData = getBIData();
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    if (idaData != null && idaData.data != null && idaData.data.Count > 0)
                    {
                        var idaDataJson = Newtonsoft.Json.JsonConvert.SerializeObject(idaData);
                        logMessage += "new data to be sent:  " + idaDataJson;
                        //send for real

                            try
                            {
                                sendData2Ida(idaData);
                            }
                            catch (Exception eIda)
                            {
                                //this expcetion is due to problems when sending data to input data adapter
                                numberOfConsecutiveIDAFailures += 1;
                                Log("Error communicating with input data adapter: " + eIda.ToString());
                            }

                    }

                    confirmData();  //this shouuld go somewhere else later... 

                    //write to log the success of the operation
                    Log(logMessage);
                }
                catch (Exception eDB)
                {//we assume this exception is due to DB reasons as this is the only code that may rise exception at this point

                    numberOfConsecutiveDBFailures += 1;
                    Log("Error reading database: " + eDB.ToString());
                }

            }
            else {
                //if we are here the number of failures have reached a maximun. so now we need to wait a number of cycles as defined in the delay
                //we are gong to wait until both 
                if (dBSkippedAfterFailure < dBRetryAfterFailureDelay || idaSkippedAfterFailure < idaRetryAfterFailureDelay)
                {
                    //we need to wait still. We increse both as same time becuase both are waiting at the same time.
                    dBSkippedAfterFailure += 1;
                    //we need to wait still
                    idaSkippedAfterFailure += 1;
                }
                else {
                    //this is the last skipped cycle. We have waited for probably both cases so we clear the number of retrials for the new cycle to kick in again
                    numberOfConsecutiveDBFailures = 0;
                    numberOfConsecutiveIDAFailures = 0;
                }

            }
            processing = false; //this will enable other attempts to process to go ahead.
        }


        private void Log(string message)
        {
            StreamWriter streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            streamWriter.WriteLine(message);
            streamWriter.Close();
            streamWriter = null;

        }

    }
}
