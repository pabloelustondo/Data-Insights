using System;

namespace Soti.MCDP.Database.Model
{
    /// <summary>
    /// Used in the previous type, this class represents a specific row of the  records that are going to be sent to the input data adapter
    /// </summary>
    public class DataRow4Ida
    {
        public string dev_id;

        public string int_value;

        public DateTime server_time_stamp;

        public int stat_type;

        public DateTime time_stamp;
    }
}
