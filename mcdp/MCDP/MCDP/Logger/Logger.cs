using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Soti.MCDP.Logger.Model;

namespace Soti.MCDP.Logger
{
    public class Logger
    {
        public static void Log(string classifier, string priority, string message, Dictionary<string,string> param = null)
        {
            var logMsg = new StringBuilder("{\"Classifier\":" + classifier + "\"");

            logMsg.Append(", \"message\": \"" + message + "\"");

            if (param != null && param.Count != 0)
            {
                logMsg.Append(", \"params\": ");
                var entries = param.Select(d => $"\"{d.Key}\": \"{d.Value}\"");
                logMsg.Append("{" + string.Join(",", entries) + "}");
            }
            logMsg.Append(", \"priority\": \"" + priority + "\"");
            logMsg.Append(", \"producer\": {\"Agent\":\"MCDP\"}");
            logMsg.Append(", \"serverId\": \"\"");
            logMsg.Append(", \"tenantId\": \"\"");
            logMsg.Append("}");
            //return logMsg.ToString();

            var str1 = "[" + DateTime.Now.ToString((IFormatProvider)CultureInfo.InvariantCulture) + "] ";
            var streamWriter = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "MCDP.log", true);
            var str2 = str1 + logMsg;
            streamWriter.WriteLine(str2);
            streamWriter.Close();
        }
    }
}
