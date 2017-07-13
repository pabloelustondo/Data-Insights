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
        TimeSpan IDatabaseTimeoutSettings.OperationTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.OperationTimeout);

        /// <summary>
        /// Gets the long operation timeout.
        /// </summary>
        TimeSpan IDatabaseTimeoutSettings.LongOperationTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.LongOperationTimeout);

        /// <summary>
        /// Gets the database wait timeout.
        /// </summary>
        TimeSpan IDatabaseTimeoutSettings.WaitDatabaseTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Database.WaitDatabaseTimeout);

        /// <summary>
        /// Gets the send timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.SendTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.SendTimeout);

        /// <summary>
        /// Gets the receive timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.ReceiveTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.ReceiveTimeout);

        /// <summary>
        /// Gets the close timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.СloseTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.СloseTimeout);

        /// <summary>
        /// Gets the open timeout.
        /// </summary>
        TimeSpan IServiceTimeoutSettings.OpenTimeout => TimeSpan.FromSeconds(TimeoutConfigurationSection.Instance.Services.OpenTimeout);
    }
}
