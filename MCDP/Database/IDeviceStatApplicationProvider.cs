using Soti.MCDP.Database.Model;

namespace Soti.MCDP.Database
{
    /// <summary>
    /// Interface for retrieving and updating device agents.
    /// </summary>
    public interface IDeviceStatApplicationProvider
    {
        /// <summary>
        /// Checks for agent duplicated name.
        /// </summary>
        /// <returns>dataset for Ida format.</returns>
        DeviceStatIntList GetDeviceStatApplicationData();

        /// <summary>
        /// Confirm the requested.
        /// </summary>
        /// <param name="pass">True if data received.</param>
        void ConfirmData(bool pass);

        /// <summary>
        /// Get Last Sync Time
        /// </summary>
        /// <returns>Agent identifier.</returns>
        DeviceSyncStatus GetLastSyncTime();
    }
}
