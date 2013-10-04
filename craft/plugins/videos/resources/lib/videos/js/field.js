/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */

dkvideos.currentField = false;

// --------------------------------------------------------------------

// player

// player : init

dkvideos.player.init = function() {
    // console.log('mcp.preview.init()');

    dkvideos.player._init();

    // overlay
    // console.log('init');

    $(document).on('click', '.dkv-overlay', function() {

        if($('.dkv-player').css('display') != "none") {
            dkvideos.player.hide();
        } else {
            dkvideos.modal.hide();
        }

        return false;
    });


    // back

    // $('.dkv-modal').on('click', '.dkv-back', function() {

    //     dkvideos.player.hide();

    //     return false;
    // });



    // cancel

    $('.dkv-modal').on('click', '.dkv-cancel', function() {

        dkvideos.modal.hide();

        return false;
    });


    // select video

    $('.dkv-modal').on('click', '.dkv-submit', function() {
        // console.log('dkv-submit');
        if (!$(this).hasClass('dkv-disabled')){

            dkvideos.player.hide();
            dkvideos.modal.hide();

            $('input.text', dkvideos.currentField).attr('value', dkvideos.currentVideo.url);

            dkvideos.field.embed(dkvideos.currentVideo.url, dkvideos.currentField);
        }

        return false;
    });
};

// player : play

dkvideos.player.play = function(video) {
    dkvideos.currentVideo = video;

    dkvideos.player.show();

};

// player : resize

dkvideos.player.resize = function() {
    var modalH = $('.dkv-modal').outerHeight();
    var modahW = $('.dkv-modal').outerWidth();


    var modalBottomH = $('.dkv-modal .dkv-bottom').outerHeight();

    var playerH = modalH;

    var iFrameHeight = playerH - $('.dkv-player .dkv-bottom').outerHeight();


    $('.dkv-player').css('height', playerH);

    $('.dkv-player .dkv-embed').css('height', iFrameHeight);

};

// player : show

dkvideos.player.show = function() {
    $('.dkv-player').css('display', 'block');
    $('.dkv-modal .dkv-back').removeClass('dkv-hidden');
    $('.dkv-modal .dkv-cancel').addClass('dkv-hidden');
    $('.dkv-modal .dkv-sidebar').addClass('dkv-hidden');
    $('.dkv-modal .dkv-main').addClass('dkv-full');
    $('.dkv-modal .dkv-favorite').removeClass('dkv-hidden');
    this.resize();
};

// player : hide

dkvideos.player.hide = function() {
    $('.dkv-player .dkv-embed').html('');
    $('.dkv-modal .dkv-back').addClass('dkv-hidden');
    $('.dkv-modal .dkv-cancel').removeClass('dkv-hidden');
    $('.dkv-modal .dkv-sidebar').removeClass('dkv-hidden');
    $('.dkv-modal .dkv-main').removeClass('dkv-full');
    $('.dkv-modal .dkv-favorite').addClass('dkv-hidden');
    $('.dkv-player').css('display', 'none');

};

// --------------------------------------------------------------------

// modal tweaks


dkvideos.modal.resize = function() {

        var winH = $(window).height();
        var winW = $(window).width();


        // center modal

        var modalH = $('.dkv-modal').outerHeight();
        var modalW = $('.dkv-modal').outerWidth();

        var modalT = (winH - modalH) / 2;
        var modalL = (winW - modalW) / 2;

        $('.dkv-modal').css('top', modalT);
        $('.dkv-modal').css('left', modalL);


        // resize modal elements

        var modalTopH = $('.dkv-modal .dkv-top').outerHeight();
        var modalBottomH = $('.dkv-modal .dkv-main .dkv-bottom').outerHeight();


        // content

        var contentH = modalH - modalTopH - modalBottomH;

        // console.log('sizes', modalH, modalTopH, modalBottomH, contentH);

        $('.dkv-content').css('height', contentH);

        this._resize();
};



// --------------------------------------------------------------------

// scroll

