namespace Soti.MCDP.Metadata.Model
{
    /// <summary>
    /// Used in the get DeviceSyncStatus
    /// </summary>
    public class DeviceSyncStatus
    {
        public string Name { get; set; }

        public Status Status { get; set; }

        public string LastSyncTime { get; set; }

        public string PreviousSyncTime { get; set; }

        public DeviceSyncStatus() {}

        public DeviceSyncStatus(string name, Status status, string lastSyncTime, string previousSyncTime)
        {
            this.Name = name;
            this.Status = status;
            this.LastSyncTime = lastSyncTime;
            this.PreviousSyncTime = previousSyncTime;
        }
    }
    
    public enum Status
    {
        /// <summary>
        /// Message indicates a fail to send data
        /// </summary>
        Failed = -1,
        /// <summary>
        /// Message indicates in progress on current table
        /// </summary>
        Inprogress = 1,

        /// <summary>
        /// Message indicates a data send success
        /// </summary>
        Pass = 2

 
    }
}
