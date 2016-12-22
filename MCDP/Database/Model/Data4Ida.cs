using System.Collections.Generic;

namespace Soti.MCDP.Database.Model
{
    /// <summary>
    /// This class represents a new set of records that is going to be sent to the input data adapter
    /// </summary>
    public class Data4Ida
    {
        public string createdAt;

        public List<DataRow4Ida> data;

        public string metadata;
    }
}
