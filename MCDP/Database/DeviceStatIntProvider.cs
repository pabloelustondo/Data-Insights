using System;
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
            this._mobicontrolDatabaseConnectionString = ConfigurationManager.ConnectionStrings["MobiControlDB"].ConnectionString;
            this._datdatabaseTimeout = Convert.ToInt16(ConfigurationManager.AppSettings["waitDatabaseTimeout"]);
        }

        /// <summary>
        /// Get DeviceStatInt Data.
        /// </summary>
        /// <returns>Ida formatted dataset .</returns>
        public Data4Ida GetDeviceStatIntData()
        {
            SqlConnection sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
            sqlConnection.Open();

            SqlCommand sqlCommand = new SqlCommand("MCDA.DeviceStatInt_GetAll", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = this._datdatabaseTimeout;

            DataTable ds = new DataTable();
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            sqlDataAdapter.Fill(ds);

            var idaData = Map2Ida(ds);

            sqlConnection.Close();
            return idaData;
        }

        /// <summary>
        /// Confirm when data sent success.
        /// </summary>
        /// <param name="pass">pass.</param>
        public void ConfirmData(bool pass)
        {
            DeviceSyncStatus _DeviceSyncStatus = this.GetLastSyncTime();

            SqlConnection sqlConnection = new SqlConnection(this._mobicontrolDatabaseConnectionString);
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
            sqlConnection.Close();
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
        private static Data4Ida Map2Ida(DataTable ds)
        {
            Data4Ida idaData = null;

            if (ds != null && ds.Rows != null && ds.Rows.Count > 0)
            {
                // so we have something
                idaData = new Data4Ida();
                idaData.createdAt = DateTime.Now.ToString();
                idaData.metadata = "data from MCDA.DeviceStatInt_GetAll....";
                idaData.data = new List<DataRow4Ida>();

                foreach (DataRow dr in ds.Rows)
                {
                    var idaDataRow = new DataRow4Ida();
            
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
            return idaData;
        }
    }
}
