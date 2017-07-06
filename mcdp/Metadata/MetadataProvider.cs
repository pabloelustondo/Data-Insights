using Newtonsoft.Json;
using Soti.MCDP.Logger.Model;
using Soti.MCDP.Metadata;
using Soti.MCDP.Metadata.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;

namespace Soti.MCDP.Database
{
    /// <summary>
    ///     DeviceStatApplication provider.
    /// </summary>
    public class MetadataProvider 
    {
        /// <summary>
        /// Thread Safe
        /// </summary>
        private readonly object _factLock = new object();
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
        private readonly MetadataType _metadataType;

        /// <summary>
        /// Alias of MetadateType
        /// </summary>
        private readonly string _tableName;
        private readonly int? _batchSize;
        private readonly string _startTime;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private readonly Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MetadataProvider" /> class.
        /// </summary>
        public MetadataProvider(MetadataType metadataType, Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
        {
            _metadataType = metadataType;

            _tableName = metadataType.TableName;
            _batchSize = metadataType.BatcheSize;
            _startTime = metadataType.TimeColumnName;
            
            _deviceSyncStausList = deviceSyncStausList;

            try
            {
                _mobicontrolDatabaseConnectionString = DatabaseSection.Load();

                _datdatabaseTimeout = Convert.ToInt32(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);

                _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                    ConfigurationManager.AppSettings["DataTracker"]);
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
            }
        }

        /// <summary>
        /// Retrieve DeviceStatApplication Data
        /// </summary>
        public string RetrieveDataByMetadata()
        {
            SqlConnection sqlConnection = null;
            var result = string.Empty;
            
            try
            {
                //for batch processing
                if (_tableName != "" && _startTime != "" && _batchSize != null)
                {
                    //time tracker for lasttime
                    var lasttime = new object();

                    if (_deviceSyncStausList.ContainsKey(_tableName) &&
                        _deviceSyncStausList[_tableName].Status == 1
                    ) //In progress with skipped preventing overlapping
                        return "";

                    else if (_deviceSyncStausList.ContainsKey(_tableName) &&
                                _deviceSyncStausList[_tableName].Status == 0) //previous call is successed
                    {
                        var queryLastTime = string.Format(
                            "Select max(a.ts) from (" +
                            "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                            "WHERE {1} > '{3}' AND {1} <= '{4}' ORDER BY {1} ASC) a "
                            , _batchSize
                            , _startTime
                            , _tableName
                            , _deviceSyncStausList[_tableName].LastSyncTime
                            , DateTime.Now);

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
                    else if (_deviceSyncStausList.ContainsKey(_tableName) &&
                                _deviceSyncStausList[_tableName].Status == -1) //previous call is failed
                    {

                        var queryLastTime = string.Format(
                            "Select max(a.ts) from (" +
                            "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                            "WHERE {1} > '{3}' AND {1} <= '{4}' ORDER BY {1} ASC) a "
                            , _batchSize
                            , _startTime
                            , _tableName
                            , _deviceSyncStausList[_tableName].PreviousSyncTime //read from previous timestamp
                            , DateTime.Now);

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
                    else if (!_deviceSyncStausList.ContainsKey(_tableName)) //initial stage without data in table
                    {
                        var queryLastTime = string.Format(
                            "Select max(a.ts) from (" +
                            "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                            "WHERE {1} <= '{3}' ORDER BY {1} ASC) a "
                            , _batchSize
                            , _startTime
                            , _tableName
                            , DateTime.Now);

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
                        var dt = new DataTable();

                        lasttime = ((DateTime) lasttime).ToString("yyyy-MM-ddTHH:mm:ss.fff");

                        //Update Status for tracking the progress
                        UpdateStatusData(lasttime, 1);

                        var queryLastTime = string.Format(
                            "SELECT top {0} * "
                            + " FROM {2} as A WITH (NOLOCK)"
                            +
                            " WHERE A.{1} <= '{3}' and A.{1} <= '{4}' order by {1} asc " //filter out outofdate date
                            , _batchSize
                            , _startTime
                            , _tableName
                            , lasttime
                            , DateTime.Now);

                        using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                        {
                            sqlConnection.Open();

                            using (var cmd = new SqlCommand(queryLastTime, sqlConnection))
                            {
                                var da = new SqlDataAdapter(cmd);
                                da.Fill(dt);
                            }
                        }

                        result = DataTableToJsonWithJsonNet(dt);

                        //Logger.Logger.Log(LogSeverity.Info, "Try to send " + dt.Rows.Count);
                    }
                }
                if (_tableName == "") return result;
                {
                        var dt = new DataTable();

                        //Update Status for tracking the progress
                        UpdateStatusData("", 1);

                        var queryLastTime = $"SELECT * FROM {_tableName} WITH (NOLOCK)";

                        using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                        {
                            sqlConnection.Open();

                            using (var cmd = new SqlCommand(queryLastTime, sqlConnection))
                            {
                                var da = new SqlDataAdapter(cmd);
                                da.Fill(dt);
                            }
                        }

                        result = DataTableToJsonWithJsonNet(dt);

                        //Logger.Logger.Log(LogSeverity.Info, "Try to send " + dt.Rows.Count);
                }
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return result;
        }

