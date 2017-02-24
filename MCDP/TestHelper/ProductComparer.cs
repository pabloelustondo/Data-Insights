using System;
using System.Collections;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;

namespace TestHelper
{
    public class ProductComparer : IComparer, IComparer<DeviceStatInt>
    {
        public int Compare(object expected, object actual)
        {
            var lhs = expected as DeviceStatInt;
            var rhs = actual as DeviceStatInt;
            if (lhs == null || rhs == null) throw new InvalidOperationException();
            return Compare(lhs, rhs);
        }

        public int Compare(DeviceStatInt expected, DeviceStatInt actual)
        {
            return string.Compare(expected.dev_id, actual.dev_id, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
