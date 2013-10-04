/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */


function ServicesListCtrl($scope, $routeParams, $http, $rootScope, $location, $route, VideosService)
{
	// console.log('controller', $routeParams.serviceKey, $routeParams.methodName);

	// --------------------------------------------------------------------

    // main ready, init once

    if($('.dkv-main').length > 0 && VideosService.appLoaded == false) {

        // dkvideos.modal.resize();



        $scope.$on('$viewContentLoaded', function ($event, current) {
            var spinOpts1 = {
              lines: 9, // The number of lines to draw
              length: 3, // The length of each line
              width: 2, // The line thickness
              radius: 4, // The radius of the inner circle
              corners: 1, // Corner roundness (0..1)
              rotate: 0, // The rotation offset
              direction: 1, // 1: clockwise, -1: counterclockwise
              color: '#000', // #rgb or #rrggbb
              speed: 2, // Rounds per second
              trail: 60, // Afterglow percentage
              shadow: false, // Whether to render a shadow
              hwaccel: false, // Whether to use hardware acceleration
              className: 'dkv-spin1', // The CSS class to assign to the spinner
              zIndex: 2000, // The z-index (defaults to 2000000000)
              top: 0, // Top position relative to parent in px
              left: 0 // Left position relative to parent in px
            };

            $('.dkv-reload .dkv-spin').spin(spinOpts1);
        });

        VideosService.appLoaded = true;

        setTimeout(function() {
            $('.dkv-empty').css('display', 'block');
            dkvideos.modal.resize();
        }, 10);

    }

    // console.log('appLoaded', VideosService.appLoaded);

    $scope.$on('$viewContentLoaded', function ($event, current) {


        // dkvideos.modal.resize(function() {
        //     $('.dkv-empty').css('display', 'block');
        // });

        //console.log($('.dkv-main').outerHeight());

        // if($('.dkv-main').outerWidth() > 0) {
        //     if(typeof($rootScope.videos) == "undefined") {
        //          $('.dkv-main .dkv-empty').css('display', 'block');
        //     } else {
        //         if($rootScope.videos.length == 0) {
        //             $('.dkv-main .dkv-empty').css('display', 'block');
        //         }
        //     }
        // }

        //console.log('zzzzz', $('.dkv-main').outerWidth());


    });


	if(typeof($routeParams.serviceKey) !== "undefined" && typeof($routeParams.methodName) !== "undefined")
	{
		var opts = {
			providerClass : $routeParams.serviceKey,
			method : $routeParams.methodName,
			page:1,
			perPage:Dukt_videos.pagination_per_page
		};

		if($routeParams.methodName != 'search') {
			performRequest(opts, function(data) {

                $rootScope.videos = data;

                if($('.dkv-main .dkv-content').length > 0) {
                    $('.dkv-main .dkv-content').scrollTop(0);
                }
            });
		}
	}


    $('.dkv-modal .dkv-submit').addClass('dkv-disabled');

	// --------------------------------------------------------------------

    $scope.reload = function()
    {
        $route.reload();
    }

    // --------------------------------------------------------------------

	$scope.favorite = function()
	{
        currentVideo = $scope.selected;

        if(!$scope.isFavorite) {
            method = 'favoriteAdd';
            $scope.isFavorite = true;
        } else {
            method = 'favoriteRemove';
            $scope.isFavorite = false;
        }

        $http({method: 'POST', url: DuktVideosCms.getActionUrl(method, {id:currentVideo.id, providerClass: $routeParams.serviceKey})}).
            success(function(data, status, headers, config) {

            }).
            error(function(data, status, headers, config) {
              // console.log('--error', data, status, headers, config);
            });
	}

	// --------------------------------------------------------------------

	$scope.moreVideos = function()
	{
        if(!VideosService.videoMore.isLoading()) {

            //console.log('more videos');
            VideosService.videoMore.loadingOn();

    		var offset = $rootScope.videos.length;

    		// VideosService.videoMore.off();

    		perPage = Dukt_videos.pagination_per_page;
    		page = Math.floor(offset / perPage) + 1;

    		var opts = {
    			method: $routeParams.methodName,
    			providerClass: $routeParams.serviceKey,
    			searchQuery: VideosService.searchQuery,
    			page:page,
    			perPage:perPage
    		};

    		performRequest(opts, function(data) {
    			$.merge($rootScope.videos, data);

                VideosService.videoMore.loadingOff();
    		});
        }
	}

	// --------------------------------------------------------------------

    // select a video

    $scope.select = function(video)
    {
        $scope.selected = dkvideos.currentVideo = video;

        $('.dkv-modal .dkv-submit').removeClass('dkv-disabled');
    }

    // --------------------------------------------------------------------

	// play a video

	$scope.play = function(video)
	{
        $('.dkv-favorite').css('display', 'none');

		// show preview modal

		//videos.preview.show();

        serviceLibrary = $rootScope.services[$routeParams.serviceKey];

        $scope.isFavorite = false;

		dkvideos.player.play(video);

        VideosService.loader.on();

		$http({method: 'POST', url: DuktVideosCms.getActionUrl('embed', {videoUrl:video.url, providerClass: $routeParams.serviceKey})}).
        success(function(data, status, headers, config) {

            $('.dkv-favorite').css('display', 'block');

        	// console.log('--success', data);

        	$('.dkv-player .dkv-embed').html(data.embed);

            var favoritable = false;

            if(serviceLibrary.supportsOwnVideoLike) {
                favoritable = true;
            } else {
                if(data.video.authorId == serviceLibrary.userInfos.id) {
                    favoritable = false;
                } else{
                    favoritable = true;
                }
            }

            if(favoritable) {
            	if(data.isFavorite) {
                    $scope.isFavorite = true;
            	} else {
                    $scope.isFavorite = false;
            	}
            } else {
                // hide favorite button
                $('.dkv-favorite').css('display', 'none');
            }

            VideosService.loader.off();
        }).
        error(function(data, status, headers, config) {
          // console.log('--error', data, status, headers, config);
        });

		// console.log('play video', video.id);
	}

    // --------------------------------------------------------------------

    // is video selected

    $scope.isFavorite = false;

    // --------------------------------------------------------------------

    // is video selected

    $scope.isSelected = function(video) {
        return $scope.selected === video;
    }

	// --------------------------------------------------------------------

	// perform AJAX request

	function performRequest(opts, callback)
	{
		if(typeof($routeParams.playlistId) !== "undefined")
		{
			opts.playlistId = $routeParams.playlistId;
		}

		VideosService.loader.on();

		$http({method: 'POST', url: DuktVideosCms.getActionUrl(opts.method, opts)}).
			success(function(data, status, headers, config)
			{
				// console.log('ajax/'+opts.method+' : success');

                // dkvideos.modal.resize();
			}).
			error(function(data, status, headers, config)
			{
				// console.log('ajax/'+opts.method+' : error', data, status, headers, config);
			}).then(function(a, b, c) {
	        	// console.log('ajax/'+opts.method+' : then');




	        	if(typeof(callback) == "function") {
	        		callback(a.data);
	        	} else {
	        		$rootScope.videos = a.data;
	        	}

                dkvideos.scroll.init();


                setTimeout(function() {
                    dkvideos.modal.resize();
                }, 10);




                if(a.data.length < Dukt_videos.pagination_per_page) {
                    VideosService.videoMore.off();
                } else {
                    VideosService.videoMore.on();
                }

                if(a.data.length > 0) {
                    $('.dkv-main .dkv-empty').css('display', 'none');
                    $('.dkv-main .dkv-videos').css('display', 'block');
                } else {
                    $('.dkv-main .dkv-empty').css('display', 'block');
                    $('.dkv-main .dkv-videos').css('display', 'none');
                }

                VideosService.loader.off();
	    });
	}
}
