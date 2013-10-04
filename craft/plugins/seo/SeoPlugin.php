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

class SeoPlugin extends BasePlugin
{
    /**
     * Get Name
     */
    function getName()
    {
        return Craft::t('SEO');
    }

    // --------------------------------------------------------------------

    /**
     * Get Version
     */
    function getVersion()
    {
        return '0.9';
    }

    // --------------------------------------------------------------------

    /**
     * Get Developer
     */
    function getDeveloper()
    {
        return 'Dukt';
    }

    // --------------------------------------------------------------------

    /**
     * Get Developer URL
     */
    function getDeveloperUrl()
    {
        return 'http://dukt.net/';
    }

    // --------------------------------------------------------------------

    /**
     * Has CP Section
     */
    public function hasCpSection()
    {
        return true;
    }


    public function hookRegisterCpRoutes()
    {
        return array(
            'seo\/settings\/(?P<serviceProviderClass>.*)' => 'seo/_settings',
        );
    }
}