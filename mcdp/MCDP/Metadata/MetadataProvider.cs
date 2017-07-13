using Newtonsoft.Json;
using Soti.MCDP.Logger.Model;
using Soti.MCDP.Metadata.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace Soti.MCDP.Metadata
{
    /// <summary>
    ///     DeviceStatApplication provider.
    /// </summary>
    public class MetadataProvider : IMetadata
    {
        string IMetadata.TableName => _tableName;
        string IMetadata.BatchSize => _batch;
        string IMetadata.TimeColumnName => _timeColumnName;

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
        /// get database max Row Count
        /// </summary>
        private readonly int _maxRowCount;

        /// <summary>
        /// get database connections string from config file
        /// </summary>
        private readonly string _mobicontrolDatabaseConnectionString;

        /// <summary>
        /// Alias of MetadateType
        /// </summary>
        private readonly string _tableName;
        private readonly string _batch;
        private readonly string _timeColumnName;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private readonly Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MetadataProvider" /> class.
        /// </summary>
        public MetadataProvider(MetadataType metadataType, Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
        {
            _tableName = metadataType.TableName;
            _batch = metadataType.BatcheSize;
            _timeColumnName = metadataType.TimeColumnName;
            
            _deviceSyncStausList = deviceSyncStausList;

            try
            {
                _mobicontrolDatabaseConnectionString = DatabaseSection.Load();

                _datdatabaseTimeout = Convert.ToInt32(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);

                _maxRowCount = Convert.ToInt32(ConfigurationManager.AppSettings["MaxRowCount"]);

                _dataTrackerPath = Path.Combine(Directory.GetCurrentDirectory(),
                    ConfigurationManager.AppSettings["DataTracker"]);
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "MetadataProvider-Initialization Error: " + ex);
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
                if (_tableName == "")
                {
                    Logger.Logger.Log(Classifier.ReadError, Priority.Warning, "MetadataProvider-Table Name is invalid!");
                    return result;
                }

                if (int.TryParse(_batch, out int batchSize))
                {
                    Logger.Logger.Log(Classifier.ReadError, Priority.Warning, "MetadataProvider-Patch size is not a number!");
                    return result;
                }
                //Limited to 1 million as maximum of dataset, should add UI restriction.
                if (batchSize > _maxRowCount || batchSize <= 0)
                {
                    Logger.Logger.Log(Classifier.TestLog, Priority.Info, "MetadataProvider-Batch size on Metadata should set between 0 to 1000000!");
                    return result;
                }

                if (_timeColumnName != "")
                {
                    //time tracker for lasttime
                    var lasttime = new object();

                    lock (_factLock)
                    {
                        if (!_deviceSyncStausList.ContainsKey(_tableName)) //initial stage without data in table
                        {
                            var queryLastTime = string.Format(
                                "Select max(a.ts) from (" +
                                "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                                "WHERE {1} <= '{3}' ORDER BY {1} ASC) a "
                                , batchSize
                                , _timeColumnName
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
                        //In progress with skipped preventing overlapping
                        else if (_deviceSyncStausList.ContainsKey(_tableName) &&
                                _deviceSyncStausList[_tableName].Status == Status.Inprogress
                        )
                        {
                            Logger.Logger.Log(Classifier.TestLog, Priority.Info, "MetadataProvider-Table is read from other thread. Skiped!");
                            return "";
                        }
                        //Previous Pass
                        else if (_deviceSyncStausList.ContainsKey(_tableName) &&
                                 _deviceSyncStausList[_tableName].Status == Status.Pass) //previous call is successed
                        {
                            var queryLastTime = string.Format(
                                "Select max(a.ts) from (" +
                                "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                                "WHERE {1} > '{3}' AND {1} <= '{4}' ORDER BY {1} ASC) a "
                                , batchSize
                                , _timeColumnName
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
                        //Previous Failed
                        else if (_deviceSyncStausList.ContainsKey(_tableName) &&
                                 _deviceSyncStausList[_tableName].Status == Status.Failed) //previous call is failed
                        {

                            var queryLastTime = string.Format(
                                "Select max(a.ts) from (" +
                                "select top {0} {1} as ts from {2} WITH (NOLOCK) " +
                                "WHERE {1} > '{3}' AND {1} <= '{4}' ORDER BY {1} ASC) a "
                                , batchSize
                                , _timeColumnName
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
                        }

                    //This is a final data collection taken result from previous conditions
                    lock (_factLock)
                    {
                        if (lasttime.ToString() == "")
                        {
                            Logger.Logger.Log(Classifier.TestLog, Priority.Info, "MetadataProvider-Get lasttime failed. Skiped!");
                            return "";
                        }
                        else if (_deviceSyncStausList[_tableName].Status != Status.Inprogress)
                        {
                            Logger.Logger.Log(Classifier.TestLog, Priority.Info, "MetadataProvider-Table is read from other thread. Skiped!");
                            return "";
                        }
                        else
                        {
                            var dt = new DataTable();

                            lasttime = ((DateTime) lasttime).ToString("yyyy-MM-ddTHH:mm:ss.fff");

                            //Update Status for tracking the progress
                            UpdateStatusData(lasttime, Status.Inprogress);

                            var queryLastTime = string.Format(
                                "SELECT top {0} * "
                                + " FROM {2} as A WITH (NOLOCK)"
                                +
                                " WHERE A.{1} <= '{3}' and A.{1} <= '{4}' order by {1} asc " //filter out outofdate date
                                , batchSize
                                , _timeColumnName
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

                            Logger.Logger.Log(Classifier.TestLog, Priority.Info, "MetadataProvider-Read data from " + _tableName + " with count " + dt.Rows.Count);
                        }
                    }
                }
                else
                {
                    lock (_factLock)
                    {
                        if (_deviceSyncStausList[_tableName].Status != Status.Inprogress)
                        {
                            var dt = new DataTable();

                            //Update Status for tracking the progress
                            UpdateStatusData("", Status.Inprogress);
                            //Check total count to prevent overflow 
                            var counter = CheckTableSize();

                            if (counter > 0 && counter < _maxRowCount)
                            {
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
                                Logger.Logger.Log(Classifier.TestLog, Priority.Info,
                                    "Read data from " + _tableName + " with count " + dt.Rows.Count);
                            }
                            else
                            {
                                Logger.Logger.Log(Classifier.ReadError, Priority.Warning, "MetadataProvider-total count on table " + _tableName + " are over limits: " + counter);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "MetadataProvider-Read data Error!" + ex);
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return result;
        }

        private int CheckTableSize()
        {
            SqlConnection sqlConnection = null;
            var count = 0;
            
            try
            {
                if (_tableName != "")
                {
                    var queryCount = $"select count(1) from {_tableName}  WITH (NOLOCK)";

                    lock (_factLock)
                    {
                        if (_deviceSyncStausList.ContainsKey(_tableName) && _timeColumnName != "" )
                        {
                            using (sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString))
                            {
                                if (_deviceSyncStausList[_tableName].LastSyncTime != "")
                                {
                                    queryCount += string.Format(
                                        " where {0} > '{1}' and {0} <= '{2}'"
                                        , _timeColumnName
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
                                            queryCount + $" where {_timeColumnName} <= '" + DateTime.Now + "'", sqlConnection)
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
                }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "Check Table Size Error!" + ex);
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
            try
            {
                lock (_factLock)
                {
                    if (_deviceSyncStausList[_tableName] != null && pass)
                    {
                        _deviceSyncStausList[_tableName].PreviousSyncTime =
                            _deviceSyncStausList[_tableName].LastSyncTime;
                        _deviceSyncStausList[_tableName].Status = Status.Pass;
                    }
                    else if (_deviceSyncStausList[_tableName] != null && !pass)
                    {
                        _deviceSyncStausList[_tableName].Status = Status.Failed;
                    }
                    //Update to date Json to file
                    SaveTrackingChange();
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "Metadata Confirm Status Error!" + ex);
            }
        }

        /// <summary>
        ///     Update Status
        /// </summary>
        /// <param name="lasttime">lasttime.</param>
        /// <param name="status">status.</param>
        private void UpdateStatusData(object lasttime, Status status)
        {
            try
            {
                lock (_factLock)
                {
                    if (!_deviceSyncStausList.ContainsKey(_tableName))
                    {
                        _deviceSyncStausList.Add(_tableName, new DeviceSyncStatus(_tableName, Status.Inprogress, lasttime.ToString(), ""));
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
                    SaveTrackingChange();
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "MetadataProvider-Update Status Error"  + ex);
            }
        }

        /// <summary>
        /// Update Json
        /// </summary>        
        private void SaveTrackingChange()
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
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "MetadataProvider-Update Json Error " + ex);
            }
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