/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */

'use strict';

// App module

var videos = angular.module('videos', ['localization']).

    // prevent scroll to top of page

    value('$anchorScroll', angular.noop).


    // config routes

    config(['$routeProvider', function($routeProvider, $locationProvider) {

        var emptyPartial = DuktVideosCms.getResourceUrl('lib/videos/angular/partials/empty.html');

        $routeProvider.
            when('/', {templateUrl: emptyPartial,   controller: ServicesListCtrl}).
            when('/:serviceKey', {templateUrl: emptyPartial, controller: ServicesListCtrl}).
            when('/:serviceKey/:methodName', {templateUrl: emptyPartial, controller: ServicesListCtrl}).
            when('/:serviceKey/:methodName/:playlistId', {templateUrl: emptyPartial, controller: ServicesListCtrl}).
            otherwise({redirectTo: '/'});
    }]);


// Angular Service

videos.factory("VideosService",function($rootScope, $http){

        var ret = {
            appLoaded:false,
            searchQuery: "",
            searchInProgress: false,
            currentService: false,
            currentMethod: false,
            services: false,
            loader: {
                on: function() {
                    // console.log('loader on');
                    $('.dkv-main .dkv-reload').addClass('dkv-loading');
                    $('.dkv-player .dkv-spinner').removeClass('dkv-hidden');
                },
                off: function() {
                    // console.log('loader off');
                    $('.dkv-main .dkv-reload').removeClass('dkv-loading');
                    $('.dkv-player .dkv-spinner').addClass('dkv-hidden');
                }
            },
            videoMore: {
                on: function() {
                    $('.dkv-video-more').css('display', 'block');
                },
                off: function() {
                    $('.dkv-video-more').css('display', 'none');
                },
                loadingOn: function() {
                    $('.dkv-video-more .dkv-btn').addClass('dkv-loading');
                },
                loadingOff: function() {
                    $('.dkv-video-more .dkv-btn').removeClass('dkv-loading');
                },
                isLoading: function() {
                    return $('.dkv-video-more .dkv-btn').hasClass('dkv-loading');
                }
            },
        };

        return ret;
});

videos.directive('clickAnywhereButHere', function($document){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        e.stopPropagation();
      });
      $document.bind('click', function() {
        scope.$apply(attr.clickAnywhereButHere);
      })
    }
  }
});

// Craft Videos App