        public int CheckTableSize()
        {
            SqlConnection sqlConnection = null;
            var count = 0;
            
            try
            {
                if (_tableName != "")
                {
                    var queryCount = $"select count(1) from {_tableName}  WITH (NOLOCK)";

                        if (_deviceSyncStausList.ContainsKey(_tableName) && _startTime != "" )
                        {
                            using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                            {
                                if (_deviceSyncStausList[_tableName].LastSyncTime != "")
                                {
                                    queryCount += string.Format(
                                        " where {0} > '{1}' and {0} <= '{2}'"
                                        , _startTime
                                        , _deviceSyncStausList[_tableName].LastSyncTime
                                        , DateTime.Now
                                    );

                                    var cmd =
                                        new SqlCommand(queryCount, sqlConnection)
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
                                            queryCount + $" where {_startTime} <= '" + DateTime.Now + "'", sqlConnection)
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
                }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
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

            if (_deviceSyncStausList[_tableName] != null && pass)
            {
                _deviceSyncStausList[_tableName].PreviousSyncTime = _deviceSyncStausList[_tableName].LastSyncTime;
                _deviceSyncStausList[_tableName].Status = 0;
            }
            else if (_deviceSyncStausList[_tableName] != null && !pass)
            {
                _deviceSyncStausList[_tableName].Status = -1;
            }

            try
            {
                //Update to date Json to file
                UpdateJson();
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
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
                    if (!_deviceSyncStausList.ContainsKey(_tableName))
                    {
                        _deviceSyncStausList.Add(_tableName, new DeviceSyncStatus(_tableName, 1, lasttime.ToString(), ""));
                    }
                    else
                    {
                        //update device Sync Status Table
                        _deviceSyncStausList[_tableName] = new DeviceSyncStatus()
                        {
                            Name = _tableName,
                            LastSyncTime = lasttime.ToString(),
                            PreviousSyncTime = _deviceSyncStausList[_tableName].LastSyncTime,
                            Status = status
                        };
                    }
                    //Update to date Json to file
                    UpdateJson();
                }
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
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

                    if (json.ContainsKey(_tableName))
                    {
                        json[_tableName] = _deviceSyncStausList[_tableName];
                    }
                    else
                    {
                        json.Add(_tableName, _deviceSyncStausList[_tableName]);
                    }
                }
                else
                {
                    json.Add(_tableName, _deviceSyncStausList[_tableName]);
                }
                File.WriteAllText(_dataTrackerPath, JsonConvert.SerializeObject(json));
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
            }
        }

        /// <summary>
        /// Convert DataTable to Json Method 1
        /// </summary>    
        public string DataTableToJsonWithStringBuilder(DataTable table)
        {
            var jsonString = new StringBuilder();
            if (table.Rows.Count <= 0)
                return jsonString.ToString();

            jsonString.Append("[");
            for (var i = 0; i < table.Rows.Count; i++)
            {
                jsonString.Append("{");
                for (var j = 0; j < table.Columns.Count; j++)
                {
                    if (j < table.Columns.Count - 1)
                    {
                        jsonString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                    }
                    else if (j == table.Columns.Count - 1)
                    {
                        jsonString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                    }
                }
                jsonString.Append(i == table.Rows.Count - 1 ? "}" : "},");
            }
            jsonString.Append("]");
            return jsonString.ToString();
        }

        /// <summary>
        /// Convert DataTable to Json Method 2
        /// </summary>  
        private static string DataTableToJsonWithJsonNet(DataTable table)
        {
            return JsonConvert.SerializeObject(table);
        }
    }
}