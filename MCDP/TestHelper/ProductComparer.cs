using System;
using System.Collections;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;

namespace TestsHelper
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
            return expected.dev_id.CompareTo(actual.dev_id);
        }
    }
}
