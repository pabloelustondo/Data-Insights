using System;

namespace Soti.MCDP.Settings
{
    /// <summary>
    /// Service timeout settings
    /// </summary>
    public interface IServiceTimeoutSettings
    {
        /// <summary>
        /// Gets the send timeout.
        /// </summary>
        TimeSpan SendTimeout { get; }

        /// <summary>
        /// Gets the receive timeout.
        /// </summary>
        TimeSpan ReceiveTimeout { get; }

        /// <summary>
        /// Gets the close timeout.
        /// </summary>
        TimeSpan СloseTimeout { get; }

        /// <summary>
        /// Gets the open timeout.
        /// </summary>
        TimeSpan OpenTimeout { get; }
    }
}