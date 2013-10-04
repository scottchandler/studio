<?php

/**
 * Craft Directory
 *
 * @package     Directory
 * @version     Version 0.9.3
 * @author      Benjamin David
 * @copyright   Copyright (c) 2013 - DUKT
 * @link        http://dukt.net/add-ons/craft/analytics/
 */

namespace Craft;

class DirectoryPlugin extends BasePlugin
{
    /**
     * Get Name
     */
    function getName()
    {
        return Craft::t('Directory');
    }

    // --------------------------------------------------------------------

    /**
     * Get Version
     */
    function getVersion()
    {
        return '0.9.3';
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
}