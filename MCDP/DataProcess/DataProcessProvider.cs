using Soti.MCDP.Database;
using Soti.MCDP.Database.Model;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;


namespace Soti.MCDP.DataProcess
{
    /// <summary>
    /// Process Provider sends that data to our input data adapter that will, later, sends this data to the corresponding cloud storage. 
    /// </summary>
    public class DataProcessProvider : IDataProcessProvider
    {
        /// <summary>
        /// Max Number Of Consecutive DB Failures
        /// </summary>
        private readonly int maxNumberOfConsecutiveDBFailures;

        /// <summary>
        /// Max Number Of Consecutive IDA Failures
        /// </summary>
        private readonly int maxNumberOfConsecutiveIDAFailures;

        /// <summary>
        /// Max Number Of DB Retry after Failures
        /// </summary>
        private readonly int maxDBRetryAfterFailureDelay;

        /// <summary>
        /// Max Number Of IDA Retry after Failures
        /// </summary>
        private readonly int maxIdaRetryAfterFailureDelay;

        /// <summary>
        /// get Unput Data Adapter (Ida) URL. 
        /// </summary>
        private readonly string idaUrl;


        int dBSkippedAfterFailure = 0;

        int idaSkippedAfterFailure = 0;

        int numberOfConsecutiveDBFailures = 0;

        int numberOfConsecutiveIDAFailures = 0;

        bool processing = false;

        private DeviceStatIntProvider _deviceStatIntProvider = null;

         /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatIntProvider"/> class.
        /// </summary>
        public DataProcessProvider()
        {
            this.maxNumberOfConsecutiveDBFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveDBFailures"]);
            this.maxNumberOfConsecutiveIDAFailures = Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveIDAFailures"]);
            this.maxDBRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["DBRetryAfterFailureDelay"]);
            this.maxIdaRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["IDARetryAfterFailureDelay"]);
            this.idaUrl = ConfigurationManager.AppSettings["IdaUrl"];
            
            //LOADING DATABASE PROVIDER
            this._deviceStatIntProvider = new DeviceStatIntProvider();
        }

        /// <summary>
        /// Start MCDP Process.
        /// </summary>
        public void McdpTimerProcess()
        {
            if (this.processing)
            {
                return;
            }
            else
            {
                this.processing = true; // this avvoid running one process when the other did not finish.
            }

            if (this.numberOfConsecutiveDBFailures < this.maxNumberOfConsecutiveDBFailures
                && this.numberOfConsecutiveIDAFailures < this.maxNumberOfConsecutiveIDAFailures)
            {
                // we only call the database is the number of failures of any type is less than the permitted. 
                try
                {
                    var idaData = this._deviceStatIntProvider.GetDeviceStatIntData();
                    var logMessage = DateTime.Now.ToString() + "  =>  ";

                    if (idaData != null && idaData.data != null && idaData.data.Count > 0)
                    {
                        var idaDataJson = Newtonsoft.Json.JsonConvert.SerializeObject(idaData);
                        logMessage += "new data to be sent:  " + idaDataJson;

                        // send for real
                        try
                        {
                            this.SendData2Ida(idaData);
                        }
                        catch (Exception ex)
                        {
                            // this expcetion is due to problems when sending data to input data adapter
                            this.numberOfConsecutiveIDAFailures += 1;
                            this._deviceStatIntProvider.ConfirmData(false);
                            Log("Error communicating with input data adapter: " + ex.ToString());
                        }
                    }

                    this._deviceStatIntProvider.ConfirmData(true); // this shouuld go somewhere else later... 

                    // write to log the success of the operation
                    Log(logMessage);
                }
                catch (Exception eDB)
                {
                    // we assume this exception is due to DB reasons as this is the only code that may rise exception at this point
                    this.numberOfConsecutiveDBFailures += 1;
                    
                    Log("Error reading database: " + eDB.ToString());
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

                Log("Skipping Cycling due to reach maximum retry and failure count.");
            }

            this.processing = false; // this will enable other attempts to process to go ahead.
        }

        /// <summary>
        /// Log Service
        /// </summary>
        /// <param name="message">Log Message.</param>
        private static void Log(string message)
        {
            StreamWriter streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            streamWriter.WriteLine(message);
            streamWriter.Close();
            streamWriter = null;
        }

        /// <summary>
        /// This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="ida4Data">ida for Data.</param>
        private void SendData2Ida(Data4Ida ida4Data)
        {
            //// TODO: is too bad that here we will send the post one by one... we need to send a chunk..and we are sending one by one
            //foreach (var data in ida4Data.data)
            //{
            string result = string.Empty;
            StringBuilder json = new StringBuilder();
            json.Append("{\"stats\":");
            json.Append(Newtonsoft.Json.JsonConvert.SerializeObject(ida4Data.data));
            json.Append("}");

            string url = this.idaUrl;
            using (var client = new WebClient())
            {
                client.Headers["x-api-key"] = "blah";
                client.Headers[HttpRequestHeader.ContentType] = "application/json";

                Log("http request to send            url: " + url + "           data: " + json);
                result = client.UploadString(url, "POST", json.ToString());

                // client.UploadString will rise a web exception is communication did not go well (sure?)
            }
            //}
        }
    }
}
