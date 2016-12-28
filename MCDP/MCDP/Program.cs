namespace Soti.MCDP
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
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
