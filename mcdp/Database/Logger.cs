using System;
using System.Globalization;
using System.IO;

namespace Soti.MCDP.Database
{
    public static class Logger
    {
        public static void Log(string severity, string message)
        {
            string str1 = DateTime.Now.ToString((IFormatProvider)CultureInfo.InvariantCulture) + "  =>  ";
            StreamWriter streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            string str2 = str1 + severity + message;
            streamWriter.WriteLine(str2);
            streamWriter.Close();
        }
    }
}
