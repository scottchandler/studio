# Craft Directory

Find, download and install plugins for Craft

## Download

You can download Craft Directory's latest version at :

[http://dukt.net/add-ons/craft/directory](http://dukt.net/add-ons/craft/directory)

## Installation

All you need to do is unzip the downloaded file and move the `directory` folder to `craft/plugins`.

## Adding Your Plugin

You can contribute by adding you plugin to the list. All you have to do is add a row for you plugin in the [config/plugins.json](https://github.com/dukt/directory.craft/blob/master/config/plugins.json) file. The examples below will help you get started whether your plugin is hosted on GitHub or if it's a custom ZIP.

* Note that for the custom situation, only ZIP is supported for now, you can't GZIP or TGZIP yet.
* Please respect the mandatory fields.
* Try to be as exhaustive as possible by filling description, developer infos, etc.
* Please check that the JSON is valid. The little boy is pretty strict on double quotes and trailing commas. As long as you can display the plugin list in Craft Directory, it's valid.

### Your plugin is on GitHub

    {
        "handle":"cocktailrecipes", // required
        "class":"CocktailRecipes", // required
        "name":"Cocktail Recipes", // required
        "githubUser" : "adrianmacneil", // required
        "githubRepo" : "cocktailrecipes", // required
        "developer":"Adrian Macneil",
        "developerUrl":"http://adrianmacneil.com/",
        "description":"Example plugin for the Craft CMS Beta"
    }

### Your plugin is a custom ZIP

    {
        "handle":"duktvideos", // required
        "class":"DuktVideos", // required
        "name":"Dukt Videos", // required
        "zip": "http://cl.ly/2C2l360O2W1P/download/duktvideos-bd1e109.zip", // required
        "url":"http://dukt.net/add-ons/craft/videos",
        "developer":"Dukt",
        "developerUrl":"http://dukt.net/",
        "description":"Publish YouTube and Vimeo videos"
    }

## Using Craft Directory as an API

[Ben Parizek](https://twitter.com/BenParizek) has done a great job integrating a list of plug-ins on [Straight Up Craft](http://straightupcraft.com/craft-plugins) using Craft Directory as a source of data. If you want to do like him, you an simply `json_decode` the content of this url :

    https://raw.github.com/dukt/directory.craft/master/config/plugins.json

## Advanced : Installing from the GitHub repository

If you want to install the add-on from the GitHub repository, you'll have to use Composer in order to update dependencies :

    $ curl -s http://getcomposer.org/installer | php
    $ php composer.phar update

## Feedback

**Please provide feedback!** We want this plugin to make fit your needs as much as possible.
Please [get in touch](mailto:hello@dukt.net), and point out what you do and don't like. **No issue is too small.**

This plugin is actively maintained by [Benjamin David](https://github.com/benjamindavid), from [Dukt](http://dukt.net/).
