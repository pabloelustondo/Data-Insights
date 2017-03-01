using System.ServiceProcess;

namespace Soti.MCDP
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main(string[] args)
        {
                System.IO.Directory.SetCurrentDirectory(System.AppDomain.CurrentDomain.BaseDirectory);
#if DEBUG
                var mcdp = new MCDP();
                mcdp.OnDebug();
                System.Threading.Thread.Sleep(System.Threading.Timeout.Infinite);
            
#else
            var servicesToRun = new ServiceBase[]
            {
                new MCDP()
            };
                ServiceBase.Run(servicesToRun);
            
#endif

        }
    }
}
