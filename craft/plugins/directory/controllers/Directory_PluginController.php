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

require_once(CRAFT_PLUGINS_PATH.'directory/vendor/autoload.php');

use VIPSoft\Unzip\Unzip;

use Symfony\Component\Filesystem\Filesystem;



class Directory_PluginController extends BaseController
{
    public function actionDownload()
    {
        $filesystem = new Filesystem();
        $unzipper  = new Unzip();

        $plugins = craft()->directory->plugins();
        $key = craft()->request->getParam('key');

        if(isset($plugins[$key]))
        {
            $plugin = $plugins[$key];

            $className = $plugin->class;

            $pluginComponent = craft()->plugins->getPlugin($className, false);

            // download & unzip

            // is github or zip ?

            if(isset($plugin->zip)){
                $pluginZipUrl = $plugin->zip;
            } elseif(isset($plugin->githubUser) && isset($plugin->githubRepo))
            {
                $pluginZipUrl = "https://github.com/".$plugin->githubUser."/".$plugin->githubRepo."/archive/master.zip";
            }

            // plugin path

            $pluginPath = "";

            if(isset($plugin->path))
            {
                $pluginPath = $plugin->path;
            }


            $pluginZipDir = CRAFT_PLUGINS_PATH."_".$plugin->handle."/";
            $pluginZipPath = CRAFT_PLUGINS_PATH."_".$plugin->handle.".zip";

            try {
                // download

                $current = file_get_contents($pluginZipUrl);

                file_put_contents($pluginZipPath, $current);


                // unzip

                $content = $unzipper->extract($pluginZipPath, $pluginZipDir);

                $filesystem->rename($pluginZipDir.$content[0].'/'.$pluginPath, CRAFT_PLUGINS_PATH.$plugin->handle);
            }
            catch(\Exception $e)
            {

            }

            try {
                // remove download files

                $filesystem->remove($pluginZipDir);
                $filesystem->remove($pluginZipPath);
            }
            catch(\Exception $e)
            {

            }

            // redirect to install

            $redirect = UrlHelper::getActionUrl('directory/plugin/install', array('key' => $key));

            $this->redirect($redirect);


            // // install the plugin

            // // refresh plugin component

            // $pluginComponent = craft()->plugins->getPlugin($className, false);

            // if($pluginComponent)
            // {

            //     if (craft()->plugins->installPlugin($className))
            //     {
            //         craft()->userSession->setNotice(Craft::t('Plugin installed.'));
            //     }
            //     else
            //     {
            //         craft()->userSession->setError(Craft::t('Couldn’t install plugin.'));
            //     }

            //     $this->redirect('directory');
            // }
        }
        else
        {
            $this->redirect('directory');
        }
    }

    public function actionInstall()
    {
        $plugins = craft()->directory->plugins();

        $key = craft()->request->getParam('key');

        if(isset($plugins[$key]))
        {
            $plugin = $plugins[$key];

            $pluginComponent = craft()->plugins->getPlugin($plugin->class, false);



            if (craft()->plugins->installPlugin($plugin->class))
            {
                craft()->userSession->setNotice(Craft::t('Plugin installed.'));
            }
            else
            {
                craft()->userSession->setError(Craft::t('Couldn’t install plugin.'));
            }
        }
        else
        {

        }

        $this->redirect('directory');
    }


    public function actionUninstall()
    {
        $plugins = craft()->directory->plugins();

        $key = craft()->request->getParam('key');

        if(isset($plugins[$key]))
        {
            $plugin = $plugins[$key];

            $pluginComponent = craft()->plugins->getPlugin($plugin->class);

            if (craft()->plugins->uninstallPlugin($plugin->class))
            {
                craft()->userSession->setNotice(Craft::t('Plugin uninstalled.'));
            }
            else
            {
                craft()->userSession->setError(Craft::t('Couldn’t uninstall plugin.'));
            }
        }
        else
        {

        }

        $this->redirect('directory');
    }
}