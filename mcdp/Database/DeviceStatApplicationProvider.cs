using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Soti.MCDP.Database.Model;

namespace Soti.MCDP.Database
{
    /// <summary>
    ///     DeviceStatApplication provider.
    /// </summary>
    public class DeviceStatApplicationProvider : IDeviceStatApplicationProvider
    {
        /// <summary>
        /// TableName
        /// </summary>
        private const string TableName = "DeviceStatApplication";

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
        ///     Initializes a new instance of the <see cref="DeviceStatApplicationProvider" /> class.
        /// </summary>
        public DeviceStatApplicationProvider(Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
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
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
        }

        /// <summary>
        /// Retrieve DeviceStatApplication Data
        /// </summary>
        /// <param name="batchSize">pass.</param>
        public string RetrieveDeviceStatApplicationData(int batchSize)
        {
            var idaData = new List<DeviceStatApplication>();
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
                    var queryLastTime = "Select max(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) where StartTime > '"
                                        + _deviceSyncStausList[TableName].LastSyncTime + "' and StartTime <= '" + DateTime.Now +
                                       "' order by [StartTime] asc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = cmd.ExecuteScalar();
                    }
                }
                else if (_deviceSyncStausList.ContainsKey(TableName) && _deviceSyncStausList[TableName].Status == -1)   //previous call is failed
                {
                    var queryLastTime = "Select max(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) where StartTime > '"
                                        + _deviceSyncStausList[TableName].PreviousSyncTime + "' and StartTime <= '" + DateTime.Now +
                                        "' order by [StartTime] asc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = cmd.ExecuteScalar();
                    }
                }
                else if (!_deviceSyncStausList.ContainsKey(TableName)) //initial stage without data in table
                {
                    var queryLastTime = "Select max(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) "
                                        + " where StartTime <= '" + DateTime.Now 
                                        + "' order by [StartTime] asc ) a ";


                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = cmd.ExecuteScalar();
                    }
                }

                //This is a final data collection taken result from previous conditions
                if (lasttime.ToString() != "")
                {
                    lasttime = ((DateTime)lasttime).ToString("yyyy-MM-ddTHH:mm:ss.fff");

                    //Update Status for tracking the progress
                    UpdateStatusData(lasttime, 1);

                    var queryLastTime = "SELECT top " + batchSize + " A.DevId, A.AppId, A.StartTime, A.EndTime, "
                                                  + " DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded "
                                                  + " FROM dbo.DeviceStatApplication AS A WITH (NOLOCK) INNER JOIN dbo.devInfo as D WITH(NOLOCK) ON A.DevId = D.DevId "
                                                  + " WHERE A.[StartTime] <= '" + lasttime + "' and A.[StartTime] <= '" + DateTime.Now 
                                                  + "' order by StartTime asc ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        using (var cmd = new SqlCommand(queryLastTime, sqlConnection))
                        {
                            var reader = cmd.ExecuteReader();

                            while (reader.Read())
                            {
                                idaData.Add(new DeviceStatApplication
                                {
                                    DevId = reader.GetString(0),
                                    AppId = reader.GetString(1),
                                    StartTime = reader.GetDateTime(2).ToString(CultureInfo.InvariantCulture),
                                    EndTime = reader.GetDateTime(3).ToString(CultureInfo.InvariantCulture),
                                    StartTimeRounded = reader.GetDateTime(4).ToString(CultureInfo.InvariantCulture),
                                    EndTimeRounded = reader.GetDateTime(5).ToString(CultureInfo.InvariantCulture)
                                });
                            }
                        } 
                    }
                    
                    result = JsonConvert.SerializeObject(idaData);

                    Logger.Log(LogSeverity.Info, "Try to send " + idaData.Count + " of DeviceStatApplication");
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return result;
        }

        public int CheckDeviceStatApplicationSize()
        {
            SqlConnection sqlConnection = null;
            var count = 0;
            try
            {
                const string queryCount = "select count(1) from dbo.DeviceStatApplication WITH (NOLOCK)";

                if (_deviceSyncStausList.ContainsKey(TableName))
                {
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        if (_deviceSyncStausList[TableName].LastSyncTime != "")
                        {
                            var cmd =
                                new SqlCommand(
                                    queryCount + " where StartTime > '" + _deviceSyncStausList[TableName].LastSyncTime +
                                    "' and  StartTime <= '" + DateTime.Now + "'", sqlConnection)
                                {
                                    CommandType = CommandType.Text,
                                    CommandTimeout = _datdatabaseTimeout
                                };
                            sqlConnection.Open();

                            int.TryParse(cmd.ExecuteScalar().ToString(), out count);
                        }
                        else
                        {
                            var cmd =
                                new SqlCommand(
                                    queryCount + " where StartTime <= '" + DateTime.Now + "'", sqlConnection)
                                {
                                    CommandType = CommandType.Text,
                                    CommandTimeout = _datdatabaseTimeout
                                };

                            sqlConnection.Open();

                            int.TryParse(cmd.ExecuteScalar().ToString(), out count);
                        }
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
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return count;
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
                //Update to date Json to file
                UpdateJson();
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
        }

        /// <summary>
        ///     Update Status
        /// </summary>
        /// <param name="lasttime">lasttime.</param>
        /// <param name="status">status.</param>
        private void UpdateStatusData(object lasttime, int status)
        {
            try
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
                    //Update to date Json to file
                    UpdateJson();
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
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
                Logger.Log(LogSeverity.Error, ex.ToString());
            }
        }
    }
}