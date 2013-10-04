<?php

/**
 * Craft Directory
 *
 * @package     Directory
 * @version     Version 0.9.3
 * @author      Benjamin David
 * @copyright   Copyright (c) 2013 - DUKT
 * @link        http://dukt.net/add-ons/craft/analytics/
 *
 */

namespace Craft;

class DirectoryVariable
{
    public function plugins()
    {
        return craft()->directory->plugins();
    }
}