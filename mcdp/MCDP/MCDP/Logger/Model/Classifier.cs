using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soti.MCDP.Logger.Model
{
    public static class Classifier
    {
        public static string CreateSuccess => "Create_Success";
        public static string CreateError => "Create_Error";
        public static string ReadSuccess => "Read_Success";
        public static string ReadError => "Read_Error";
        public static string UpdateSuccess => "Update_Success";
        public static string UpdateError => "Update_Error";
        public static string DeleteSuccess => "Delete_Success";
        public static string DeleteError => "Delete_Error";
        public static string ServerSuccess => "Server_Success";
        public static string ServerError => "Server_Error";
        public static string SystemFailure => "System_Failure";
        public static string TestLog => "Test_Log";
    }

    public static class Priority
    {
        public static string Fatal => "Fatal";
        public static string Critical => "Critical";
        public static string Important => "Important";
        public static string Warning => "Warning";
        public static string Info => "Info";
    }

    public static class Producer
    {
        public static string Component => "Component";
        public static string Agent => "Agent";
        public static string Tenant => "Tenant";
    }
}
