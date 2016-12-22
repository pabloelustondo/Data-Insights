using System.Configuration;

namespace Soti.MCDP.Settings
{
    /// <summary>
    /// The timeouts configuration section class
    /// </summary>
    internal sealed class TimeoutConfigurationSection : ConfigurationSection
    {
        private static TimeoutConfigurationSection _instance;

        /// <summary>
        /// Gets the section instance.
        /// </summary>
        public static TimeoutConfigurationSection Instance
        {
            get
            {
                return _instance ??
                       (_instance = ConfigurationManager.GetSection("timeouts") as TimeoutConfigurationSection);
            }
        }

        /// <summary>
        /// Gets the database section
        /// </summary>
        [ConfigurationProperty("database", IsRequired = false)]
        public DatabaseElement Database
        {
            get { return (DatabaseElement) this["database"]; }
        }

        /// <summary>
        /// Gets the services section
        /// </summary>
        [ConfigurationProperty("services", IsRequired = false)]
        public ServicesElement Services
        {
            get
            {
                return (ServicesElement)this["services"];
            }
        }

        /// <summary>
        /// The database configuration element
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible",
            Justification = "As designed")]
        internal sealed class DatabaseElement : ConfigurationElement
        {
            /// <summary>
            /// Gets or sets the operation timeout.
            /// </summary>
            [ConfigurationProperty("operationTimeout", IsRequired = false, DefaultValue = 30)]
            public int OperationTimeout
            {
                get { return (int) this["operationTimeout"]; }
                set { this["operationTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the long operation timeout.
            /// </summary>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming",
                "CA1720:IdentifiersShouldNotContainTypeNames", MessageId = "long", Justification = "As designed"),
             ConfigurationProperty("longOperationTimeout", IsRequired = false, DefaultValue = 300)]
            public int LongOperationTimeout
            {
                get { return (int) this["longOperationTimeout"]; }
                set { this["longOperationTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the maintenance operation timeout.
            /// </summary>
            [ConfigurationProperty("maintenanceOperationTimeout", IsRequired = false, DefaultValue = 900)]
            public int MaintenanceOperationTimeout
            {
                get { return (int) this["maintenanceOperationTimeout"]; }
                set { this["maintenanceOperationTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the database wait timeout.
            /// </summary>
            [ConfigurationProperty("waitDatabaseTimeout", IsRequired = false, DefaultValue = 120)]
            public int WaitDatabaseTimeout
            {
                get { return (int) this["waitDatabaseTimeout"]; }
                set { this["waitDatabaseTimeout"] = value; }
            }
        }

        /// <summary>
        /// The services configuration element
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "As designed")]
        internal sealed class ServicesElement : ConfigurationElement
        {
            /// <summary>
            /// Gets or sets the send timeout.
            /// </summary>
            [ConfigurationProperty("sendTimeout", IsRequired = false, DefaultValue = 600)]
            public int SendTimeout
            {
                get { return (int)this["sendTimeout"]; }
                set { this["sendTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the receive timeout.
            /// </summary>
            [ConfigurationProperty("receiveTimeout", IsRequired = false, DefaultValue = 600)]
            public int ReceiveTimeout
            {
                get { return (int)this["receiveTimeout"]; }
                set { this["receiveTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the close timeout.
            /// </summary>
            [ConfigurationProperty("closeTimeout", IsRequired = false, DefaultValue = 60)]
            public int СloseTimeout
            {
                get { return (int)this["closeTimeout"]; }
                set { this["closeTimeout"] = value; }
            }

            /// <summary>
            /// Gets or sets the open timeout.
            /// </summary>
            [ConfigurationProperty("openTimeout", IsRequired = false, DefaultValue = 60)]
            public int OpenTimeout
            {
                get { return (int)this["openTimeout"]; }
                set { this["openTimeout"] = value; }
            }
        }

    }
}
