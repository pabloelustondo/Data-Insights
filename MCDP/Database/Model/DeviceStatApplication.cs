using System;

namespace Soti.MCDP.Database.Model
{
    public class DeviceStatApplication
    {
        public string DevId { get; set; }

        public string AppId { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string StartTimeRounded { get; set; }

        public string EndTimeRounded { get; set; }
    }
}