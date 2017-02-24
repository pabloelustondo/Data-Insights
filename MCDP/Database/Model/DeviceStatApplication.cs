using System;

namespace Soti.MCDP.Database.Model
{
    public class DeviceStatApplication
    {
        public string DevId { get; set; }

        public string AppId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public DateTime StartTimeRounded { get; set; }

        public DateTime EndTimeRounded { get; set; }
    }
}