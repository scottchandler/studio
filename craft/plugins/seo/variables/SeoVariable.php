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

class SeoVariable
{
    public function code($id)
    {
        return craft()->seo->code($id);
    }



    public function getSites()
    {
        return craft()->seo->getSites();
    }

    public function getSitesOptions()
    {
        return craft()->seo->getSitesOptions();
    }


    public function getProvider()
    {
        return craft()->seo->getProvider();
    }

    public function getProviders()
    {
        return craft()->seo->getProviders();
    }

    public function getServiceByProviderClass($providerClass)
    {
        return craft()->seo->getServiceByProviderClass($providerClass);
    }

    public function outputToken($providerClass)
    {
        return craft()->seo->outputToken($providerClass);
    }
}