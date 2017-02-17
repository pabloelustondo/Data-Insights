﻿using System;
using System.IO;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;


namespace Soti.MCDP.Database
{
    /// <summary>
    /// DeviceStatInt provider.
    /// </summary>
    public class DeviceStatIntProvider : IDeviceStatIntProvider
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
        ///     Initializes a new instance of the <see cref="DeviceStatIntProvider"/> class.
        /// </summary>
        public DeviceStatIntProvider()
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
        public DataTable GetDeviceStatIntData()
        {
            SqlConnection sqlConnection = null;
            DataTable ds = null;
            try
            {
                sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceStatInt_GetAll", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.CommandTimeout = this._datdatabaseTimeout;

                ds = new DataTable();
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                sqlDataAdapter.Fill(ds);

                //idaData = Map2Ida(ds);
                
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

                sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatInt");

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
                sqlCommand.Parameters.AddWithValue("@Name", "DeviceStatInt");
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
        /// Map to Ida data format
        /// </summary>]
        /// <param name="DataSet">DataSet from DB.</param>
        /// <returns>Ida dataset.</returns>
        private static DeviceStatIntList Map2Ida(DataTable ds)
        {
            DeviceStatIntList idaData = null;
            try
            {
                if (ds != null && ds.Rows != null && ds.Rows.Count > 0)
                {
                    // so we have something
                    idaData = new DeviceStatIntList();
                    idaData.createdAt = DateTime.Now.ToString();
                    idaData.metadata = "data from MCDA.DeviceStatInt_GetAll....";
                    idaData.data = new List<DeviceStatInt>();

                    foreach (DataRow dr in ds.Rows)
                    {
                        var idaDataRow = new DeviceStatInt();

                        //DevId Char(80)
                        idaDataRow.dev_id = dr["DeviceId"].ToString();
                        //server time
                        idaDataRow.server_time_stamp = (DateTime)dr["ServerDateTime"];
                        //datetype -1=battery status
                        idaDataRow.stat_type = (int)dr["StatType"];
                        //data bigint
                        idaDataRow.int_value = dr["IntValue"].ToString();
                        // device time
                        idaDataRow.time_stamp = (DateTime)dr["TimeStamp"];

                        idaData.data.Add(idaDataRow);
                    }
                }
            }
            catch (Exception ex)
            {
                var logMessage = DateTime.Now.ToString() + "  =>  ";
                Log(logMessage + "[ERROR] " + ex.ToString());
            }
            return idaData;
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
