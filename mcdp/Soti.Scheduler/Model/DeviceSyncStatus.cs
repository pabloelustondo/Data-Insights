namespace Soti.MCDP.Scheduler.Model
{
    /// <summary>
    /// Used in the get DeviceSyncStatus
    /// </summary>
    public class DeviceSyncStatus
    {
        public string Name { get; set; }

        public int Status { get; set; }

        public string LastSyncTime { get; set; }

        public string PreviousSyncTime { get; set; }

        public DeviceSyncStatus() {}

        public DeviceSyncStatus(string name, int status, string lastSyncTime, string previousSyncTime)
        {
            this.Name = name;
            this.Status = status;
            this.LastSyncTime = lastSyncTime;
            this.PreviousSyncTime = previousSyncTime;
        }
    }
}
