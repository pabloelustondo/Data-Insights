using System;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;

namespace Soti.MCDP.Database
{
    /// <summary>
    /// Represents the local machine's database connection information.
    /// </summary>
    public class DatabaseSection : ICloneable
    {
        /// <summary>
        /// Initializes a new instance of the DatabaseSection class.
        /// </summary>
        public DatabaseSection()
        {
            UseWindowsAuthentication = true;
        }

        /// <summary>
        /// Gets or sets the name of the database.
        /// </summary>
        public string DatabaseName { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the name of the database server.
        /// </summary>
        public string ServerName { get; set; }

        /// <summary>
        /// Gets or sets the user name.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the connection will
        /// use Windows Authentication.
        /// </summary>
        public bool UseWindowsAuthentication { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the section is encrypted.
        /// </summary>
        public bool IsProtected { get; set; }

        /// <summary>
        /// Loads the database configuration for the local system.
        /// </summary>
        /// <returns>The database configuration.</returns>
        public static DatabaseSection Load()
        {
            return Load(Directory.GetCurrentDirectory());
        }

        /// <summary>
        /// Loads the database configuration from the given location.
        /// </summary>
        /// <param name="path">The path to the MobiControl installation files.</param>
        /// <returns>The database configuration.</returns>
        public static DatabaseSection Load(string path)
        {
            var logMessage = DateTime.Now.ToString() + "  =>  ";

            if (path == null)
                Log(logMessage + "[ERROR] Error Load ConnectionString path is null ");


            var config = GetConfiguration(path);

            var settings = config.ConnectionStrings.ConnectionStrings["DbConnectionString"];
            if (settings == null)
            {
                Log(logMessage + "[ERROR] Database section does not have an associated file!");
            }

            var builder = new SqlConnectionStringBuilder(settings.ConnectionString);

            return new DatabaseSection
            {
                DatabaseName = builder.InitialCatalog,
                ServerName = builder.DataSource,
                UserName = builder.UserID,
                Password = builder.Password,
                UseWindowsAuthentication = builder.IntegratedSecurity,
                IsProtected = config.ConnectionStrings != null && config.ConnectionStrings.SectionInformation.IsProtected
            };
        }

        public static string LoadConnectionString(string path)
        {
            var logMessage = DateTime.Now.ToString() + "  =>  ";
            
            if (path == null)
                Log(logMessage + "[ERROR] Error Load ConnectionString path is null ");
            try
            {
                var config = GetConfiguration(path);

                var settings = config.ConnectionStrings.ConnectionStrings["DbConnectionString"];

                if (settings == null)
                {
                    Log(logMessage + "[ERROR] Database section does not have an associated file!");
                    return "";
                }
                else
                {
                    return settings.ConnectionString;
                }
            }
            catch(Exception ex)
            {
                Log(logMessage + ex.ToString());
                return "";
            }         
        }

        /// <summary>
        /// Creates a clone of this object.
        /// </summary>
        /// <returns>The cloned object.</returns>
        public object Clone()
        {
            return new DatabaseSection
            {
                DatabaseName = this.DatabaseName,
                Password = this.Password,
                ServerName = this.ServerName,
                UserName = this.UserName,
                UseWindowsAuthentication = this.UseWindowsAuthentication,
                IsProtected = this.IsProtected
            };
        }

        /// <summary>
        /// Determines if this object equals the given object.
        /// </summary>
        /// <param name="obj">The object to compare.</param>
        /// <returns>True if the objects are equal and false if not.</returns>
        public override bool Equals(object obj)
        {
            var comparand = obj as DatabaseSection;
            if (comparand == null)
                return false;

            return DatabaseName.Equals(comparand.DatabaseName) &&
                Equals(Password, comparand.Password) &&
                ServerName.Equals(comparand.ServerName) &&
                Equals(UserName, comparand.UserName) &&
                UseWindowsAuthentication == comparand.UseWindowsAuthentication &&
                IsProtected == comparand.IsProtected;
        }

        /// <summary>
        /// Gets a hash code for this object.
        /// </summary>
        /// <returns>The object's hash code.</returns>
        public override int GetHashCode()
        {
            return DatabaseName.GetHashCode() ^
                (Password != null ? Password.GetHashCode() : 0) ^
                ServerName.GetHashCode() ^
                (UserName != null ? UserName.GetHashCode() : 0) ^
                UseWindowsAuthentication.GetHashCode() ^ IsProtected.GetHashCode();
        }

        /// <summary>
        /// Saves the database configuration.
        /// </summary>
        public void Save()
        {
            Save(Directory.GetCurrentDirectory());
        }

        /// <summary>
        /// Saves the database configuration.
        /// </summary>
        /// <param name="path">The path to the MobiControl installation files.</param>
        public void Save(string path)
        {
            var logMessage = DateTime.Now.ToString() + "  =>  ";

            if (path == null)
                Log(logMessage + "[ERROR] Error Load ConnectionString path is null ");

            var config = GetConfiguration(path);

            config.ConnectionStrings.ConnectionStrings["DbConnectionString"].ConnectionString = BuildConnectionString();

            // Protect (encrypt)the section.
            config.ConnectionStrings.SectionInformation.ProtectSection("RsaProtectedConfigurationProvider");

            // Save the encrypted section.
            config.ConnectionStrings.SectionInformation.ForceSave = true;

            config.Save();

            IsProtected = true;

            // no longer need to write to MCDB.ini, just in case make sure MCDB.ini was deleted
            if (File.Exists(Path.Combine(path, "MCDB.ini")))
                File.Delete(Path.Combine(path, "MCDB.ini"));

            // Since we use the same database connection string for this
            // application, refresh our config so that the other sections
            // write to the correct database.
            ConfigurationManager.RefreshSection("connectionStrings");
        }

        /// <summary>
        /// Gets a configuration
        /// </summary>
        /// <param name="path">The configuration folder's path</param>
        /// <returns>Loaded configuration</returns>
        private static System.Configuration.Configuration GetConfiguration(string path)
        {
            var logMessage = DateTime.Now.ToString() + "  =>  ";
            try
            {
                ExeConfigurationFileMap map = new ExeConfigurationFileMap
                {
                    ExeConfigFilename = Path.Combine(path, "MCDeplSvr.exe.config")
                };

                var config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                if (!config.HasFile)
                {

                    map = new ExeConfigurationFileMap
                    {
                        ExeConfigFilename = Path.Combine(path, "Soti.MobiControl.ManagementService.Host.exe.config")
                    };

                    config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

                    if (!config.HasFile)
                    {
                        Log(logMessage + "[ERROR] DatabaseSection.GetConfiguration - Deployment Server and Management Service do not have config files!");
                    }
                }
                return config;
            }
            catch (Exception ex)
            {
                Log(logMessage + ex.ToString());
                return null;
            }
            
        }

        /// <summary>
        /// Log Service
        /// </summary>
        /// <param name="message">Log Message.</param>
        private static void Log(string message)
        {
            StreamWriter streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            streamWriter.WriteLine(message);
            streamWriter.Close();
            streamWriter = null;
        }
        /// <summary>
        /// Builds a database connection string using the given builder.
        /// </summary>
        /// <returns>The connection string.</returns>
        private string BuildConnectionString()
        {
            var builder = new SqlConnectionStringBuilder();

            builder["Data Source"] = ServerName;
            builder["Initial Catalog"] = DatabaseName;

            if (UseWindowsAuthentication)
            {
                builder["Integrated Security"] = "True";
            }
            else
            {
                builder["Integrated Security"] = "False";
                builder["User ID"] = UserName;
                builder["Password"] = Password;
            }

            // default name - changed by C# apps but not by DS
            builder["Application Name"] = "SOTI MobiControl Deployment Server";

            return builder.ToString();
        }
    }
}
