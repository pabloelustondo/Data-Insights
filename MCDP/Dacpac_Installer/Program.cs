using System;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using Microsoft.SqlServer.Dac;

namespace Soti.MCDP.DacpacInstaller
{
    internal static class Program
    {
        private const int DacPacCommandTimeout = 300;

        private static int Main(string[] args)
        {
            if (args.Length < 6)
            {
                Trace("DACPAC Installer: Incorrect amount of arguments: " + args.Length);
                return -1;
            }

            var targetServer = "";
            var targetDatabaseName = "";
            var userName = "";
            var password = "";
            var dacpacFile = "";
            string[] variables = new string[0];
            for (var i = 0; i < args.Length; i++)
            {
                switch (args[i])
                {
                    case "-S":
                        targetServer = args[++i];
                        Trace(string.Format("Target server: '{0}'", targetServer));
                        break;

                    case "-D":
                        targetDatabaseName = args[++i];
                        Trace(string.Format("Target database: '{0}'", targetDatabaseName));
                        break;

                    case "-U":
                        userName = args[++i];
                        Trace(string.Format("User name: '{0}'", userName));
                        break;

                    case "-P":
                        password = args[++i];
                        break;

                    case "-d":
                        dacpacFile = args[++i];
                        Trace(string.Format(@"DACPAC File: ""{0}""", dacpacFile));
                        break;

                    case "-v":
                        variables = args[++i].Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
                        Trace("Variables: ");
                        foreach (var variable in variables)
                        {
                            Trace("    " + variable);
                        }

                        break;

                    default:
                        Trace("Incorrect argument: " + args[i]);
                        return -1;
                }
            }

            var isIntegratedSecurity = string.IsNullOrEmpty(userName);

            var connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = targetServer,
                IntegratedSecurity = isIntegratedSecurity
            };

            if (!isIntegratedSecurity)
            {
                connectionStringBuilder.UserID = userName;
                connectionStringBuilder.Password = password;
            }

            try
            {
                var dacServices = new DacServices(connectionStringBuilder.ConnectionString);

                dacServices.Message += dbServices_Message;
                dacServices.ProgressChanged += dbServices_ProgressChanged;

                using (var dbPackage = DacPackage.Load(dacpacFile, DacSchemaModelStorageType.Memory))
                {
                    var deployOptions = new DacDeployOptions
                    {
                        BackupDatabaseBeforeChanges = false, // The backup/restore is done by DBSetup
                        BlockOnPossibleDataLoss = false,
                        DropIndexesNotInSource = true,
                        RegisterDataTierApplication = true,
                        BlockWhenDriftDetected = false,
                        VerifyDeployment = false,
                        ScriptNewConstraintValidation = false,
                        CommandTimeout = DacPacCommandTimeout
                    };

                    foreach (var variable in variables)
                    {
                        var keyvalue = variable.Split('=');
                        deployOptions.SqlCommandVariableValues.Add(keyvalue[0], keyvalue[1]);
                    }

                    Trace("Deploying DACPAC file...");
                    dacServices.Deploy(dbPackage, targetDatabaseName, true, deployOptions);
                }

                Trace("SUCCESS: DACPAC file has been deployed successfully.");
            }
            catch (Exception ex)
            {
                Trace("FAILURE: DACPAC has failed to deploy: " + ex);
                return -1;
            }

            return 0;
        }

        private static void dbServices_Message(object sender, DacMessageEventArgs e)
        {
            Trace("DAC Message: " + e.Message);
        }

        private static void dbServices_ProgressChanged(object sender, DacProgressEventArgs e)
        {
            var message = string.Format(
                CultureInfo.InvariantCulture,
                "{0} [{1}]: {2}",
                e.Status,
                e.OperationId,
                e.Message);

            Trace(message);
            Console.WriteLine(message);
        }

        private static void Trace(string message)
        {
            using (var output = new StreamWriter("C:\\DBInstall.log", true))
            {
                output.WriteLine("{0:yyyy-MM-dd HH:mm:ss.fff}:\tDACPAC: {1}", DateTime.Now, message);
                output.Close();
            }
        }
    }
}
