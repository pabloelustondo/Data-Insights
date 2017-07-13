using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soti.MCDP.Metadata.Model
{
    public class MetadataType
    {
        public string TableName { get; set; }

        public string[] Projections { get; set; }

        public string[] Filter { get; set; }

        public string ScheduledTime { get; set; }

        public string Repeat { get; set; }

        public string TimeColumnName { get; set; }

        public string BatcheSize { get; set; }

    }
}