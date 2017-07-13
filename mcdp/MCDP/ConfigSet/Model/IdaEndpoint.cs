using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soti.MCDP.ConfigSet.Model
{
    public class IdaEndpoint
    {
        public Uri IdaSendDataUrl { get; set; }

        public Uri IdaHandShakeUrl { get; set; }

        public Uri IdaMetadataUrl { get; set; }

        public Uri IdaLogUrl { get; set;  }

        public string ExpiredJwtToken { get; set; }
    }
}
