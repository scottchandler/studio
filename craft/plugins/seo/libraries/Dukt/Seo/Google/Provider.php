<?php

namespace Dukt\Seo\Google;

class Provider extends \OAuth\Provider\Google
{

    public function __construct(array $options = array())
    {
        // Now make sure we have the default scope to get user data
        empty($options['scope']) and $options['scope'] = array(
            'https://www.google.com/webmasters/tools/feeds/'
        );

        // Array it if its string
        $options['scope'] = (array) $options['scope'];

        isset($options['access_type'])
            and $this->access_type = $options['access_type'];

        parent::__construct($options);
    }

    function getAccount()
    {
        $url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        $response = json_decode(file_get_contents($url), true);

        $account = new Account();
        $account->instantiate($response);

        return $account;

    }

    function getSites()
    {

        $params = array(
                'alt' => 'json',
                'access_token' => $this->token->access_token
            );

        $query = http_build_query($params);

        $response = $this->_curl_request(
                'https://www.google.com/webmasters/tools/feeds/sites/'
                , $params, 'get');

        if(isset($response['feed']['entry']))
        {
            return $response['feed']['entry'];
        }

        return null;
    }


    function getKeywords($site)
    {
        $site = urlencode($site);

        $params = array(
                'alt' => 'json',
                'access_token' => $this->token->access_token
            );

        $query = http_build_query($params);

        $response = $this->_curl_request(
                'https://www.google.com/webmasters/tools/feeds/'.$site.'/keywords/'
                , $params, 'get');

        if(isset($response['feed']['wt$keyword']))
        {
            return $response['feed']['wt$keyword'];
        }

        return null;
    }



    function getMessages($site)
    {
        $site = urlencode($site);

        $params = array(
                'alt' => 'json',
                'access_token' => $this->token->access_token
            );

        $query = http_build_query($params);

        $response = $this->_curl_request(
                'https://www.google.com/webmasters/tools/feeds/messages/'
                , $params, 'get');

        if(isset($response['feed']['entry']))
        {
            return $response['feed']['entry'];
        }

        return null;
    }



    function getCrawlIssues($site)
    {
        $site = urlencode($site);

        $params = array(
                'alt' => 'json',
                'access_token' => $this->token->access_token
            );

        $query = http_build_query($params);

        $response = $this->_curl_request(
                'https://www.google.com/webmasters/tools/feeds/'.$site.'/crawlissues/'
                , $params, 'get');


        if(isset($response['feed']['entry']))
        {
            return $response['feed']['entry'];
        }

        return null;
    }

    function getSitemaps($site)
    {
        $site = urlencode($site);

        $params = array(
                'alt' => 'json',
                'access_token' => $this->token->access_token
            );

        $query = http_build_query($params);

        $response = $this->_curl_request(
                'https://www.google.com/webmasters/tools/feeds/'.$site.'/sitemaps/'
                , $params, 'get');

        if(isset($response['feed']['entry']))
        {
            return $response['feed']['entry'];
        }

        return null;
    }


    function _curl_request($server, $query, $method = 'post')
    {
        $args = '';
        foreach ($query as $key => $value)
        {
            $args .= trim($key).'='.trim($value).'&';
        }
        $args = rtrim($args, '&');

        if($method == 'get')
        {
            $server .= '?'.$args;
        }

        $ch = curl_init($server);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        if($method == 'post')
        {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $args);
        }
        /*
            Some issues have been popping-up with IPv6 which I do not understand, as I am faking my way through this whole thing.
            Forcing an IPv4 connection seems to work. It will likely fuck up something else though.
        */
        if(defined('CURLOPT_IPRESOLVE') && defined('CURL_IPRESOLVE_V4'))
        {
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        }
        curl_setopt($ch, CURLOPT_REFERER, 'http://'.$_SERVER['SERVER_NAME']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        curl_close($ch);
        /*
            We pass a second argument of "true" to tell the native json_decode() function to return an array, not an object.
            This is because EE's bundled Services_JSON is hard-coded to return an array, so we have to be matchy.
        */
        return json_decode($response, true);
    }
}
