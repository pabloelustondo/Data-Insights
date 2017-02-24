using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using Soti.MCDP.Database.Model;

namespace Soti.MCDP.Database
{
    public class DeviceStatApplicationProvider : IDeviceStatApplicationProvider
    {
        /// <summary>
        ///     get database timeout from config file
        /// </summary>
        private readonly int _datdatabaseTimeout;

        /// <summary>
        ///     get database connections string from config file
        /// </summary>
        private readonly string _mobicontrolDatabaseConnectionString;

        /// <summary>
        /// Device Sync Staus List
        /// </summary>
        private Dictionary<string, DeviceSyncStatus> _deviceSyncStausList;

        /// <summary>
        ///     Initializes a new instance of the <see cref="DeviceStatApplicationList" /> class.
        /// </summary>
        public DeviceStatApplicationProvider(Dictionary<string, DeviceSyncStatus> deviceSyncStausList)
        {
            _deviceSyncStausList = deviceSyncStausList;

            try
            {
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
        ///     Get DeviceStatInt Data.
        /// </summary>
        /// <returns>Ida formatted dataset .</returns>
        public DataTable GetDeviceStatApplicationData()
        {
            SqlConnection sqlConnection = null;
            DataTable ds = null;
            try
            {
                sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString);
                sqlConnection.Open();

                var sqlCommand = new SqlCommand("MCDA.DeviceStatApplication_GetAll", sqlConnection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = _datdatabaseTimeout
                };

                ds = new DataTable();
                var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                sqlDataAdapter.Fill(ds);
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
                sqlConnection?.Close();
            }
            return ds;
        }

        /// <summary>
        ///     Confirm when data sent success.
        /// </summary>
        /// <param name="pass">pass.</param>
        public void ConfirmData(bool pass)
        {
            SqlConnection sqlConnection = null;
            try
            {
                var deviceSyncStatus = GetLastSyncTime();

                sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString);
                sqlConnection.Open();
                var sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Update", sqlConnection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatApplication");

                if (pass)
                {
                    sqlCommand.Parameters.AddWithValue("@Status", 0);
                    sqlCommand.Parameters.AddWithValue("@PreviousSyncTime", deviceSyncStatus.LastSyncTime);
                }
                else
                {
                    sqlCommand.Parameters.AddWithValue("@Status", -1);
                }

                sqlCommand.CommandTimeout = _datdatabaseTimeout;

                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
                sqlConnection?.Close();
            }
        }

        /// <summary>
        ///     Get Last Sync Time.
        /// </summary>
        /// <returns>DeviceSyncStatus dataset.</returns>
        public DeviceSyncStatus GetLastSyncTime()
        {
            SqlConnection sqlConnection = null;
            SqlDataReader rdr = null;
            var deviceSyncStatus = new DeviceSyncStatus();
            try
            {
                sqlConnection = new SqlConnection(_mobicontrolDatabaseConnectionString);
                sqlConnection.Open();

                var sqlCommand = new SqlCommand("MCDA.DeviceSyncStatus_Get", sqlConnection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatApplication");
                sqlCommand.CommandTimeout = _datdatabaseTimeout;

                rdr = sqlCommand.ExecuteReader();

                while (rdr.Read())
                {
                    deviceSyncStatus.Name = rdr["Name"].ToString();
                    deviceSyncStatus.Status = rdr["Status"].ToString();
                    deviceSyncStatus.LastSyncTime = rdr["LastSyncTime"].ToString();
                    deviceSyncStatus.PreviousSyncTime = rdr["PreviousSyncTime"].ToString();
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString(CultureInfo.InvariantCulture) + "  =>  ";
                Log(logMessage + "[ERROR] " + ex);
            }
            finally
            {
                sqlConnection?.Close();
                rdr?.Close();
            }
            return deviceSyncStatus;
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