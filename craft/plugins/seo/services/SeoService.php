<?php

/**
 * Craft Seo
 *
 * @package     Craft Seo
 * @version     Version 0.9
 * @author      Benjamin David
 * @copyright   Copyright (c) 2013 - DUKT
 * @link        http://dukt.net/add-ons/craft/seo/
 *
 */

namespace Craft;

require_once(CRAFT_PLUGINS_PATH.'seo/vendor/autoload.php');

use ReflectionClass;
use Symfony\Component\Finder\Finder;

class SeoService extends BaseApplicationComponent
{
    protected $serviceRecord;

    public function __construct($serviceRecord = null)
    {
        $this->serviceRecord = $serviceRecord;
        if (is_null($this->serviceRecord)) {
            $this->serviceRecord = Seo_ServiceRecord::model();
        }
    }

    public function getSitesOptions()
    {
        $options = array();

        $provider = $this->getProvider();

        if($provider)
        {

            $sites = $provider->getSites();

            if($sites)
            {
                foreach($sites as $site)
                {
                    $options[] = array(
                            'label' => $site['title']['$t'],
                            'value' => $site['title']['$t']
                        );
                }
            }

        }

        return $options;
    }

    public function outputToken($providerClass)
    {
        $provider = $this->getServiceByProviderClass($providerClass);

        die('output token');

        $service = $this->service($provider->id);

        return $service->getUserInfo();
    }

    public function getProvider()
    {
        $providerClass = "Google";


        // get the option

        $record = Seo_ServiceRecord::model()->find('providerClass=:providerClass', array(':providerClass' => $providerClass));

        if (!$record) {
            $record = new Seo_ServiceRecord;
            $record->providerClass = $providerClass;
            $record->save();
        }

        if ($record->clientId && $record->clientSecret && $record->id) {
            // Retrieve token

            $token = unserialize(base64_decode($record->token));

            if(!$token)
            {
                return null;
            }

            // Create the OAuth provider

            $params = array(
                'id' => $record->clientId,
                'secret' => $record->clientSecret,
                'redirect_url' => \Craft\UrlHelper::getActionUrl('seo/settings/serviceCallback')
            );

            $provider = new \Dukt\Seo\Google\Provider($params);

            // refresh ?

            if(isset($token->expires))
            {
                if(!empty($token->expires))
                {
                    // check if token still valid

                    $expires = $token->expires - time();

                    if($expires > 60)
                    {
                        // if valid, don't refresh
                    }
                    else
                    {
                        // if not valid, refresh once (and if it still crashes reset the token ?)

                        if(method_exists($provider, 'access'))
                        {
                            $accessToken = $provider->access($token->refresh_token, array('grant_type' => 'refresh_token'));


                            // save token

                            $token->access_token = $accessToken->access_token;
                            $token->expires = $accessToken->expires;

                            $serializedToken = base64_encode(serialize($token));

                            $record->token = $serializedToken;

                            $record->save();
                        }
                    }
                }
            }

            $provider->setToken($token);

            return $provider;
        }

        return null;
    }

    public function getServiceByProviderClass($providerClass)
    {

        // get the option

        $record = Seo_ServiceRecord::model()->find('providerClass=:providerClass', array(':providerClass' => $providerClass));

        if ($record) {

            return Seo_ServiceModel::populateModel($record);
        }

        return new Seo_ServiceModel();
    }

    public function saveService(Seo_ServiceModel &$model)
    {
        $class = $model->getAttribute('providerClass');

        if (null === ($record = Seo_ServiceRecord::model()->find('providerClass=:providerClass', array(':providerClass' => $class)))) {
            $record = $this->serviceRecord->create();
        }



        $record->setAttributes($model->getAttributes());

        if ($record->save()) {

            // update id on model (for new records)

            $model->setAttribute('id', $record->getAttribute('id'));

            // Connect Service

           $this->connectService($record);

            return true;
        } else {
            $model->addErrors($record->getErrors());

            return false;
        }
    }


    public function newService($attributes = array())
    {
        $model = new Seo_ServiceModel();

        $model->setAttributes($attributes);

        return $model;
    }


