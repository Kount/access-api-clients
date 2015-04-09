Kount Access API Library for Node.js
===================================

Overview
--------
This package contains a node.js library to utilize the API services of Kount's
Access Product.  For more information on what Kount Access is, go to
http://www.kount.com

Installing
----------
The easiest way to install kount-access is using npm:

    npm install kount-access-api

You can also download the latest from github:

    https://github.com/Kount/access-api-clients/nodejs/kount-access.git

Usage
-----
In your node.js application add the require for this package:

    var kount = require('kount-access-api')

Ensure you have the information needed to instantiate the library in your app.

*  **merchantId** - The merchant ID provided to you from Kount.
*  **apiKey** - the API key you generated from kount (or was provided to you)
*  **serverName** - The DNS name of the server you want to connect to. These are
     also provided by merchant services.  You should have one server assigned
     for testing and one for production.
*  **version** - The version of the API to access (defaults to the current
     version "0200").  The version is in the form of a 4 digit string

In your application it should look something like this:

    //Replace with your merchant Id
    var merchantId = 123456
    var apiKey = 'YOUR-API-KEY-GOES-HERE'
    var serverName = 'someserver.kountaccess.com'
    var version = '0200' //Optional
Then create an instance of the Library interface:

    var ka = new kount.KountAccessApiLibrary(merchantId, apiKey, serverName, version)

Now you are ready to call the API Services.

In the /example directory there is a referenceImplementation.js that can walk you through
each of the API calls. However to use the example, you will need to npm install prompt and update the merchantId, apiKey, serverName, and sessionId fields.

    npm install prompt


###getDevice

If you are just looking for information about the device (like the
device id, or pierced IP Address) The use the getDevice() function.
This example shows how to get device info and what it would look like as
a json array.

Required minimum Kount Access API version: **0103**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.
* **callback** - Callback function to return the information you are looking for in the form of callback(error, data).  This follows standard Node.js callback functionality.  The Data value (when valid) will be a JSON object (associative array).

Code example:

    response = ka.getDevice(sessionId, function (err, data) {
        if (err !== null) {
            console.log("Error:" + err)
        } else {
            console.log(data)
        }
    })

Sample"data" value:

    { "device":
        { "mobile": 0,
          "country": "US",
          "region": "ID",
          "ipGeo": "US",
          "proxy": 0,
          "ipAddress": "64.128.91.251",
          "id": "0cbf8913c671cb0f736c5636d2a4be28"
        },
      "response_id": "4a326720df188e65134e4d8a85fc5531"
    }

For more information about the fields in the request or response, please see
the API Documentation for the Version you are interested in.

###getVelocity
If you want to know about the velocity of your users or devices as it pertains
to other data points, you would want to call getVelocity().  This allows you to
see the relationships between the following pieces of information over a period
of time:

*  Devices
*  IP Addresses
*  Usernames
*  Passwords
*  Accounts

The Device information is also included in this response in addition to the
velocity information.  You can use this velocity information in your own
decisioning engine. The service also re-hashes the account information before
pushing it over HTTPS just in case you forgot to.

Required minimum Kount Access API version: **0103**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.
*  **userHash** - This is a hashed value of the username used for login
*  **passwordHash** - This is a hashed value of the password used for login.
* **callback** - Callback function to return the information you are looking for in 
     the form of callback(error, data).  This follows standard Node.js callback
     functionality.  The Data value (when valid) will be a JSON object (associative 
     array).

Code example:

    response = ka.getVelocity(sessionId, userHash, passwordHash, function (err, data) {
        if (err !== null) {
            console.log("Error:" + err)
        } else {
            console.log(data)
        }
    })

Sample"data" value:

    {"device": {"mobile": 0, "country": "US", "region": "ID", "ipGeo": "US", "proxy": 0, "ipAddress": "64.128.91.251", "id": "0cbf8913c671cb0f736c5636d2a4be28"}, "velocity": {"device": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "iplh": 1, "iplm": 1, "plh": 1}, "account": {"ulh": 1, "iplh": 1, "iplm": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "password": {"iplh": 1, "ulh": 1, "alm": 1, "iplm": 1, "alh": 1, "ulm": 1, "dlh": 1, "dlm": 1}, "ip_address": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "user": {"iplh": 1, "alm": 1, "iplm": 1, "alh": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}}, "response_id": "0a8f7366a2e50956fc4dee0220ad9ab0"}

For more information about the fields in the request or response, please see
the API Documentation for the Version you are interested in.

###getDecision
If you want Kount Access to evaluate possible threats using our
Thresholds Engine, you will want to call the getDecision endpoint.
This example shows how to call the decision call and what it would look
like as an associative array. This response also includes device information
and velocity data in addition to the decision information.  The decision
value can be either "**A**" - Approve, or "**D**" - Decline.  In addition is will
show the ruleEvents evaluated that forces a "**D**"(Decline) result.  If you
do not have any thresholds established it will always default to
"**A**"(Approve). For more information on setting up thresholds, consult the
 User Guide.

Required minimum Kount Access API version: **0200**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.
*  **userHash** - This is a hashed value of the username used for login
*  **passwordHash** - This is a hashed value of the password used for login.
* **callback** - Callback function to return the information you are looking for in 
     the form of callback(error, data).  This follows standard Node.js callback 
     functionality.  The Data value (when valid) will be a JSON object (associative 
     array).

Code example:

    response = ka.getDecision(sessionId, userHash, passwordHash, function (err, data) {
        if (err !== null) {
            console.log("Error:" + err)
        } else {
            console.log(data)
        }
    })

Sample"data" value:

    {"device": {"mobile": 0, "country": "US", "region": "ID", "ipGeo": "US", "proxy": 0, "ipAddress": "64.128.91.251", "id": "0cbf8913c671cb0f736c5636d2a4be28"}, "velocity": {"device": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "iplh": 1, "iplm": 1, "plh": 1}, "account": {"ulh": 1, "iplh": 1, "iplm": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "password": {"iplh": 1, "ulh": 1, "alm": 1, "iplm": 1, "alh": 1, "ulm": 1, "dlh": 1, "dlm": 1}, "ip_address": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "user": {"iplh": 1, "alm": 1, "iplm": 1, "alh": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}}, "decision": {"reply": {"ruleEvents": {"decision": "A", "total": 0, "ruleEvents": []}}, "errors": [], "warnings": []}, "response_id": "fe720d8b62bf2e6a3174f9a9bf2d4b1a"}

For more information about the fields in the request or response, please see
the API Documentation for the Version you are interested in.

