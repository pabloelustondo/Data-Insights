using System;
using System.Collections;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;

namespace TestsHelper
{
    public class ProductComparer : IComparer, IComparer<DataRow4Ida>
    {
        public int Compare(object expected, object actual)
        {
            var lhs = expected as DataRow4Ida;
            var rhs = actual as DataRow4Ida;
            if (lhs == null || rhs == null) throw new InvalidOperationException();
            return Compare(lhs, rhs);
        }

        public int Compare(DataRow4Ida expected, DataRow4Ida actual)
        {
            return expected.dev_id.CompareTo(actual.dev_id);
        }
    }
}