    public function connectService($record = false)
    {
        if(!$record)
        {
            // $serviceId = craft()->request->getParam('id');

            // $record = $this->serviceRecord->findByPk($serviceId);

            $providerClass = "Google";

            $record = Seo_ServiceRecord::model()->find('providerClass=:providerClass', array(':providerClass' => $providerClass));
        }


        $className = $record->providerClass;

        $params = array(
            'id' => $record->clientId,
            'secret' => $record->clientSecret,
            'redirect_url' => \Craft\UrlHelper::getActionUrl('seo/settings/serviceCallback')
        );

        $provider = new \Dukt\Seo\Google\Provider($params);


        $provider = $provider->process(function($url, $token = null) {

            if ($token) {
                $_SESSION['token'] = base64_encode(serialize($token));
            }

            header("Location: {$url}");

            exit;

        }, function() {
            return unserialize(base64_decode($_SESSION['token']));
        });


        $token = $provider->token();

        $record->token = base64_encode(serialize($token));

        $record->save();


        craft()->request->redirect(UrlHelper::getUrl('seo/settings'));

    }

    public function service($id)
    {

        $service = $this->serviceRecord->findByPk($id);


        $providerParams = array();
        $providerParams['id'] = $service->clientId;
        $providerParams['secret'] = $service->clientSecret;
        $providerParams['redirect_url'] = "http://google.fr";

        try {
            $provider = \OAuth\OAuth::provider($service->providerClass, $providerParams);

            $token = unserialize(base64_decode($service->token));

            // refresh token if needed ?

            if(!$token)
            {
                throw new \Exception('Invalid Token');
            }

            $provider->setToken($token);

        } catch(\Exception $e)
        {
            throw new Exception('Provider couln\'t instantiate : '.$e->getMessage());
        }

        // $serviceClassName = 'Dukt\\Connect\\'.$service->providerClass.'\\Service';

        // $serviceObject = new $serviceClassName($provider);

        $serviceObject = $provider;

        return $serviceObject;
    }

    public function serviceSend($serviceId, $method, $params = array())
    {
        $service = $this->serviceRecord->findByPk($serviceId);


        $providerParams = array();
        $providerParams['id'] = $service->clientId;
        $providerParams['secret'] = $service->clientSecret;
        $providerParams['redirect_url'] = "http://google.fr";

        try {
            $provider = \OAuth\OAuth::provider($service->className, $providerParams);

            $token = unserialize(base64_decode($service->token));

            // refresh token if needed ?

            if(!$token)
            {
                throw new \Exception('Invalid Token');
            }

            $provider->setToken($token);

        } catch(\Exception $e)
        {
            throw new Exception('Provider couln\'t instantiate');
        }

        $serviceClassName = 'Dukt\\Campaigns\\Services\\'.$service->className;

        $request = new $serviceClassName($provider);

        return $request->send($method, $params);

        //return $request;
    }

    public function getProviders()
    {
        $directory = CRAFT_PLUGINS_PATH.'seo/libraries/Dukt/Seo/';

        $result = array();

        $finder = new Finder();

        $files = $finder->directories()->depth(0)->in($directory);

        foreach($files as $file)
        {
            $class = $file->getRelativePathName();

            //$class = substr($class, 0, -4);

            switch($class)
            {
                case "Common":

                break;

                default:
                $result[$class] = $class;
            }
        }

        return $result;

    }

    public function getAllServices()
    {
        $records = $this->serviceRecord->findAll(array('order'=>'t.title'));

        return Seo_ServiceModel::populateModels($records, 'id');
    }

    public function getServiceById($id)
    {
        if ($record = $this->serviceRecord->findByPk($id)) {

            return Seo_ServiceModel::populateModel($record);
        }
    }


    public function deleteServiceById($id)
    {
        return $this->serviceRecord->deleteByPk($id);
    }

    public function resetServiceToken($serviceId)
    {
        //$providerClass = craft()->request->getParam('providerClass');

        $record = Seo_ServiceRecord::model()->findByPk($serviceId);

        if($record)
        {
            $record->token = NULL;
            return $record->save();
        }

        return false;
    }

}

