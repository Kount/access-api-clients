<?php
/**
 * This is a SIMPLE reference implementation of how to use the three API calls
 * from the kount_access_service.php class.
 * @copyright 2015 Kount, Inc. All Rights Reserved.
 */
require_once('./kount_access_service.php');

/**
 * The Kount_Access_Service can be set up once and then used multiple times
 * concurrently as needed. In this example we are creating it once and
 * passing it into all the example functions.  If you are just implementing 1
 * function, you can use this part and the function together. This just
 * makes the sample easier to manage as your credentials and servername are
 * in a single location.
 */
$main = function ($argc, $argv) {
    ///////////////////////////////////////////////////////////////////////////
    // Merchant information - replace with your own
    ///////////////////////////////////////////////////////////////////////////
    $merchant_id = 100100;
    $api_key = 'PUT_YOUR_API_KEY_HERE';

    ///////////////////////////////////////////////////////////////////////////
    // Kount Access API server to use
    ///////////////////////////////////////////////////////////////////////////
    $server = 'api-sandbox02.kountaccess.com';

    ///////////////////////////////////////////////////////////////////////////
    // Sample Data Section (update with data used in your testing)
    ///////////////////////////////////////////////////////////////////////////
    // Sample session ID (previously created by the server and passed to the
    // data collector when it ran on the login page)
    $session_id = '8f18a81cfb6e3179ece7138ac81019aa';

    // Users credentials used to login for the test
    $user = 'admin';
    $password ='password';

    ///////////////////////////////////////////////////////////////////////////
    // Now let's call each example and evaluate
    ///////////////////////////////////////////////////////////////////////////

    // Create an instance of the service
    $kount_access = new Kount_Access_Service($merchant_id, $api_key, $server);

    ///////////////////////////////////////////////////////////////////////////
    // If you are just looking for information about the device (like the
    // device id, or pierced IP Address) then use the get_device function.
    // This example shows how to get Device info and what it would look like as
    // an associative array
    ///////////////////////////////////////////////////////////////////////////
    echo "Example for calling kount_access->get_device('$session_id')\n";
    $response = $kount_access->get_device($session_id);
    evaluate_response($response);
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // If you make a bad request you will get an array abck with an ERROR_CODE
    // and ERROR_MESSAGE in it. This could be cURL related (Networking
    // issues?) or data releated (bad api key, invalid session_id, etc).
    // This example shows what a bad request's response would look like as
    // an associative array
    ///////////////////////////////////////////////////////////////////////////
    echo "Example for calling kount_access->get_device('BAD_SESSION_ID') with a bad session_id \n";
    $response = $kount_access->get_device('BAD_SESSION_ID');
    evaluate_response($response);
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // This is an example of the type of response to expect when requesting
    // Velocity information. The Device information is also included in this
    // response. You can use this Velocity information in your own decisioning
    // engine.
    ///////////////////////////////////////////////////////////////////////////
    echo "Example calling kount_access->get_velocity('$session_id', '$user', '$password')\n";
    $response = $kount_access->get_velocity($session_id, $user, $password);
    evaluate_response($response);
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // If you want Kount Access to evaluate possible threats using our
    // Thresholds Engine, you will want to call the get_decision endpoint.
    // This example shows how to make the decision call and what it would look
    // like as an associative array. This response includes Device information
    // and Velocity data in addition to the Decision information. The decision
    // value can be either "A" - Approve, or "D" - Decline.  In addition it will
    // show the ruleEvents evaluated that forced a "D" (Decline) result. If you
    // do not have any thresholds established it will always default to
    // "A" (Approve). For more information on setting up thresholds, consult the
    // User Guide.
    ///////////////////////////////////////////////////////////////////////////
    echo "Example calling kount_access->get_decision('$session_id', '$user', '$password')\n";
    $response = $kount_access->get_decision($session_id, $user, $password);
    evaluate_response($response);
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // If you want to know about a different version of the endpoints or what
    // the data within the json responses mean, you can call the help
    // functions in the service. The following three examples print out the
    // HTML help content from the server based on the version passed in.
    ///////////////////////////////////////////////////////////////////////////
    echo "Example of decision help: kount_access->get_decision_help()\n";
    print_help($kount_access->get_decision_help());
    wait_on_user();

    echo "Example of decision help: kount_access->get_device_help()\n";
    print_help($kount_access->get_device_help());
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // If you want to see a different versioni's help, then specify the version
    // in the input of the function
    ///////////////////////////////////////////////////////////////////////////
    echo "Example of passing a different version into help: kount_access->get_device_help('0103')\n";
    print_help($kount_access->get_velocity_help("0103"));
    wait_on_user();

    ///////////////////////////////////////////////////////////////////////////
    // If you specify an invalid version you will get a 400 server error
    ///////////////////////////////////////////////////////////////////////////
    echo "Example of passing a bad version into help: kount_access->get_device_help('ver 1.0')\n";
    evaluate_response($kount_access->get_device_help("ver 1.0"));
};

function print_help ($response) {
    if (is_array($response)) {
        evaluate_response($response);
    } else {
        echo "//////////////START RESPONSE//////////////////////\n";
        echo $response;
        echo "////////////////END RESPONSE//////////////////////\n";
    }
}

/**
 * Simple evaluator that either prints the errors, or the assoiative array
 * result
 */
function evaluate_response ($response) {
    echo "//////////////START RESPONSE//////////////////////\n";
    // Check for an error
    if ($response['ERROR_CODE']) {
        // Handle the Error. The two keys in the error array are ERROR_CODE and
        // ERROR_MESSAGE
        echo "Error code [" . $response['ERROR_CODE'] . "] returned with message [" .
          $response['ERROR_MESSAGE'] . "]\n";
    } else {
        // do something with the response
        echo "Got a response:";
        var_dump($response);
    }
    echo "///////////////END RESPONSE///////////////////////\n";
}

function wait_on_user () {
    echo "Press enter to continue\n";
    $handle = fopen ("php://stdin","r");
    $line = fgets($handle);
}

// kickoff main
$main($argc, $argv);
