using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
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
        private Dictionary<string, DeviceSyncStatus> DeviceSyncStausList { get; set; }
        /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatApplicationProvider" /> class.
        /// </summary>
        public DeviceStatApplicationProvider(Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
        {
            DeviceSyncStausList = deviceSyncStausList;

            try
            {
                _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                    ConfigurationManager.AppSettings["DataTracker"]);

                _mobicontrolDatabaseConnectionString =
                    DatabaseSection.LoadConnectionString(ConfigurationManager.AppSettings["MCPath"]);

                _datdatabaseTimeout = Convert.ToInt16(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
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
                var lasttime = "";
               
                if (DeviceSyncStausList.ContainsKey(TableName) && DeviceSyncStausList[TableName].Status == 1)        //In progress with skipped preventing overlapping
                    return "";
                else if (DeviceSyncStausList.ContainsKey(TableName) && DeviceSyncStausList[TableName].Status == 0)   //previous call is successed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) where StartTime > "
                                        + DeviceSyncStausList[TableName].LastSyncTime +
                                        " order by [StartTime] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = ((DateTime)cmd.ExecuteScalar()).ToString("yyyy-MM-ddTHH:mm:ss.fff");
                    }
                }
                else if (DeviceSyncStausList.ContainsKey(TableName) && DeviceSyncStausList[TableName].Status == -1)   //previous call is failed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) where StartTime > "
                                        + DeviceSyncStausList[TableName].PreviousSyncTime +
                                        " order by [StartTime] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = ((DateTime)cmd.ExecuteScalar()).ToString("yyyy-MM-ddTHH:mm:ss.fff");
                    }
                }
                else if (!DeviceSyncStausList.ContainsKey(TableName)) //initial stage without data in table
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [StartTime] as ts from dbo.DeviceStatApplication WITH (NOLOCK) order by [StartTime] desc ) a ";


                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        sqlConnection.Open();

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        {
                            CommandType = CommandType.Text,
                            CommandTimeout = _datdatabaseTimeout
                        };

                        lasttime = ((DateTime)cmd.ExecuteScalar()).ToString("yyyy-MM-ddTHH:mm:ss.fff");
                    }
                }

                //This is a final data collection taken result from previous conditions
                if (lasttime != "")
                {

                    //Update Status for tracking the progress
                    UpdateStatusData(lasttime, 1);

                    var queryLastTime = "SELECT top " + batchSize + " A.DevId, A.AppId, A.StartTime, A.EndTime, "
                                                  + " DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded "
                                                  + " FROM dbo.DeviceStatApplication AS A WITH (NOLOCK) INNER JOIN dbo.devInfo as D WITH(NOLOCK) ON A.DevId = D.DevId "
                                                  + " WHERE A.[StartTime] <= '" + lasttime + "' order by StartTime asc ";

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
                                    EndTime = reader.GetDateTime(2).ToString(CultureInfo.InvariantCulture),
                                    StartTimeRounded = reader.GetDateTime(2).ToString(CultureInfo.InvariantCulture),
                                    EndTimeRounded = reader.GetDateTime(2).ToString(CultureInfo.InvariantCulture)
                                });
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
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return result;
        }

        public bool CheckDeviceStatApplicationSize()
        {
            SqlConnection sqlConnection = null;
            var count = 0;
            try
            {
                const string queryCount = "select count(1) from dbo.DeviceStatApplication WITH (NOLOCK)";

                if (DeviceSyncStausList.ContainsKey(TableName))
                {
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryCount + " where StartTime > " + DeviceSyncStausList[TableName].LastSyncTime, sqlConnection)
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

            if (DeviceSyncStausList[TableName] != null && pass)
            {
                DeviceSyncStausList[TableName].PreviousSyncTime = DeviceSyncStausList[TableName].LastSyncTime;
                DeviceSyncStausList[TableName].Status = 0;
            }
            else if (DeviceSyncStausList[TableName] != null && !pass)
            {
                DeviceSyncStausList[TableName].Status = -1;
            }

            try
            {
                File.WriteAllText(_dataTrackerPath, JsonConvert.SerializeObject(DeviceSyncStausList));
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
        private void UpdateStatusData(string lasttime, int status)
        {
            try
            {
                lock (_factLock)
                {
                    if (!DeviceSyncStausList.ContainsKey(TableName))
                    {
                        DeviceSyncStausList.Add(TableName, new DeviceSyncStatus(TableName, 1, lasttime, ""));
                    }
                    else
                    {
                        //update device Sync Status Table
                        DeviceSyncStausList[TableName] = new DeviceSyncStatus()
                        {
                            Name = TableName,
                            LastSyncTime = lasttime,
                            PreviousSyncTime = DeviceSyncStausList[TableName].LastSyncTime,
                            Status = status
                        };
                    }
                    // serialize JSON to a string and then write string to a file
                    File.WriteAllText(_dataTrackerPath, JsonConvert.SerializeObject(DeviceSyncStausList));
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
               
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
    }
}