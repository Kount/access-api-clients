# Kount Access PHP API Library

## Overview

This library allows you to connect to the Kount Access API services and get information back from your login transactions. In order to use this library you will need:

*  A Merchant ID provided by Kount
*  An API Key generated for Kount Access
*  The Session ID used by the Data Collector
*  Login Information used by the user (login/password)

Usage
-----
In order to use the API service to evaluate your transaction, you will need to
have the Data Collecter already setup and installed in your login page.  Once
this has been done, and you have access to the information on the login page
you can make API service calls via this library to evaluate the login attempt.

Download the GIT repo, or at a minimum the lib/kount_access_service.php file.


First include the api library service in your php  application:

    require_once('./kount_access_service.php');

Ensure you have the information needed to instantiate the library in your app.

*  **merchantId** - The merchant ID provided to you from Kount.
*  **apiKey** - the API key you generated from kount (or was provided to you)
*  **serverName** - The DNS name of the server you want to connect to. These are
     also provided by merchant services.  You should have one server assigned
     for testing and one for production.
*  **version** - THE version of the API to access (defaults to the current
     version "0200").  The version is in the form of a 4 digit string

In your application it should look something like this:

    //Replace with your merchant Id
    $merchant_id = 123456
    $api_key = 'YOUR-API-KEY-GOES-HERE'
    $server_name = 'someserver.kountaccess.com'
    $version = '0200' //Optional, if ommitted it defaults to '0200'

Then create an instance of the Library interface:

    $kount_access = new Kount_Access_Service($merchant_id, $api_key, $server_name, $version);

###get_device

If you are just looking for information about the device (like the
device id, or pierced IP Address) The use the getDevice() function.
This example shows how to get device info and what it would look like as
a json array

Available since API version: **0103**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.

Code example:

    response = $kount_access->get_device($session_id);

Sample Response:

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

###get_velocity
if you want to know about the velocity of your users or devices as it pertains
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

Available since version: **0103**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.
*  **userHash** - This is a hashed value of the username used for login
*  **passwordHash** - This is a hashed value of the password used for login.

Code example:

    response = $kount_access->get_velocity($session_id, $user_hash, $password_hash);

Sample Response:

    {"device": {"mobile": 0, "country": "US", "region": "ID", "ipGeo": "US", "proxy": 0, "ipAddress": "64.128.91.251", "id": "0cbf8913c671cb0f736c5636d2a4be28"}, "velocity": {"device": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "iplh": 1, "iplm": 1, "plh": 1}, "account": {"ulh": 1, "iplh": 1, "iplm": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "password": {"iplh": 1, "ulh": 1, "alm": 1, "iplm": 1, "alh": 1, "ulm": 1, "dlh": 1, "dlm": 1}, "ip_address": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "user": {"iplh": 1, "alm": 1, "iplm": 1, "alh": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}}, "response_id": "0a8f7366a2e50956fc4dee0220ad9ab0"}

For more information about the fields in the request or response, please see
the API Documentation for the Version you are interested in.

###get_decision
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

Available since version: **0200**

Required Fields:

*  **sessionId** - This is a value passed to the Kount Access' Data Collector on your
     login page.
*  **userHash** - This is a hashed value of the username used for login
*  **passwordHash** - This is a hashed value of the password used for login.

Code example:

    response = $kount_access->get_decision($session_id, $user_hash, $password_hash);

Sample Response:

    {"device": {"mobile": 0, "country": "US", "region": "ID", "ipGeo": "US", "proxy": 0, "ipAddress": "64.128.91.251", "id": "0cbf8913c671cb0f736c5636d2a4be28"}, "velocity": {"device": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "iplh": 1, "iplm": 1, "plh": 1}, "account": {"ulh": 1, "iplh": 1, "iplm": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "password": {"iplh": 1, "ulh": 1, "alm": 1, "iplm": 1, "alh": 1, "ulm": 1, "dlh": 1, "dlm": 1}, "ip_address": {"ulh": 1, "alm": 1, "alh": 1, "ulm": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}, "user": {"iplh": 1, "alm": 1, "iplm": 1, "alh": 1, "plm": 1, "dlh": 1, "dlm": 1, "plh": 1}}, "decision": {"reply": {"ruleEvents": {"decision": "A", "total": 0, "ruleEvents": []}}, "errors": [], "warnings": []}, "response_id": "fe720d8b62bf2e6a3174f9a9bf2d4b1a"}

For more information about the fields in the request or response, please see
the API Documentation for the Version you are interested in.

## Other Examples

See the examples/reference_implementation.php file for examples on how to implement and use the features of kount_access_service.php
There is also additional information in kount_access_service.php for usage beyond the reference implementation examples.

Ensure you upate the input data in the reference implementation PRIOR to running it, or you may not get the desired results.

For more informaiton, please consult the Guides furnished by Kount or contact Merchant Services.

