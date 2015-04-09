// Include the Kount Access Library file
var Kount = require('../lib/kount-access-api');
var prompt = require('prompt');

///////////////////////////////////////////////////////////////////////////
//Merchants information - replace with your own
///////////////////////////////////////////////////////////////////////////
var merchantId = 123456;
var apiKey = 'PUT_YOUR_KEY_HERE';

///////////////////////////////////////////////////////////////////////////
//Kount Access API server to use (provided from Kount)
///////////////////////////////////////////////////////////////////////////
var serverName = 'your_api.server.com';

///////////////////////////////////////////////////////////////////////////
// Sample Data Section (update with data used in your testing)
///////////////////////////////////////////////////////////////////////////
//Sample session ID (previously created by the server and passed to the
//data collector when it ran on the login page
var sessionId = '11db5c1caa8c80882551a1596a566130';

// Users credentials used to login for the test
var user = 'admin';
var password ='password';

///////////////////////////////////////////////////////////////////////////
// Now let's call each example and evaluate
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Create a new instance of the service passing in the following values:
//   merchant Id
//   API key
//   Server name
//   Version (optional) in the form of "0200" or null
///////////////////////////////////////////////////////////////////////////
var ka = new Kount(merchantId, apiKey, serverName);

///////////////////////////////////////////////////////////////////////////
//If you are just looking for information about the device (like the
//device id, or pierced IP Address) Then use the get_device function.
//This example shows how to get device info and what it would look like as
//a json array
// Available since version: 0103
///////////////////////////////////////////////////////////////////////////
function getDeviceExample() {
  console.log("Example for calling getDevice(sessionId)");
  ka.getDevice(sessionId, function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  })
} // end function getDeviceExample()

///////////////////////////////////////////////////////////////////////////
//If you make a bad request you will get an error in the callback. This 
//could be cURL related (Networking issues?) or data releated (bad api key,
//invalid session_id, etc). This example shows what an bad request's
//response would look like.
///////////////////////////////////////////////////////////////////////////
function badDataExample () {
  console.log("Example for calling getDevice('BAD_SESSION_ID') with a bad sessionId ");
  ka.getDevice('BAD_SESSION_ID', function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
} // end function badDataExample()

///////////////////////////////////////////////////////////////////////////
//This is an example of the type of response to expect when requesting
//velocity information.  The Device information is also included in this
//response.  You can use this velocity information in your own decisioning
//engine.
//
// Available since version: 0103
///////////////////////////////////////////////////////////////////////////
function getVelocityExample () {
  console.log("Example calling getVelocity(sessionId, userHash, passwordHash)");
  ka.getVelocity(sessionId, user, password, function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
} // end function getVelocityExample()

///////////////////////////////////////////////////////////////////////////
//If you want Kount Access to evaluate possible threats using our
//Thresholds Engine, you will want to call the getDecision endpoint.
//This example shows how to call the decision call and what it would look
//like as an associative array. This response includes device information
//and velocity data in addition to the decision information.  The decision
//value can be either "A" - Approve, or "D" - Decline.  In addition is wil
//show the ruleEvents evaluated that forces a "D"(Decline) result.  If you
//do not have any thresholds established it will always default to
//"A"(Approve). For more information on setting up thresholds, consult the
// User Guide.
//
// Available since version: 0200
///////////////////////////////////////////////////////////////////////////
function getDecisionExample () {
  console.log("Example calling getDecision(sessionId, userHash, passwordHash)");
  ka.getDecision(sessionId, user, password, function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
} // end function getDecisionExample()

/**
 * Shows how to get the help documentation for the /getDevice endpoint.
 * This example used the libraries defaultVersion value to choosed the version
 * rendered to the console.
 */
function getDeviceHelp () {
  console.log("Example to get the online /getDevice documentation for a particular version 0103");
  ka.getDeviceHelp("0103", function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
}

/**
 * Shows how to get the help documentation for the /getVelocity endpoint.
 * This example used the libraries defaultVersion value to choosed the version
 * rendered to the console.
 */
function getVelocityHelp () {
  console.log("Example to get the default versions online /getVelocity documentation");
  ka.getVelocityHelp(ka.defaultVersion, function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
}

/**
 * Shows how to get the help documentation for the /getVelocity endpoint.
 * This example used the libraries defaultVersion value to choosed the version
 * rendered to the console.
 */
function getDecisionHelp () {
  console.log("Example to get the default versions online /getDecision documentation");
  ka.getDecisionHelp(ka.defaultVersion, function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
}

/**
 * Shows what happens if you ask for a bad version for an endpoint help.
 */
function badVersionForGetDecisionHelp () {
  console.log("Example to get the default versions online /getDecision documentation");
  ka.getDecisionHelp("0103", function (err, data) {
    if (err !== null) {
      console.log("Error:" + err);
    } else {
      console.log(data);
    }
  });
}


///////////////////////////////////////////////////////////////////////////
// The rest of the code below is just to show the examples in the console
// They are seperated by a prompt so it's easier to see.
///////////////////////////////////////////////////////////////////////////
var counter = 0;

//List of examples to run
var examples = {
  '1': 'getDeviceExample()',
  '2': 'badDataExample()',
  '3': 'getVelocityExample()',
  '4': 'getDecisionExample()',
  '5': 'getDeviceHelp()',
  '6': 'getVelocityHelp()',
  '7': 'getDecisionHelp()',
  '8': 'badVersionForGetDecisionHelp()',
  '0': 'exit',
};


function nextExample() {

    if (merchantId == 123456) {
      console.log ("Unforunately, you must setup this reference implementation prior to running it. Please set the merchantId, apiKey, serverName, sessionId, user, and password at the top of the file before proceeding");
      return
    }
    console.log("Choose from the following list:");
    for (var key in examples) {
      console.log (key + ":" + examples[key]);
    }
    prompt.get("number", function(err, result) {
        if(err) {
          console.log("Error:" + err);
          return;
        }
        eval(examples[result.number]);
    });
}

function exit() {
  console.log("exiting");
}

// Start the example
prompt.start();
nextExample();
