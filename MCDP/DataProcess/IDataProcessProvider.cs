namespace Soti.MCDP.DataProcess
{
    /// <summary>
    /// Interface for Data Process Provider.
    /// </summary>
    public interface IDataProcessProvider
    {
        /// <summary>
        /// Start MCDP Process.
        /// </summary>
        void McdpTimerProcess();
    }
}
