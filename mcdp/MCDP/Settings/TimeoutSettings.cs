using System;

namespace Soti.MCDP.Settings
{
    /// <summary>
    /// Timeout settings
    /// </summary>
    public sealed class TimeoutSettings : IDatabaseTimeoutSettings, IServiceTimeoutSettings
    {
        /// <summary>
        /// Gets the operation timeout.
        /// </summary>
        TimeSpan IDatabaseTimeoutSettings.OperationTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.OperationTimeout); }
        }

        /// <summary>
        /// Gets the long operation timeout.
        /// </summary>
        TimeSpan IDatabaseTimeoutSettings.LongOperationTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.LongOperationTimeout); }
        }

        /// <summary>
        /// Gets the database wait timeout.
        /// </summary>
        TimeSpan IDatabaseTimeoutSettings.WaitDatabaseTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.WaitDatabaseTimeout); }
        }

        /// <summary>
        /// Gets the send timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.SendTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.SendTimeout); }
        }

        /// <summary>
        /// Gets the receive timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.ReceiveTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.ReceiveTimeout); }
        }

        /// <summary>
        /// Gets the close timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.СloseTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.СloseTimeout); }
        }

        /// <summary>
        /// Gets the open timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.OpenTimeout
        {
            get { return TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.OpenTimeout); }
        }
    }
}
