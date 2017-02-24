using System;
using System.Collections;
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
        private Dictionary<string, DeviceSyncStatus> DeviceSyncStausList { get; set; }
        /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatIntProvider" /> class.
        /// </summary>
        public DeviceStatIntProvider(Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
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
                var lasttime = "";
                if (DeviceSyncStausList.ContainsKey(TableName) && DeviceSyncStausList[TableName].Status == 0)   //previous call is successed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) where TimeStamp > "
                                        + DeviceSyncStausList[TableName].LastSyncTime +
                                        " order by [timestamp] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                            {CommandType = CommandType.Text};

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar().ToString();
                    }
                }
                else if (DeviceSyncStausList.ContainsKey(TableName) && DeviceSyncStausList[TableName].Status == -1)   //previous call is failed
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) where TimeStamp > "
                                        + DeviceSyncStausList[TableName].PreviousSyncTime +
                                        " order by [timestamp] desc ) a ";

                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {

                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                        { CommandType = CommandType.Text };

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar().ToString();
                    }
                }
                else //more need to be done
                {
                    var queryLastTime = "Select min(a.ts) from (select top " + batchSize +
                                        " [timestamp] as ts from dbo.DeviceStatInt WITH (NOLOCK) order by [timestamp] desc ) a ";


                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryLastTime, sqlConnection)
                            {CommandType = CommandType.Text};

                        sqlConnection.Open();

                        lasttime = cmd.ExecuteScalar().ToString();
                    }
                }
                if (lasttime != "")
                    {
                        var querydata = "SELECT top " + batchSize
                                        + " d.DevId as dev_id, A.[IntValue] as int_value, A.[ServerDateTime] as server_time_stamp, " 
                                        + "A.[StatType] as stat_type, A.[TimeStamp] as time_stamp FROM dbo.DeviceStatInt AS A WITH (NOLOCK) INNER JOIN "
                                        + " dbo.devInfo as D WITH(NOLOCK) ON A.DeviceId = D.DeviceId WHERE A.[timestamp] <= " + lasttime
                                        + " order by order by TimeStamp asc ";
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
                                    Status = 1
                                };
                            }
                        // serialize JSON to a string and then write string to a file
                        File.WriteAllText(_dataTrackerPath, JsonConvert.SerializeObject(DeviceSyncStausList));                        
                        }
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
                                           int_value = reader.GetString(1),
                                           server_time_stamp = reader.GetString(2),
                                           stat_type = reader.GetString(3),
                                           time_stamp = reader.GetString(4)
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

                if (DeviceSyncStausList.ContainsKey(TableName))
                {
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryCount + " where TimeStamp > " + DeviceSyncStausList[TableName].LastSyncTime , sqlConnection)
                        { CommandType = CommandType.Text };

                        sqlConnection.Open();

                        int.TryParse(cmd.ExecuteScalar().ToString(), out count);
                    }
                }
                else
                {
                    
                    using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                    {
                        var cmd = new SqlCommand(queryCount, sqlConnection) { CommandType = CommandType.Text };

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
        public void ConfirmData(bool pass)
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