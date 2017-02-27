using System.Data;
using Soti.MCDP.Database.Model;

namespace Soti.MCDP.Database
{
    /// <summary>
    ///     Interface for retrieving and updating device agents.
    /// </summary>
    public interface IDeviceStatApplicationProvider
    {
        /// <summary>
        ///     Checks for agent duplicated name.
        /// </summary>
        /// <returns>dataset for Ida format.</returns>
        string RetrieveDeviceStatApplicationData(int batchSize);

        /// <summary>
        ///     Confirm the requested.
        /// </summary>
        /// <param name="pass">True if data received.</param>
        void ConfirmStatusData(bool pass);
    }
}