using System;
using System.IO;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

namespace Soti.MCDP.Database
{
        public class DeviceStatApplicationProvider : IDeviceStatApplicationProvider
        {
            /// <summary>
            /// get database connections string from config file
            /// </summary>
            private readonly string _mobicontrolDatabaseConnectionString = null;

            /// <summary>
            /// get database timeout from config file
            /// </summary>
            private readonly int _datdatabaseTimeout;

            /// <summary>
            ///     Initializes a new instance of the <see cref="DeviceStatApplicationList"/> class.
            /// </summary>
            public DeviceStatApplicationProvider()
                {
                try
                {
                    this._mobicontrolDatabaseConnectionString = DatabaseSection.LoadConnectionString(ConfigurationManager.AppSettings["MCPath"]);

                    this._datdatabaseTimeout = Convert.ToInt16(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);
                }
                catch (Exception ex)
                {
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    Log(logMessage + "[ERROR] " + ex.ToString());
                }
            }

            /// <summary>
            /// Get DeviceStatInt Data.
            /// </summary>
            /// <returns>Ida formatted dataset .</returns>
            public DataTable GetDeviceStatApplicationData()
            {
                SqlConnection sqlConnection = null;
                DataTable ds = null;
                try
                {
                    sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
                    sqlConnection.Open();

                    SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceStatApplication_GetAll", sqlConnection);
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = this._datdatabaseTimeout;

                    ds = new DataTable();
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(ds);
                
                }
                catch (Exception ex)
                {
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    Log(logMessage + "[ERROR] " + ex.ToString());
                }
                finally
                {
                    if (sqlConnection != null)
                    { sqlConnection.Close(); }
                }
                return ds;
            }

            /// <summary>
            /// Confirm when data sent success.
            /// </summary>
            /// <param name="pass">pass.</param>
            public void ConfirmData(bool pass)
            {
                SqlConnection sqlConnection = null;
                try
                {
                    DeviceSyncStatus _DeviceSyncStatus = this.GetLastSyncTime();

                    sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
                    sqlConnection.Open();
                    SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Update", sqlConnection);
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatApplication");

                    if (pass)
                    {
                        sqlCommand.Parameters.AddWithValue("@Status", 0);
                        sqlCommand.Parameters.AddWithValue("@PreviousSyncTime", _DeviceSyncStatus.LastSyncTime);
                    }
                    else
                    {
                        sqlCommand.Parameters.AddWithValue("@Status", -1);
                    }

                    sqlCommand.CommandTimeout = this._datdatabaseTimeout;

                    sqlCommand.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    Log(logMessage + "[ERROR] " + ex.ToString());
                }
                finally
                {
                    if (sqlConnection != null)
                    { sqlConnection.Close(); }
                }
            }

            /// <summary>
            /// Get Last Sync Time.
            /// </summary>
            /// <returns>DeviceSyncStatus dataset.</returns>
            public DeviceSyncStatus GetLastSyncTime()
            {

                SqlConnection sqlConnection = null;
                SqlDataReader rdr = null;
                DeviceSyncStatus _DeviceSyncStatus = new DeviceSyncStatus();
                try
                {
                    sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
                    sqlConnection.Open();

                    SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Get", sqlConnection);
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatApplication");
                    sqlCommand.CommandTimeout = this._datdatabaseTimeout;

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
                catch (Exception ex)
                {
                    var logMessage = DateTime.Now.ToString() + "  =>  ";
                    Log(logMessage + "[ERROR] " + ex.ToString());
                }
                finally
                {
                    if (sqlConnection != null)
                    { sqlConnection.Close(); }
                    if (rdr != null)
                    { rdr.Close(); }
                }
                return _DeviceSyncStatus;
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
        }
    }