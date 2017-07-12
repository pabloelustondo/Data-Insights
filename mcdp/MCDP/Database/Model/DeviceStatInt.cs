using System;

namespace Soti.MCDP.Database.Model
{
    /// <summary>
    ///     Used in the previous type, this class represents a specific row of the  records that are going to be sent to the
    ///     input data adapter
    /// </summary>
    public class DeviceStatInt
    {
        public string dev_id { get; set; }

        public string int_value { get; set; }

        public string  server_time_stamp { get; set; }

        public string stat_type { get; set; }

        public string time_stamp { get; set; }
    }
}