// Decompiled with JetBrains decompiler
// Type: Soti.MCDP.Database.Model.LogSeverity
// Assembly: Database, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 58F23204-ECB2-43C4-9846-23C9C9926FA1
// Assembly location: D:\BI_May\BI_May08\mcdp\Installer\Installer Files\Database.dll

namespace Soti.MCDP.Logger.Model
{
    public static class LogSeverity
    {
        public static string Off
        {
            get
            {
                return " [OFF] ";
            }
        }

        public static string Fatal
        {
            get
            {
                return " [FATAL] ";
            }
        }

        public static string Error
        {
            get
            {
                return " [ERROR] ";
            }
        }

        public static string Warning
        {
            get
            {
                return " [WARNING] ";
            }
        }

        public static string Info
        {
            get
            {
                return " [INFO] ";
            }
        }

        public static string Debug
        {
            get
            {
                return " [DEBUG] ";
            }
        }

        public static string All
        {
            get
            {
                return " [ALL] ";
            }
        }
    }
}
