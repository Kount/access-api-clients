<?php
/**
 * Service API access class.
 * This class provides helper functions to utilize the Kount Access API
 * service.  In order to use this service you will be required to furnish:
 *   * Your Merchant ID
 *   * Your API Key
 *   * The API server you want to connect to
 *   * Information related to the queries you wish to make, including:
 *       * Session Id
 *       * username
 *       * password
 *
 * See the reference_implementation.php for sample usage.
 *
 * @version 2.0.0
 * @copyright 2015 Kount, Inc. All Rights Reserved.
 */
class Kount_Access_Service {

    /**
     * Version number
     */
    private $__version;

    /**
     * Private Kount Access API servername
     */
    private $__server_name;

    /**
     * Options for curl call
     */
    private $__encoded_credentials;

    /**
     * Constructor
     *
     * @param int merchant_id The Merchant's ID
     * @param string api_key API key assigned to merchant
     * @param string server_name The DNS name for the Kount Access API Server
     * @param string version The version of the API to access (0200 is the
     *                       default for this release of the SDK)
     * @return this
     */
    public function __construct ($merchant_id, $api_key, $server_name, $version = '0200') {
        $this->__server_name = $server_name;
        $this->__encoded_credentials = base64_encode($merchant_id  . ":" . $api_key);
        $this->__version = $version;
    } //end __construct

    /**
     * Gets the information for the Device based on the Session ID.
     *
     * @param string $session_id The Session ID used by the Device
     * @return array from JSON object decoded with details about the Device.
     */
    public function get_device ($session_id) {
      $endpoint = "https://$this->__server_name/api/device?v=$this->__version&s=$session_id";
        return $this->__call_endpoint($endpoint, "GET", null);
    } //end get_device


    /**
     * Gets the Velocity information for the Device based on the Session ID,
     * User ID and Password. These values are re-hashed in case the client
     * passed them in the clear prior to sending them off to the api server.
     *
     * @param string $session_id The Session ID used by the Device
     * @param string $user_id The user's User ID
     * @param string $password The user's Password
     * @return array from JSON object decoded with details about the Device.
     */
    public function get_velocity ($session_id, $user_id, $password) {
        $endpoint = "https://$this->__server_name/api/velocity";
        $u = hash('sha256', $user_id);
        $p = hash('sha256', $password);
        $a = hash('sha256', $user_id . ":" . $password);
        $data = array (
            s  => $session_id,
            v  => $this->__version,
            uh => $u,
            ph => $p,
            ah => $a
          );

        return $this->__call_endpoint($endpoint, "POST", $data);
    } //end get_velocity

    /**
     * Gets the Decision, Device information, and Velocity information for
     * the Device based on the Session ID, User ID and passwords. These values
     * are re-hashed in case the client passed them in the clear prior to
     * sending them off to the api server.
     *
     * @param string $session_id The Session ID used by the Device
     * @param string $user_id The user's User ID
     * @param string $password The user's Password
     * @return array from JSON object decoded with details about the Device.
     */
    public function get_decision ($session_id, $user_id, $password) {
        $endpoint = "https://$this->__server_name/api/decision";
        $u = hash('sha256', $user_id);
        $p = hash('sha256', $password);
        $a = hash('sha256', $user_id . ":" . $password);
        $data = array (
            s => $session_id,
            v  => $this->__version,
            uh => $u,
            ph => $p,
            ah => $a
          );
        return $this->__call_endpoint($endpoint, "POST", $data);
    } //end get_decision

    /**
     * Gets Help information for the get_decision endpoint by version.
     *
     * @param string version Version to get help for (defaults to 0200)
     * @return string HTML Help information, or a JSON array with error information
     */
    public function get_decision_help ($version = '0200') {
        $version = urlencode($version);
        $endpoint = "https://$this->__server_name/api/decision";
        $data = array (
            v => $version,
            help => "true",
          );
        return $this->__call_endpoint($endpoint, 'POST', $data, true);
    }

    /**
     * Gets Help information for the get_device endpoint by version.
     *
     * @param string version Version to get help for (defaults to 0200)
     * @return string HTML Help information, or a JSON array with error information
     */
    public function get_device_help ($version = '0200') {
        $version = urlencode($version);
        $endpoint = "https://$this->__server_name/api/device?v=$version&help=true";
        return $this->__call_endpoint($endpoint, 'GET', null, true);
    }

    /**
     * Gets Help information for the get_device endpoint by version.
     *
     * @param string version Version to get help for (defaults to 0200)
     * @return string HTML help information, or a JSON array with error information
     */
    public function get_velocity_help ($version = '0200') {
        $version = urlencode($version);
        $endpoint = "https://$this->__server_name/api/velocity";
        $data = array (
            v => $version,
            help => "true",
          );
        return $this->__call_endpoint($endpoint, 'POST', $data, true);
    }

    /**
     * Call a service endpoint.
     *
     * @param string $endpoint URL to endpoint
     * @param string $method Either POST or GET
     * @param array $params POST parameters
     * @return array JSON Response decoded or error array with cURL's
     *               ERROR_CODE and ERROR_MESSAGE values
     */
    private function __call_endpoint ($endpoint, $method=null, $params=null, $help=null) {
        $options = array(
            CURLOPT_FAILONERROR       => false,
            CURLOPT_USERAGENT         =>
                'Mozilla/5.0 (compatible; Service_Client/$Revision: 22622 $;)',
            CURLOPT_COOKIESESSION     => true,
            CURLOPT_HTTPHEADER        => array(
                "Accept: text/json",
                "Authorization: Basic $this->__encoded_credentials",
              ),
            CURLOPT_CONNECTTIMEOUT    => 3, // 3 seconds
            CURLOPT_TIMEOUT           => 5, // 5 seconds
            CURLOPT_HEADER            => true,
            CURLOPT_RETURNTRANSFER    => true,
            CURLOPT_URL               => $endpoint,
          );
        if ("POST" == $method) {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = $params;
        } else {
            $options[CURLOPT_CUSTOMREQUEST] = $method;
        }

        // Create curl resource
        $ch = curl_init();
        //Set Curl options
        curl_setopt_array($ch, $options);
        // Execute the request
        $raw_resp = curl_exec($ch);

        //Parse the response
        $err_code = curl_errno($ch);
        $resp_body = "";

        if (CURLE_OK == $err_code) {
            // parse the raw response
            $info = curl_getinfo($ch);
            $resp_code = (int) $info['http_code'];
            $hdr_size = $info['header_size'];
            $msg = mb_substr($raw_resp, $hdr_size,
                mb_strlen($raw_resp, 'latin1'), 'latin1');
            if (200 != $resp_code) {
                $resp_body = array(
                    ERROR_CODE    => $resp_code,
                    ERROR_MESSAGE => $msg,
                  );
            } else {
                if ($help) {
                    $resp_body = $msg;
                } else {
                    $resp_body =  json_decode($msg, true);
                }
            }
        } else {
            $resp_body = array (
                ERROR_CODE    => $err_code,
                ERROR_MESSAGE => curl_error($ch),
              );
        }

        curl_close($ch);
        return $resp_body;
    } //end call_endpoint
} //end kount_access_api

