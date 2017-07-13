using Newtonsoft.Json;
using Soti.MCDP.ConfigSet.Model;
using Soti.MCDP.Logger.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;

namespace Soti.MCDP.ConfigSet
{
    public sealed class ConfigSet
    {
        /// <summary>
        ///     Ida EndPoint in JWT
        /// </summary>
        public IdaEndpoint IdaEndpoints { get; } = new IdaEndpoint();
        /// <summary>
        ///     Metadata Definition List from DMM
        /// </summary>
        public List<mcMetadata> MetadataList { get; } = new List<mcMetadata>();
        /// <summary>
        ///     get ida Token name in JWT
        /// </summary>
        private readonly string _idaInformation;
        /// <summary>
        ///     Instance holder
        /// </summary>
        private static ConfigSet _instance = null;
        /// <summary>
        ///     lock object
        /// </summary>
        private static readonly object Padlock = new object();

        private ConfigSet()
        {
            try
            {
                var jwtTokenPath = Path.Combine(Directory.GetCurrentDirectory(),
                    ConfigurationManager.AppSettings["JWTTokenName"]);

                //Endpoint signature
                _idaInformation = ConfigurationManager.AppSettings["idaInformation"];

                if (File.Exists(jwtTokenPath))
                {
                    var jwtToken = File.ReadAllText(jwtTokenPath);

                    //Decoded JWT Token of Ida Url
                    var idaDecodedInformation = DecodedJwtToken(jwtToken);

                    //URL validation
                    if (Uri.TryCreate(idaDecodedInformation.url, UriKind.Absolute, out Uri uriResult)
                        && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                    {
                        IdaEndpoints.IdaSendDataUrl = new Uri(uriResult, idaDecodedInformation.post_Data);

                        IdaEndpoints.IdaHandShakeUrl = new Uri(uriResult, idaDecodedInformation.get_Token);

                        IdaEndpoints.IdaMetadataUrl = new Uri(uriResult, idaDecodedInformation.get_Metadata);

                        IdaEndpoints.IdaLogUrl = new Uri(uriResult, idaDecodedInformation.post_Log);

                        IdaEndpoints.ExpiredJwtToken = UpdateToken(jwtToken);

                        LoadMetadataDefinition(IdaEndpoints.ExpiredJwtToken);
                    }
                    else
                    {
                        Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "Invalid IDA Url.");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "ConfigSet-ConfigSet: " + ex);
            }
        }

        public static ConfigSet Instance
        {
            get
            {
                lock (Padlock)
                {
                    return _instance ?? (_instance = new ConfigSet());
                }
            }
        }

        /// <summary>
        ///     This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="token"></param>
        private string UpdateToken(string token)
        {
            dynamic result = string.Empty;
            try
            {
                using (var client = new WebClient())
                {
                    //client.Headers["x-api-key"] = "blah";
                    client.Headers["x-access-token"] = token;
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    ServicePointManager.ServerCertificateValidationCallback +=
                        (sender, certificate, chain, sslPolicyErrors) => true;

                    result = JsonConvert.DeserializeObject<dynamic>(client.DownloadString(IdaEndpoints.IdaHandShakeUrl));
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "ConfigSet-Update Token Failed: " + ex);
            }
            return result.session_token;
        }

        private void LoadMetadataDefinition(string token)
        {
            try
            {
                using (var client = new WebClient())
                {
                    //client.Headers["x-api-key"] = "blah";
                    client.Headers["x-access-token"] = token;
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    ServicePointManager.ServerCertificateValidationCallback +=
                        (sender, certificate, chain, sslPolicyErrors) => true;

                    var res = JsonConvert.DeserializeObject<dynamic>(client.DownloadString(IdaEndpoints.IdaMetadataUrl));

                    if (res["data"] == null) return;

                    foreach (var data in res["data"])
                    {
                        if (data["mcMetadata"] != null && !string.IsNullOrEmpty(data["mcMetadata"].ToString()))
                        {
                            //update metadata list
                            MetadataList.Add(
                                JsonConvert.DeserializeObject<mcMetadata>(data["mcMetadata"].ToString()));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "ConfigSet-Load Metadata Definition Failed: " + ex);
            }
        }

        /// <summary>
        ///     This method is the one that actually send data to the input data adapter
        /// </summary>
        /// <param name="token"></param>
        private IdaInformation DecodedJwtToken(string token)
        {
            var result = new IdaInformation();

            try
            {
                var jwtToken = new JwtSecurityToken(token);
                var t = jwtToken.Claims.First(c => c.Type == _idaInformation).Value;

                result = JsonConvert.DeserializeObject<IdaInformation>(t);
            }
            catch (Exception ex)
            {
                Logger.Logger.Log(Classifier.ReadError, Priority.Critical, "ConfigSet-Decoded Jwt Token Failed." + ex);
            }

            return result;
        }
    }
}
