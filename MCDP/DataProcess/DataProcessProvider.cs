using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Net;
using System.Text;
using Newtonsoft.Json;
using Soti.MCDP.Database;
using Soti.MCDP.Database.Model;

namespace Soti.MCDP.DataProcess
{
    /// <summary>
    ///     Process Provider sends that data to our input data adapter that will, later, sends this data to the corresponding
    ///     cloud storage.
    /// </summary>
    public class DataProcessProvider : IDataProcessProvider
    {
        /// <summary>
        ///     get Data Tracker Path.
        /// </summary>
        private readonly string _dataTrackerPath;

        /// <summary>
        ///     get Unput Data Adapter (Ida) URL.
        /// </summary>
        private readonly string _idaHandShakeUrl;

        /// <summary>
        ///     get Unput Data Adapter (Ida) URL.
        /// </summary>
        private readonly string _idaUrl;

        /// <summary>
        ///     get JWT Token Path.
        /// </summary>
        private readonly string _jwtTokenPath;

        /// <summary>
        ///     Max Number Of DB Retry after Failures
        /// </summary>
        private readonly int _maxDbRetryAfterFailureDelay;

        /// <summary>
        ///     Max Number Of IDA Retry after Failures
        /// </summary>
        private readonly int _maxIdaRetryAfterFailureDelay;

        /// <summary>
        ///     Max Number Of Consecutive DB Failures
        /// </summary>
        private readonly int _maxNumberOfConsecutiveDbFailures;

        /// <summary>
        ///     Max Number Of Consecutive IDA Failures
        /// </summary>
        private readonly int _maxNumberOfConsecutiveIdaFailures;
        
        private readonly int _batchSize;

        private int _dBSkippedAfterFailure;

        private int _idaSkippedAfterFailure;

        private int _numberOfConsecutiveDbFailures;

        private int _numberOfConsecutiveIdaFailures;

        /// <summary>
        ///     get Expired JWT Token from IDA.
        /// </summary>
        private string _expiredJwtToken;

        /// <summary>
        /// get JWT Token from IDA.
        /// </summary>
        private string _jwtToken;

        private bool _processing;

        private IDeviceStatApplicationProvider _deviceStatApplicationProvider;

        private IDeviceStatIntProvider _deviceStatIntProvider;
       
        private Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatIntProvider" /> class.
        /// </summary>
        public DataProcessProvider()
        {
            _maxNumberOfConsecutiveDbFailures =
                Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveDBFailures"]);
            _maxNumberOfConsecutiveIdaFailures =
                Convert.ToInt16(ConfigurationManager.AppSettings["MaxNumberOfConsecutiveIDAFailures"]);
            _maxDbRetryAfterFailureDelay = Convert.ToInt16(ConfigurationManager.AppSettings["DBRetryAfterFailureDelay"]);
            _maxIdaRetryAfterFailureDelay =
                Convert.ToInt16(ConfigurationManager.AppSettings["IDARetryAfterFailureDelay"]);
            _idaUrl = ConfigurationManager.AppSettings["IdaUrl"];
            _idaHandShakeUrl = ConfigurationManager.AppSettings["idaHandShakeUrl"];

            _jwtTokenPath = Path.Combine(Directory.GetCurrentDirectory(),
                ConfigurationManager.AppSettings["JWTTokenName"]);
            _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                ConfigurationManager.AppSettings["DataTracker"]);
            _batchSize = Convert.ToInt32(ConfigurationManager.AppSettings["batchSize"]);
            //LOADING DATABASE PROVIDER
            Init();
        }