videos.run(function($rootScope, $http, $location, $q, $routeParams, $timeout, VideosService) {

    // console.log('run', videos);

    // --------------------------------------------------------------------

    // initialize videos

    // --------------------------------------------------------------------






    // get services

    $http({method: 'POST', url: DuktVideosCms.getActionUrl('services')}).
        success(function(data, status, headers, config) {

            // console.log('services success');

            $('.dkv-modal').removeClass('dkv-loading');

            $rootScope.services = data;

            $.each($rootScope.services, function(k, s) {
                // console.log(k, s);

                $http({method: 'POST', url: DuktVideosCms.getActionUrl('userInfos', {providerClass:s.name})}).
                    success(function(data, status, headers, config) {
                        // console.log('account success', data);
                        $rootScope.services[s.name].userInfos = data;
                    }).
                    error(function(data, status, headers, config) {
                      // console.log('error', data, status, headers, config);
                    });
            });




            // no service ? display an error

            // console.log('number of services detected : ', $rootScope.services.length);

            if($rootScope.services.length == 0) {
                $rootScope.errorMessage = "Set up a video service";

                $('.dkv-modal .dkv-noServices').css('display', 'block');
                $('.dkv-modal .dkv-servicesListCtrl').css('display', 'none');

                return false;
            }


            // get playlists for this service

            $.each(data, function(k, el) {

                $http({method: 'POST', url: DuktVideosCms.getActionUrl('playlists', {providerClass:el.name})}).
                    success(function(data2, status2, headers2, config2) {
                        $rootScope.services[k].playlists = data2;

                        // dkvideos.modal.resize();
                    }).
                    error(function(data2, status2, headers2, config2) {
                        // console.log('error', data2, status2, headers2, config2);
                    });
            });


            // set the first service as current

            $.each($rootScope.services, function (k, el) {

                if($routeParams.serviceKey == k || typeof($routeParams.serviceKey) == "undefined") {

                    // define element as current service

                    $rootScope.currentService = el;


                    // break the each loop

                    return false;
                }

            });

            // console.log('currentService', $rootScope.currentService);
            // console.log('$routeParams.serviceKey', $routeParams.serviceKey);

            // update selected field

            $rootScope.serviceKey = $rootScope.currentService.name;

            // redirect if needed

            if($location.path() == "/" || $location.path() == "") {
                // console.log('redirect', $rootScope.serviceKey+"/uploads");

                $location.path($rootScope.serviceKey+"/favorites");
            }

        }).
        error(function(data, status, headers, config) {
          // console.log('error', data, status, headers, config);
        });

    // --------------------------------------------------------------------

    // service change

    $rootScope.serviceDropdown = function()
    {
        $('.dkv-sources').addClass('open');
    }

    $rootScope.serviceChange = function(serviceKey)
    {
        // console.log('serviceChange', this.serviceKey);

        // define current service

        $('.dkv-sources').removeClass('open');


        $rootScope.currentService = $rootScope.services[serviceKey];
        $rootScope.serviceKey = serviceKey;

        var methodName = $routeParams.methodName;

        if(methodName == "playlist") {
            methodName = "favorites";
        }

        // re-run rearch

        // $rootScope.search();


        // change route

        $location.path(serviceKey+"/"+methodName);

        $timeout(function() {
            if(methodName == "search") {
                doSearch();
            }
        }, 100);

        // if($rootScope.currentService.name == serviceKey) {

        // } else {

        // }
    }

    $rootScope.clickedSomewhereElse = function(){
        $('.dkv-sources').removeClass('open');
    };

    $rootScope.isSourceSelected = function(service) {
        // console.log('VideosService.currentService', $rootScope.currentService);
        // console.log('service', service);

        if($rootScope.currentService == service) {
            // $('')
            // var other = $(selector);
            // this.after(other.clone());
            // other.after(this).remove();

            return true;
        }

        return false;
    }

    // --------------------------------------------------------------------

    // service change

    $rootScope.getClass = function(path)
    {
        var pat = new RegExp("\/.*\/"+path);
        var match = $location.path().match(pat);

        if (match) {
            return "active";
        } else {
            return "";
        }
    };

    // --------------------------------------------------------------------

    // search field

    var searchTimer = false;

    $rootScope.search = function()
    {
        $('.dkv-search .dkv-press-enter').removeClass('dkv-hidden');

        //console.log('search change');
        var thisSearchQuery = this.searchQuery;

        $timeout(function() {
            if(thisSearchQuery != VideosService.searchQuery) {
                console.log('dont search because its different');
            } else {
                console.log('search now');
                doSearch();
            }
        }, 500);

        if(typeof(this.searchQuery) != "undefined") {
            VideosService.searchQuery = this.searchQuery;
        }

        if(VideosService.searchQuery != "") {
            $('.dkv-search .dkv-press-enter').removeClass('dkv-hidden');
        } else {
            $('.dkv-search .dkv-press-enter').addClass('dkv-hidden');
        }
    }

    function doSearch()
    {
        $('.dkv-search .dkv-press-enter').addClass('dkv-hidden');

        // redirect to search

        var pat = new RegExp("\/.*\/"+"search");
        var match = $location.path().match(pat);

        if (match) {

        } else {
            $location.path($routeParams.serviceKey+"/search");
        }

        var searchQuery = VideosService.searchQuery;

        if(searchQuery != "") {
            searchRequest($routeParams, searchQuery, VideosService);
        } else {
            //console.log('searchquerynull');

            $rootScope.$apply(function () {
                $rootScope.videos = [];

                $('.dkv-videos .dkv-video-more').css('display', 'none');
                $('.dkv-main .dkv-empty').css('display', 'block');

                setTimeout(function() {
                    dkvideos.modal.resize();
                }, 10);
            });
        }
    }

    function searchRequest($routeParams, searchQuery, VideosService)
    {
        var opts = {
          method:'search',
          providerClass:$routeParams.serviceKey,
          searchQuery: searchQuery,
          page: 1,
          perPage: Dukt_videos.pagination_per_page
        };

        VideosService.loader.on();

        $http({method: 'POST', url: DuktVideosCms.getActionUrl('search', opts), cache: true}).
          success(function(data, status, headers, config)
          {
                $rootScope.videos = data;

                dkvideos.scroll.init();

                setTimeout(function() {
                    dkvideos.modal.resize();
                }, 10);


                if(data.length < Dukt_videos.pagination_per_page) {
                    VideosService.videoMore.off();
                } else {
                    VideosService.videoMore.on();
                }

                if(data.length > 0) {
                    $('.dkv-main .dkv-empty').css('display', 'none');
                    $('.dkv-main .dkv-videos').css('display', 'block');
                } else {
                    $('.dkv-main .dkv-empty').css('display', 'block');
                    $('.dkv-main .dkv-videos').css('display', 'none');
                }

                VideosService.loader.off();
          }).
          error(function(data, status, headers, config)
          {
            // console.log('error', data, status, headers, config);
          });
    }


    // press enter triggers search

    $(document).on('keypress', '.dkv-search input', function(e) {
        if(e.keyCode == "13") {
            doSearch();
        }
    });
});


