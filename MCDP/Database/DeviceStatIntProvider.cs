using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Soti.MCDP.Database.Model;

namespace Soti.MCDP.Database
{
    /// <summary>
    ///     DeviceStatInt provider.
    /// </summary>
    public class DeviceStatIntProvider : IDeviceStatIntProvider
    {
        /// <summary>
        /// TableName
        /// </summary>
        private const string TableName = "DeviceStatInt";

        /// <summary>
        /// Thread Safe
        /// </summary>
        private object _factLock = new object();
        /// <summary>
        ///     get Data Tracker Path.
        /// </summary>
        private readonly string _dataTrackerPath;

        /// <summary>
        /// get database timeout from config file
        /// </summary>
        private readonly int _datdatabaseTimeout;

        /// <summary>
        /// get database connections string from config file
        /// </summary>
        private readonly string _mobicontrolDatabaseConnectionString;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;
        /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatIntProvider" /> class.
        /// </summary>
        public DeviceStatIntProvider(Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
        {
            _deviceSyncStausList = deviceSyncStausList;

            try
            {
                _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                    ConfigurationManager.AppSettings["DataTracker"]);

                _mobicontrolDatabaseConnectionString = DatabaseSection.Load();

                _datdatabaseTimeout = Convert.ToInt32(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
        }

        /// <summary>
        /// Retrieve DeviceStatInt Data
        /// </summary>
        /// <param name="batchSize">pass.</param>
        public string RetrieveDeviceStatIntData(int batchSize)
        {
            var idaData = new List<DeviceStatInt>();
            SqlConnection sqlConnection = null;
            var result = "";
            try
            {
                //time tracker for lasttime
                var lasttime = new object();

                if (_deviceSyncStausList.ContainsKey(TableName) && _deviceSyncStausList[TableName].Status == 1)        //In progress with skipped preventing overlapping
                    return "";
                else if (_deviceSyncStausList.ContainsKey(TableName) && _deviceSyncStausList[TableName].Status == 0)   //previous call is successed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) where TimeStamp > '"
                                        + _deviceSyncStausList[TableName].LastSyncTime +
                                        "' order by [timestamp] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar();
                    }
                }
                else if (_deviceSyncStausList.ContainsKey(TableName) && _deviceSyncStausList[TableName].Status == -1)   //previous call is failed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) where TimeStamp > '"
                                        + _deviceSyncStausList[TableName].PreviousSyncTime +
                                        "' order by [timestamp] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar();
                    }
                }
                else if (!_deviceSyncStausList.ContainsKey(TableName)) //initial stage without data in table
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) order by [timestamp] desc ) a ";


                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar();
                    }
                }
                
                //This is a final data collection taken result from previous conditions
                if (lasttime.ToString() != "")
                {
                        lasttime = ((DateTime)lasttime).ToString("yyyy-MM-ddTHH:mm:ss.fff");

                        var querydata = "SELECT top " + batchSize
                                        + " d.DevId as dev_id, A.[IntValue] as int_value, A.[ServerDateTime] as server_time_stamp, " 
                                        + "A.[StatType] as stat_type, A.[TimeStamp] as time_stamp FROM dbo.DeviceStatInt AS A WITH (NOLOCK) INNER JOIN "
                                        + " dbo.devInfo as D WITH(NOLOCK) ON A.DeviceId = D.DeviceId WHERE A.[timestamp] <= '" + lasttime
                                        + "' order by TimeStamp asc ";

                        //Update Status for tracking the progress
                        UpdateStatusData(lasttime, 1);
                       
                        //getting data
                        using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                        {
                            sqlConnection.Open();

                            using (IDbCommand cmd = sqlConnection.CreateCommand())
                            {
                                cmd.CommandText = querydata;
                                
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                       idaData.Add(new DeviceStatInt
                                       {
                                           dev_id = reader.GetString(0),
                                           int_value = reader.GetInt64(1).ToString(),
                                           server_time_stamp = reader.GetDateTime(2).ToString(CultureInfo.InvariantCulture),
                                           stat_type = reader.GetInt32(3).ToString(),
                                           time_stamp = reader.GetDateTime(4).ToString(CultureInfo.InvariantCulture)
                                       });
                                    }
                                }
                            } 
                        }
                    result = JsonConvert.SerializeObject(idaData);
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
               if(sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return result;
        }

        public bool CheckDeviceStatIntSize()
        {
            SqlConnection sqlConnection = null;
            var count = 0;
            try
            {
                const string queryCount = "select count(1) from dbo.DeviceStatInt WITH (NOLOCK)";

                if (_deviceSyncStausList.ContainsKey(TableName))
                {
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryCount + " where TimeStamp > '" + _deviceSyncStausList[TableName].LastSyncTime + "'", sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        sqlConnection.Open();

                        int.TryParse(cmd.ExecuteScalar().ToString(), out count);
                    }
                }
                else
                {
                    
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryCount, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        sqlConnection.Open();

                        int.TryParse(cmd.ExecuteScalar().ToString(), out count);
                    }
                   
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return count > 10000;
        }

        /// <summary>
        ///     Confirm when data sent success.
        /// </summary>
        /// <param name="pass">pass.</param>
        public void ConfirmStatusData(bool pass)
        {

            if (_deviceSyncStausList[TableName] != null && pass)
            {
                _deviceSyncStausList[TableName].PreviousSyncTime = _deviceSyncStausList[TableName].LastSyncTime;
                _deviceSyncStausList[TableName].Status = 0;
            }
            else if (_deviceSyncStausList[TableName] != null && !pass)
            {
                _deviceSyncStausList[TableName].Status = -1;
            }

            try
            {
                UpdateJson();
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
        }

        /// <summary>
        ///     Update Status
        /// </summary>
        /// <param name="lasttime">lasttime.</param>
        /// <param name="status">status.</param>
        private void UpdateStatusData(object lasttime, int status)
        {
            lock (_factLock)
            {
                if (!_deviceSyncStausList.ContainsKey(TableName))
                {
                    _deviceSyncStausList.Add(TableName, new DeviceSyncStatus(TableName, 1, lasttime.ToString(), ""));
                }
                else
                {
                    //update device Sync Status Table
                    _deviceSyncStausList[TableName] = new DeviceSyncStatus()
                    {
                        Name = TableName,
                        LastSyncTime = lasttime.ToString(),
                        PreviousSyncTime = _deviceSyncStausList[TableName].LastSyncTime,
                        Status = status
                    };
                }
               
                UpdateJson();
            }
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
        }

        /// <summary>
        /// Update Json
        /// </summary>        
        private void UpdateJson()
        {
            try
            {
                var json = new Dictionary<string, DeviceSyncStatus>();
                // serialize JSON to a string and then write string to a file
                if (File.Exists(_dataTrackerPath))
                {
                    json = JsonConvert.DeserializeObject<Dictionary<string, DeviceSyncStatus>>(File.ReadAllText(_dataTrackerPath));

                    if (json.ContainsKey(TableName))
                    {
                        json[TableName] = _deviceSyncStausList[TableName];
                    }
                    else
                    {
                        json.Add(TableName, _deviceSyncStausList[TableName]);
                    }
                }
                else
                {
                    json.Add(TableName, _deviceSyncStausList[TableName]);
                }
                File.WriteAllText(_dataTrackerPath, JsonConvert.SerializeObject(json));
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
        }
    }
}