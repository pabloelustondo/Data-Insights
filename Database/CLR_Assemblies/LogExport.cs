using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Data.SqlClient;
using Microsoft.SqlServer.Server;
using System.IO;

public partial class StoredProcedures
{
    private const int BufferSize = 50000;

    private static SqlConnection newConnection()
    {
        const string _connectionString = "context connection=true";
        return new SqlConnection(_connectionString);
    }

    [SqlProcedure()]

    /// <Summary>
    /// Procedure Download dumps data from SQL table ILog
    /// to the external file
    /// return codes:
    /// 0    - it is OK, file has been created
    /// -1   - the required directory has not been found, hence, file has not been created.
    /// </Summary>
    static public int LogExport(SqlString Path)
    {

        string _path = (string)Path;
        if (_path.Substring(_path.Length - 1, 1) != "\\")
        {
            _path = _path + "\\";
        }

        if (!Directory.Exists(_path))
        {
            return -1;
        }

        int fileIndex = 1;
        while (File.Exists(_path + "Archive_" + String.Format("{0:yyyymmdd}", DateTime.Today) + "_" + fileIndex + ".csv"))
        {
            fileIndex++;
        }
        string _filename = _path + "Archive_" + String.Format("{0:yyyymmdd}", DateTime.Today) + "_" + fileIndex + ".csv";

        List<string> records = new List<string>();

        using (SqlConnection connection = newConnection())
        {
            connection.Open();
            using (SqlCommand command = new SqlCommand("select * from MainLog", connection))
            {
                using (SqlDataReader dataReader = command.ExecuteReader())
                {
                    Object[] dataRow = new Object[dataReader.FieldCount];
                    int i = 0;
                    while (dataReader.Read())
                    {
                        dataReader.GetValues(dataRow);
                        records.Add(string.Join(";", dataRow));

                        if (++i == BufferSize)
                        {
                            i = 0;
                            File.AppendAllLines(_filename, records.ToArray(), System.Text.Encoding.UTF8);
                            records = new List<string>();
                        }
                    }
                    File.AppendAllLines(_filename, records.ToArray());
                }
            }
            connection.Close();
        }
        return 0;
    }
}
