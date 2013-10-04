<?php

/**
 *  Craft Directory
 *
 * @package     Directory
 * @version     Version 0.9.3
 * @author      Benjamin David
 * @copyright   Copyright (c) 2013 - DUKT
 * @link        http://dukt.net/add-ons/craft/analytics/
 *
 */

namespace Craft;

class DirectoryService extends BaseApplicationComponent
{
    public function plugins()
    {
        $plugins = "https://raw.github.com/dukt/directory.craft/master/config/plugins.json";

        $plugins = file_get_contents($plugins);

        $plugins = (array) json_decode($plugins);

        return $plugins;
    }
}

