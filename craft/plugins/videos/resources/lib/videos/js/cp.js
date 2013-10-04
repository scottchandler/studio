/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */

dkvideos.currentVideo = false;


// --------------------------------------------------------------------

// player

// player : init

dkvideos.player.init = function() {
    // console.log('mcp.preview.init()');

    this._init();

    // overlay = $('<div class="dkv-overlay"></div>');

    // overlay.appendTo('body');


    // console.log($('.dkv-overlay'));

    // $('.dkv-overlay, .dkv-modal .dkv-cancel').click(function() {

    $('.dkv-overlay, .dkv-modal .dkv-cancel').click(function() {

        dkvideos.player.hide();

        return false;
    });
};

// player : resize

dkvideos.player.resize = function() {
    var winH = $(window).height();
    var winW = $(window).width();

    var playerTop = (winH / 2) - $('.dkv-player').outerHeight() / 2;
    var playerLeft = (winW / 2) - $('.dkv-player').outerWidth() / 2;

    $('.dkv-player').css('top', playerTop);
    $('.dkv-player').css('left', playerLeft);

};

// player : play

dkvideos.player.play = function(video) {
    dkvideos.currentVideo = video;

    dkvideos.player.show();
};

// player : show

dkvideos.player.show = function() {
    $('.dkv-player').css('display', 'block');
    $('.dkv-overlay').css('display', 'block');
    dkvideos.player.resize();
};

// player : hide

dkvideos.player.hide = function() {
    $('.dkv-overlay').css('display', 'none');
    $('.dkv-player .dkv-embed').html('');
    $('.dkv-player').css('display', 'none');
};

// --------------------------------------------------------------------

// modal

dkvideos.modal.resize = function(callback) {

        // console.log('cp dkvideos.modal.resize');

        // if($('.dkv-main .dkv-content').length > 0) {
        //     console.log('computed', $('.dkv-main .dkv-content').outerWidth());
        // }

        var mainH = $('.dkv-main .dkv-content').outerHeight();
        var sidebarH = $('.dkv-sidebar .dkv-content').outerHeight();
        var modalH = $('.dkv-modal').outerHeight();

        var newH = $('.dkv-videos ul').outerHeight();

        if(newH < 400) {
            newH = 400;
        }

        $('.dkv-sidebar .dkv-content').css('height', newH);
        $('.dkv-main .dkv-content').css('height', newH);
        $('.dkv-main .dkv-content').css('width', '100%');

        // console.log('newH', newH);
        // console.log('computed', $('.dkv-main .dkv-content').width());

        this._resize();

        if(typeof(callback) != "undefined") {
            callback();
        }
};

// --------------------------------------------------------------------

// scroll

dkvideos.scroll.init = function() {

    var scrollWrap = $(window);
    var scrollContent = $(document);

    this.check(scrollWrap, scrollContent);
};

// --------------------------------------------------------------------


$(document).ready(function() {
    angular.bootstrap($('.dkv-modal'), ['videos']);
    dkvideos.modal.init();
    dkvideos.player.init();
});

$(window).resize(function() {

    dkvideos.player.resize();
    dkvideos.modal.resize();
});

