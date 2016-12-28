namespace Soti.MCDP.Database.Model
{
    /// <summary>
    /// Used in the get DeviceSyncStatus
    /// </summary>
    public class DeviceSyncStatus
    {
        public string Name;

        public string Status;

        public string LastSyncTime;

        public string PreviousSyncTime;

        public string ServerTime;
    }
}
