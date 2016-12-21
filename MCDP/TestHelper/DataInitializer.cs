using System;
using System.Collections.Generic;
using Soti.MCDP.Database.Model;

namespace TestsHelper
{
    /// <summary>
    /// Data initializer for unit tests
    /// </summary>
    public class DataInitializer
    {
        /// <summary>
        /// Dummy products
        /// </summary>
        /// <returns></returns>
        public static List<DataRow4Ida> GetAll()
        {
            var DeviceSyncStatusList = new List<DataRow4Ida>
            {
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707452", 
                      int_value = "89", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:36.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:26.463")
                },
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707452", 
                      int_value = "88", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:37.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:27.463")
                },
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707452", 
                      int_value = "87", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:38.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:28.463")
                },
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707451", 
                      int_value = "86", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:39.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:29.463")
                },
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707451", 
                      int_value = "85", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:40.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:30.463")
                },
                new DataRow4Ida()
                {
                      dev_id = "0f32f9066aeabfcc1d0461841d331c7a54707451", 
                      int_value = "84", 
                      server_time_stamp = Convert.ToDateTime("2016-11-29 18:57:41.683"), 
                      stat_type = -1, 
                      time_stamp = Convert.ToDateTime("2016-11-24 14:21:31.463")
                },
            };
            return DeviceSyncStatusList;
        }
    }
}
