using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Soti.MCDP.Logger.Model;

namespace Soti.MCDP.Logger
{
    public static class Logger
    {
        public static string Log(string classifier, string priority, string message, Dictionary<string,string> param = null)
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
            logMsg.Append(", \"serverId\": \"????????????\"");
            logMsg.Append(", \"tenantId\": \"????????????\"");
            logMsg.Append("}");
            return logMsg.ToString();
        }
    }
}
