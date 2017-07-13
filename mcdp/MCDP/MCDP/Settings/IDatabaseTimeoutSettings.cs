using System;

namespace Soti.MCDP.Settings
{
    /// <summary>
    /// Database timeout settings
    /// </summary>
    public interface IDatabaseTimeoutSettings
    {
        /// <summary>
        /// Gets the operation timeout.
        /// </summary>
        TimeSpan OperationTimeout { get; }

        /// <summary>
        /// Gets the long operation timeout.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1720:IdentifiersShouldNotContainTypeNames", MessageId = "long", Justification = "As designed")]
        TimeSpan LongOperationTimeout { get; }

        /// <summary>
        /// Gets the database wait timeout.
        /// </summary>
        TimeSpan WaitDatabaseTimeout { get; }
    }
}