dkvideos.field = {
    embed: function(videoUrl, field) {
        // request field preview embed

        DuktVideosCms.postActionRequest('fieldEmbed', {videoUrl:videoUrl}, function(response) {
            // console.log('fieldEmbed', videoUrl);
            // load modal body

            var fieldPreview = $('.dkv-embed', field);

            fieldPreview.html('');

            fieldPreview.css('display', 'block');

            $(response['embed']).appendTo(fieldPreview);

            // dkvideos.player.init();

            $('.dkv-add', field).css('display', 'none');
            $('.dkv-change', field).css('display', 'inline-block');
            $('.dkv-remove', field).css('display', 'inline-block');


            // resize

            dkvideos.field.resize();


            // manual bootstrap

            //angular.bootstrap($('.dkv-modal'), ['videos']);
        });
    },

    resize: function() {

        var hdSize = {w:1280,h:720};
        var fieldW = $('.dkv-field').outerWidth();
        var embedH = fieldW * hdSize.h / hdSize.w;

        $('.dkv-field .dkv-embed').css('height', embedH);

    }
};

// --------------------------------------------------------------------

// scroll

dkvideos.scroll.init = function() {

    var scrollWrap = $('.dkv-main .dkv-content');
    var scrollContent = $('.dkv-videos');

    this.check(scrollWrap, scrollContent);
};

// --------------------------------------------------------------------

// plugin definition

(function($) {

    $.fn.dukt_videos_field = function(options)
    {
        // build main options before element iteration
        // iterate and reformat each matched element

        return this.each(
            function()
            {
                field = $(this);

                $.fn.dukt_videos_field.init_field(field);
            }
        );
    };

    // --------------------------------------------------------------------

    // main init

    $.fn.dukt_videos_field.init = function()
    {
        // console.log('hello', videos);


        // get modal body

        DuktVideosCms.postActionRequest('modal', {}, function(response) {

            // load modal body

            $(response).appendTo('body');

            dkvideos.player.init();

            dkvideos.modal.init();

            // manual bootstrap

            // console.log('angular bootstrap');

            angular.bootstrap($('.dkv-modal'), ['videos']);
        });

        // matrix compatibility

        if(typeof(Matrix) != "undefined")
        {
            Matrix.bind("dukt_videos", "display", function(cell) {

                // we remove event triggers because they are all going to be redefined
                // will be improved with single field initialization

                if (cell.row.isNew)
                {
                    var field = $('> .dkv-field', cell.dom.$td);

                    $.fn.dukt_videos_field.init_field(field);
                }
            });
        }
    };

    // --------------------------------------------------------------------

    // init field

    $.fn.dukt_videos_field.init_field = function(field)
    {
        // if a video is already set, load the iframe

        var input = $('input.text', field);
        var videoUrl = input.val();

        if(videoUrl !== "") {
            // a video is set

            dkvideos.field.embed(videoUrl, field);
        } else {
            $('.dkv-add', field).css('display', 'inline-block');
            $('.dkv-change', field).css('display', 'none');
            $('.dkv-remove', field).css('display', 'none');
        }


        // add & change button

        $('.dkv-add, .dkv-change', field).click(function() {
            dkvideos.currentField = field;
            dkvideos.modal.show();
        });


        // remove button

        $('.dkv-remove', field).click(function() {
            input.val('');

            $('.dkv-embed', field).css('display', 'none');
            $('.dkv-embed', field).html();

            $('.dkv-add', field).css('display', 'inline-block');
            $('.dkv-change', field).css('display', 'none');
            $('.dkv-remove', field).css('display', 'none');
        });
    }

    // --------------------------------------------------------------------

    // init on document ready

    $(document).ready(function() {
        $.fn.dukt_videos_field.init();
    });


})(jQuery);

// --------------------------------------------------------------------

// document ready

$(document).ready(function()
{
    // console.log('Videos field on this page : ', $('.dkv-field').length);

    // init loop on each field

    $('.dkv-field').dukt_videos_field();
});


// --------------------------------------------------------------------

// window resize

$(window).resize(function() {
    dkvideos.field.resize();
    dkvideos.player.resize();
    dkvideos.modal.resize();
});
