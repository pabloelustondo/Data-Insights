using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Policy;
using Newtonsoft.Json;
using Soti.MCDP.ConfigSet.Model;

namespace Soti.MCDP.ConfigSet
{
    public sealed class ConfigSet
    {

        public Uri IdaSendDataUrl { get { return _idaSendDataUrl; } }
        public Uri IdaHandShakeUrl { get { return _idaHandShakeUrl; } }
        public Uri IdaMetadataUrl { get { return _idaMetadataUrl; } }
        public Uri IdaLogUrl { get { return _idaLogUrl; } }

        public List<mcMetadata> MetadataList { get { return _metadataList; } }

        public string ExpiredJwtToken { get { return _expiredJwtToken; } }

        /// <summary>
        ///     get JWT Token Path.
        /// </summary>
        private readonly string _jwtTokenPath;

        /// <summary>
        ///     get ida Token name in JWT
        /// </summary>
        private readonly string _idaInformation;

        /// <summary>
        /// get JWT Token from IDA.
        /// </summary>
        private readonly string _jwtToken;

        /// <summary>
        /// Decoded JWT Token.
        /// </summary>
        private IdaInformation _idaDecodedInformation;

        /// <summary>
        ///     get HandShake URL
        /// </summary>
        private Uri _idaSendDataUrl;

        /// <summary>
        ///     get HandShake URL
        /// </summary>
        private Uri _idaHandShakeUrl;

        /// <summary>
        ///     get HandShake URL
        /// </summary>
        private Uri _idaMetadataUrl;

        /// <summary>
        ///     get HandShake URL
        /// </summary>
        private Uri _idaLogUrl;

        /// <summary>
        ///     get Expired JWT Token from IDA.
        /// </summary>
        private string _expiredJwtToken;

        /// <summary>
        ///     List of Metadata
        /// </summary>
        private List<mcMetadata> _metadataList = new List<mcMetadata>();

        private static ConfigSet _instance = null;
        private static readonly object Padlock = new object();

        private ConfigSet()
        {

            _jwtTokenPath = Path.Combine(Directory.GetCurrentDirectory(),
                ConfigurationManager.AppSettings["JWTTokenName"]);

            //Endpoint signature
            _idaInformation = ConfigurationManager.AppSettings["idaInformation"];

            //_idaDataEndpoint = ConfigurationManager.AppSettings["idaDataEndpoint"];
            //_idaHandShakeEndpoint = ConfigurationManager.AppSettings["idaHandShakeEndpoint"];

            if (File.Exists(_jwtTokenPath))
            {
                _jwtToken = File.ReadAllText(_jwtTokenPath);

                //Decoded JWT Token of Ida Url
                _idaDecodedInformation =  DecodedJwtToken(_jwtToken); 

                //URL validation
                if (Uri.TryCreate(_idaDecodedInformation.url, UriKind.Absolute, out Uri uriResult)
                    && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                {
                    _idaSendDataUrl = new Uri(uriResult, _idaDecodedInformation.post_Data);

                    _idaHandShakeUrl = new Uri(uriResult, _idaDecodedInformation.get_Token);

                    _idaMetadataUrl = new Uri(uriResult, _idaDecodedInformation.get_Metadata);

                    _idaLogUrl = new Uri(uriResult, _idaDecodedInformation.post_Log);

                    _expiredJwtToken = UpdateToken(_jwtToken);

                    UpdateMetadataDefinition(_expiredJwtToken);
                }
                else
                {
                    //Logger.Logger.Log(LogSeverity.Error, "Invalid IDA Url: " + uriResult);
                }

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

                    result = JsonConvert.DeserializeObject<dynamic>(client.DownloadString(_idaHandShakeUrl));
                }
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
            }
            return result.session_token;
        }

        private void UpdateMetadataDefinition(string token)
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

                    var res = JsonConvert.DeserializeObject<dynamic>(client.DownloadString(_idaMetadataUrl));

                    if (res["data"] == null) return;

                    foreach (var data in res["data"])
                    {
                        if (data["mcMetadata"] != null && !string.IsNullOrEmpty(data["mcMetadata"].ToString()))
                        {
                            //update metadata list
                            _metadataList.Add(
                                JsonConvert.DeserializeObject<mcMetadata>(data["mcMetadata"].ToString()));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
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
                //Logger.Logger.Log(LogSeverity.Error, ex.ToString());
            }

            return result;
        }
    }
}