        /// <summary>
        ///     Initialized
        /// </summary>
        public void Init()
        {
            try
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[INFO] JWTTokenPath: " + _jwtTokenPath);
                Log(logMessage + "[INFO] DataTrackerPath: " + _dataTrackerPath);
                if (File.Exists(_jwtTokenPath))
                {
                    _jwtToken = File.ReadAllText(_jwtTokenPath);
                    Log(logMessage + "[INFO] JWTToken: " + _jwtToken);
                    _expiredJwtToken = HandShakeToIda(_jwtToken);
                    Log(logMessage + "[INFO] ExpiredJWTToken: " + _expiredJwtToken);
                }

                _deviceSyncStausList = new Dictionary<string, DeviceSyncStatus>();

                if (File.Exists(_dataTrackerPath))
                {
                    var result =
                        JsonConvert.DeserializeObject<Dictionary<string, DeviceSyncStatus>>(File.ReadAllText(_dataTrackerPath));
                        
                    if (result != null)
                    {
                        foreach (var item in result)
                        {
                            _deviceSyncStausList.Add(item.Key, item.Value);
                        }
                    }
                }

                _deviceStatIntProvider = new DeviceStatIntProvider(_deviceSyncStausList);
                _deviceStatApplicationProvider = new DeviceStatApplicationProvider(_deviceSyncStausList);

            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                Log(logMessage + "[ERROR] " + ex);
            }
        }

        /// <summary>
        ///     Start MCDP Process.
        /// </summary>
        public void McdpTimerProcess()
        {
            if (_processing)
                return;
            _processing = true; // this avvoid running one process when the other did not finish.

            if (_numberOfConsecutiveDbFailures < _maxNumberOfConsecutiveDbFailures
                && _numberOfConsecutiveIdaFailures < _maxNumberOfConsecutiveIdaFailures)
            {
                // we only call the database is the number of failures of any type is less than the permitted. 
                try
                {
                    var idaData = _deviceStatIntProvider.RetrieveDeviceStatIntData(_batchSize);
                    var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                    if (idaData != "")
                        try
                        {
                            SendData2Ida(idaData, "DeviceStatInt");

                            _deviceStatIntProvider.ConfirmStatusData(true); // this shouuld go somewhere else later... 

                            logMessage += "[INFO] new data to be sent.";
                            // write to log the success of the operation
                            Log(logMessage);
                        }
                        catch (Exception ex)
                        {
                            // this expcetion is due to problems when sending data to input data adapter
                            _numberOfConsecutiveIdaFailures += 1;
                            _deviceStatIntProvider.ConfirmStatusData(false);
                            Log(logMessage + "[ERROR] Error communicating with input data adapter: " + ex);
                        }
                }
                catch (Exception eDb)
                {
                    // we assume this exception is due to DB reasons as this is the only code that may rise exception at this point
                    _numberOfConsecutiveDbFailures += 1;

                    Log("[ERROR] Error reading database: " + eDb);
                }

                // we only call the database is the number of failures of any type is less than the permitted. 
                try
                {
                    var idaData = _deviceStatApplicationProvider.RetrieveDeviceStatApplicationData(_batchSize);
                    var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                    if (idaData != "")
                        try
                        {
                            SendData2Ida(idaData, "DeviceStatInt");

                            _deviceStatApplicationProvider.ConfirmStatusData(true); // this shouuld go somewhere else later... 

                            logMessage += "[INFO] new data to be sent.";
                            // write to log the success of the operation
                            Log(logMessage);
                        }
                        catch (Exception ex)
                        {
                            // this expcetion is due to problems when sending data to input data adapter
                            _numberOfConsecutiveIdaFailures += 1;
                            _deviceStatApplicationProvider.ConfirmStatusData(false);
                            Log(logMessage + "[ERROR] Error communicating with input data adapter: " + ex);
                        }
                }
                catch (Exception eDb)
                {
                    // we assume this exception is due to DB reasons as this is the only code that may rise exception at this point
                    _numberOfConsecutiveDbFailures += 1;

                    Log("[ERROR] Error reading database: " + eDb);
                }
            }
            else
            {
                // if we are here the number of failures have reached a maximun. so now we need to wait a number of cycles as defined in the delay
                // we are gong to wait until both 
                if (_dBSkippedAfterFailure < _maxDbRetryAfterFailureDelay
                    || _idaSkippedAfterFailure < _maxIdaRetryAfterFailureDelay)
                {
                    // we need to wait still. We increse both as same time becuase both are waiting at the same time.
                    _dBSkippedAfterFailure += 1;

                    // we need to wait still
                    _idaSkippedAfterFailure += 1;
                }
                else
                {
                    // this is the last skipped cycle. We have waited for probably both cases so we clear the number of retrials for the new cycle to kick in again
                    _numberOfConsecutiveDbFailures = 0;
                    _numberOfConsecutiveIdaFailures = 0;
                    _dBSkippedAfterFailure = 0;
                    _idaSkippedAfterFailure = 0;
                }

                Log("[INFO] Skipping Cycling due to reach maximum retry and failure count.");
            }

            _processing = false; // this will enable other attempts to process to go ahead.
        }

  
        /// <summary>
        ///     Log Service
        /// </summary>
        /// <param name="message">Log Message.</param>
        private static void Log(string message)
        {
            var streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            streamWriter.WriteLine(message);
            streamWriter.Close();
            streamWriter = null;
        }

        /// <summary>
        ///     This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="ida4Data">ida for Data.</param>
        /// <param name="tableName"></param>
        private void SendData2Ida(string ida4Data, string tableName)
        {
            var json = new StringBuilder();
            json.Append("{\"AgentMetadata\": { \"tableName\": \"");
            json.Append(tableName);
            json.Append("\"}, \"Data\": ");
            json.Append(ida4Data);
            json.Append("}");

            var url = _idaUrl;

            try
            {
                using (var client = new WebClient())
                {
                    //client.Headers["x-api-key"] = "blah";
                    client.Headers["x-access-token"] = _expiredJwtToken;
                    client.Headers["TableName"] = tableName;
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    ServicePointManager.ServerCertificateValidationCallback +=
                        (sender, certificate, chain, sslPolicyErrors) => true;

                    //var result = client.UploadString(url, "POST", json.ToString());
                    var result = client.UploadString(url, "POST", ida4Data);
                    var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                    Log(logMessage + "[INFO] (80) " + result);
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                Log(logMessage + "[ERROR] " + ex);
            }
        }

        /// <summary>
        ///     This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="token"></param>
        private string HandShakeToIda(string token)
        {
            dynamic result = string.Empty;

            var url = _idaHandShakeUrl;

            try
            {
                using (var client = new WebClient())
                {
                    //client.Headers["x-api-key"] = "blah";
                    client.Headers["x-access-token"] = token;

                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    ServicePointManager.ServerCertificateValidationCallback +=
                        (sender, certificate, chain, sslPolicyErrors) => true;

                    result = JsonConvert.DeserializeObject<dynamic>(client.DownloadString(url));
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";

                Log(logMessage + "[ERROR] " + ex);
            }
            return result.session_token;
        }
    }
}