/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */

var dkvideos = {};

dkvideos.currentVideo = false;

// --------------------------------------------------------------------

// player

dkvideos.player = {
    _init: function() {
        // back to videos

        $('.dkv-modal').on('click', '.dkv-back', function() {

            dkvideos.player.hide();

            return false;
        });
    }
};


// --------------------------------------------------------------------

// modal

dkvideos.modal = {
    init: function() {
        // console.log('dkvideos.modal.init()');

        overlay = $('<div class="dkv-overlay"></div>');

        overlay.appendTo('body');

        // overlay.click(function() {
        //     dkvideos.modal.hide();
        // });

        $('html').click(function() {
          //console.log('---', $('.dkv-sources').hasClass('open'));
              // if($('.dkv-sources').hasClass('open')) {
              //   $('.dkv-sources').removeClass('open');
              // }
        });

        $(document).on('click', '.dkv-sources', function(event){
            // console.log('stop popa');
            event.stopPropagation();
        });




        var spinOpts2 = {
          lines: 9, // The number of lines to draw
          length: 3, // The length of each line
          width: 2, // The line thickness
          radius: 3, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#000', // #rgb or #rrggbb
          speed: 2, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'dkv-spin2', // The CSS class to assign to the spinner
          zIndex: 200, // The z-index (defaults to 2000000000)
          top: 5, // Top position relative to parent in px
          left: -20 // Left position relative to parent in px
        };


        var spinOpts3 = {
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
          className: 'dkv-spin3', // The CSS class to assign to the spinner
          zIndex: 200, // The z-index (defaults to 2000000000)
          top: 5, // Top position relative to parent in px
          left: 0 // Left position relative to parent in px
        };

        setTimeout(function() {



            $('.dkv-video-more a').spin(spinOpts2);


            $('.dkv-player .dkv-spinner').spin(spinOpts3);


        }, 10);

        // this.resize();
    },

    resize: function() {

      // console.log('resize');
        this._resize();
    },

    _resize: function() {
        // console.log('_resize');

        // console.log('resize modal', $('.dkv-main').outerWidth());
        // videos play button

        var playTop = ($('.dkv-videos-thumb').outerHeight() - $('.dkv-videos-thumb .dkv-play').outerHeight()) / 2;
        var playLeft = ($('.dkv-videos-thumb').outerWidth() - $('.dkv-videos-thumb .dkv-play').outerWidth()) / 2;

        $('.dkv-videos-thumb .dkv-play').css('top', playTop);
        $('.dkv-videos-thumb .dkv-play').css('left', playLeft);


        // no videos

        var noVideosTop = (($('.dkv-main .dkv-content').outerHeight() - $('.dkv-main .dkv-content .dkv-empty').outerHeight()) / 2) - 0;
        var noVideosLeft = ($('.dkv-main .dkv-content').outerWidth() - $('.dkv-main .dkv-content .dkv-empty').outerWidth()) / 2;

        // console.log('lenght', $('.dkv-main').outerWidth());
        // console.log('_resize', playTop, playLeft, noVideosTop, noVideosLeft);

        $('.dkv-main .dkv-content .dkv-empty').css('top', noVideosTop);
        $('.dkv-main .dkv-content .dkv-empty').css('left', noVideosLeft);
    },

    show : function() {
        // console.log('show overlay', $('.dkv-overlay').length);
        $('.dkv-overlay').css('display', 'block');
        $('.dkv-modal').css('display', 'block');

        dkvideos.modal.resize();
    },

    hide: function() {
        $('.dkv-overlay').css('display', 'none');
        $('.dkv-modal').css('display', 'none');

        dkvideos.player.hide();
    }
};

// --------------------------------------------------------------------

// modal

dkvideos.scroll = {
    init: function() {
        // console.log('scroll init');

        $(window).scroll(function () {
            //// console.log('scroll', $(window).scrollTop(), $(window).height(), $(document).height());
            if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                dkvideos.scroll.trigger();
            }
        });
    },

    check: function(scrollWrap, scrollContent) {

        // the offset triggers the load more earlier

        var scrollOffset = scrollWrap.outerHeight() * 2;

        scrollWrap.scroll(function () {

            // console.log(
            //     'scroll',
            //     scrollWrap.scrollTop(),
            //     scrollWrap.height(),
            //     scrollOffset,
            //     (scrollWrap.scrollTop() + scrollWrap.height() + scrollOffset),
            //     scrollContent.height()
            // );

            if ((scrollWrap.scrollTop() + scrollWrap.height() + scrollOffset) >= scrollContent.height()) {
                dkvideos.scroll.trigger();
            }
        });
    },

    trigger: function() {
        // Works perfect for desktop browsers

        if($('.dkv-video-more').css('display') != "none") {
            $('.dkv-video-more a').trigger('click');
        }
    }
};
