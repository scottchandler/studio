"use strict";angular.module("localization",[]).factory("localize",["$http","$rootScope","$window","$filter",function(e,t,n,r){var i={language:Dukt_videos.language,dictionary:[],resourceFileLoaded:!1,successCallback:function(e){i.dictionary=e;i.resourceFileLoaded=!0;t.$broadcast("localizeResourcesUpdates")},initLocalizedResources:function(){var t=DuktVideosCms.getResourceUrl("lib/videos/angular/i18n/"+i.language+".js");e({method:"GET",url:t,cache:!1}).success(i.successCallback).error(function(){var t=DuktVideosCms.getResourceUrl("lib/videos/angular/i18n/en-US.js");e({method:"GET",url:t,cache:!1}).success(i.successCallback)})},getLocalizedString:function(e){var t="";if(!i.resourceFileLoaded){i.initLocalizedResources();i.resourceFileLoaded=!0;return t}if(i.dictionary!==[]&&i.dictionary.length>0){var n=r("filter")(i.dictionary,{key:e})[0];n!==null&&n!=undefined&&(t=n.value)}return t}};return i}]).filter("i18n",["localize",function(e){return function(t){return e.getLocalizedString(t)}}]);