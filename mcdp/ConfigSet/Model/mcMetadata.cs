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

        public string interval { get; set; }

        public pollStation pollStation { get; set; }
    }

    public class pollStation
    {
        public string TimeColumnName { get; set; }

        public int? BatchSize { get; set; }
    }
}
