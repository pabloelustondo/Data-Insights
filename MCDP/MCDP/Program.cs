using System;
using System.Collections.Generic;
using System.Configuration.Install;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using System.Text;

namespace Soti.MCDP
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {

#if DEBUG
                MCDP mcdp = new MCDP();
                mcdp.OnDebug();
                System.Threading.Thread.Sleep(System.Threading.Timeout.Infinite);
            
#else
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[]
                {
                    new MCDP()
                };
                ServiceBase.Run(ServicesToRun);
            
#endif

        }
    }
}
