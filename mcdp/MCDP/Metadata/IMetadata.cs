using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soti.MCDP.Metadata
{
    public interface IMetadata
    {
        string TableName { get; }
        string BatchSize { get; }
        string TimeColumnName { get; }
        string RetrieveDataByMetadata();
        void ConfirmStatusData(bool pass);
    }
}
