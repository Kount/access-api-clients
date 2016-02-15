/**
 * Service API access class.
 * This class provides helper functions to utilize the Kount Access API
 * service.  In order to use this service you will be required to furnish:
 *   * Your Merchant ID
 *   * Your API Key
 *   * The API server you want to connect to
 *   * Information related to the queries you wish to make, including:
 *       * Session Id
 *       * username (hashed)
 *       * password (hashed)
 *
 * Online Help docucmentation for the endpoints can be retrieved from the
 * get*Help functions by passing in a version number.
 * See the reference_implementation.php for sample usage.
 *
 * @version 1.0.0
 * @copyright 2015 Kount, Inc. All Rights Reserved.
 */

/**
 * Required Libraries
 */
// needle is needed for http calls
var needle = require("needle");
// js-sha512 is used to hash account data prior to sending
var sha = require('js-sha512').sha512_256;


/**
 * Constructor.
 * MerchantId, apiKey, and serverName must be passed in. Version is optional.
 * @param int merchantId Your Merchant Id assigned by Kount
 * @param string apiKey API key for Kount Access
 * @param string serverName Server name (i.e. 'someserver.kountaccess.com')
 * provided by Kount for your environments (testing and production)
 * @param string version The Version of the API to use (defaults to "0210")
 */
module.exports = function (merchantId, apiKey, serverName, version) {
  this.merchantId = merchantId;
  this.apiKey = apiKey;
  this.serverName = serverName;
  this.defaultVersion = typeof version !== 'undefined' ? version : "0210";

  /**
   * Gets Device information based on the sessionId
   * @param string sessionId Session ID
   * @param function callback Expects a signature with 2 parameters (err, data)
   * The data object will contain a JSON Array object.
   */
  this.getDevice = function (sessionId, callback) {
    // validate required fields
    if (typeof sessionId !== 'string' || sessionId.length < 1) {
      return callback("Invalid sessionId [" + sessionId + "]",null);
    }
    var endpoint = "/api/device?s=" + sessionId + "&v=" + this.defaultVersion;
    this.makeRequest(endpoint, "GET", null, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    });
  } // end this.getDevice

  /**
   * Gets the velocity information for the device based on the sessionId,
   * user and passwords.  These values are re-hashed in case the client
   * passed them in the clear prior to sending them off to the api server.
   * @param string sessionId Session ID
   * @param string user The username pre-hashed. (We will re-hash it just
   * in case)
   * @param string password The password pre-hashed (we will re-hash it
   * just in case)
   * @param function callback Expects a signature with 2 parameters (err, data)
   * The data object will contain a JSON Array object.
   */
  this.getVelocity = function (sessionId, user, password, callback) {
    // validate required fields
    if (typeof sessionId !== 'string' || sessionId.length < 1) {
      return callback("Invalid sessionId [" + sessionId + "]",null);
    } else if (typeof user !== 'string' || user.length < 1) {
      return callback("Missing user",null);
    } else if (typeof password !== 'string' || password.length < 1) {
      return callback("Missing password",null);
    }

    // Setup request
    var endpoint = "/api/velocity";
    var parms = {
      s:sessionId,
      v: this.defaultVersion,
      uh: this.hash(user),
      ph: this.hash(password),
      ah: this.hash(user + ":" + password)
    };
    this.makeRequest(endpoint, "POST", parms, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    })
  } // end this.getVelocity

  /**
   * Gets the decision, device information, and velocity information for
   * the device based on the sessionId, user and passwords.  These values
   * are re-hashed in case the client passed them in the clear prior to
   * sending them off to the api server.
   * @param string sessionId Session ID
   * @param string user The username pre-hashed. (We will re-hash it just
   * in case)
   * @param string password The password pre-hashed (we will re-hash it
   * just in case)
   * @param function callback Expects a signature with 2 parameters (err, data)
   * The data object will contain a JSON Array object.
   */
  this.getDecision = function (sessionId, user, password, callback) {
    // validate required fields
    if (typeof sessionId !== 'string' || sessionId.length < 1) {
      return callback("Invalid sessionId [" + sessionId + "]",null);
    } else if (typeof user !== 'string' || user.length < 1) {
      return callback("Missing user",null);
    } else if (typeof password !== 'string' || password.length < 1) {
      return callback("Missing password",null);
    }

    // setup request
    var endpoint = "/api/decision";
    var parms = {
      s :sessionId,
      v : this.defaultVersion,
      ah: this.hash(user + ":" + password),
      uh: this.hash(user),
      ph: this.hash(password),
    };

    this.makeRequest(endpoint, "POST", parms, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    });
  } // end this.getDecision

  /**
   * Gets the help documentation as an HTML page for the version
   * specified.  If none are specified the default version is used.
   * @param string version The version to get docs for
   * @param function callback The Callback function to call (optionally)
   */
  this.getDeviceHelp = function (version, callback) {
    var endpoint = "/api/device?help=true&v=" + version;
    this.makeRequest(endpoint, "GET", null, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    });
  } //end getDecisionHelp

  /**
   * Gets the help documentation as an HTML page for the version
   * specified.  If none are specified the default version is used.
   * @param string version The version to get docs for
   * @param function callback The Callback function to call (optionally)
   */
  this.getVelocityHelp = function (version, callback) {
    var endpoint = "/api/velocity";
    var parms = {
      help: "true",
      v   : version,
    };
    this.makeRequest(endpoint, "POST", parms, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    });
  } //end getDecisionHelp



  /**
   * Gets the help documentation as an HTML page for the version
   * specified.  If none are specified the default version is used.
   * @param string version The version to get docs for
   * @param function callback The Callback function to call (optionally)
   */
  this.getDecisionHelp = function (version, callback) {
    var endpoint = "/api/decision";
    var parms = {
      help: "true",
      v   : version,
    };
    this.makeRequest(endpoint, "POST", parms, function(err, results) {
        if(err) {
          return callback(err, null);
        }
        callback(null, results);
    });
  } //end getDecisionHelp

  /**
   * hashing function that SHA-256 hashes the input and returns in the
   * callback
   * @param string text the string to hash
   * @return string Hashed value
   */
  this.hash = function (text) {
    return sha(text);
  } // end hash

  /**
   * Makes the https request
   *
   * @param string endpoint The endpoint on the server
   * @param string method Either GET or POST
   * @param string parms Data values for POST
   * @param function callback Function to call with a singature of (err,data)
   * in which data is the response.
   */
  this.makeRequest = function(endpoint, method, parms, callback) {

    var url = "https://" + this.serverName + endpoint;
    var options = {
       "username": this.merchantId,
       "password": this.apiKey,
       "accept": "text/json",
    };

    if (method == "GET") {
      var request = needle.get(url, options, function(err,response){
        if (!err && response.statusCode == 200) {
          callback(null,response.body)
        } else {
          if (err) {
            return callback(err,null)
          } else {
            return callback("HTTP ERROR STATUS:" + response.statusCode, null)
          }
        }
      });
    } else if (method == "POST") {
      var request = needle.post(url, parms, options, function(err,response){
        if (!err && response.statusCode == 200) {
          callback(null,response.body)
        } else {
          if (err) {
            return callback(err,null)
          } else {
            return callback("HTTP ERROR STATUS:" + response.statusCode, null)
          }
        }
      });
    }
  } // end makeRequest

} // end module.exports KountAccessApiService
