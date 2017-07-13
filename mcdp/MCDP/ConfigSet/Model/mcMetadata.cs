using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soti.MCDP.ConfigSet.Model
{
    public class mcMetadata
    {
        public string tableName { get; set; }

        public string scheduledTime { get; set; }

        public string repeat { get; set; }

        public string timeColumnName { get; set; }

        public string batchSize { get; set; }
    }
}
