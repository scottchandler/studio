/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */dkvideos.currentVideo=!1;dkvideos.player.init=function(){this._init();$(".dkv-overlay, .dkv-modal .dkv-cancel").click(function(){dkvideos.player.hide();return!1})};dkvideos.player.resize=function(){var e=$(window).height(),t=$(window).width(),n=e/2-$(".dkv-player").outerHeight()/2,r=t/2-$(".dkv-player").outerWidth()/2;$(".dkv-player").css("top",n);$(".dkv-player").css("left",r)};dkvideos.player.play=function(e){dkvideos.currentVideo=e;dkvideos.player.show()};dkvideos.player.show=function(){$(".dkv-player").css("display","block");$(".dkv-overlay").css("display","block");dkvideos.player.resize()};dkvideos.player.hide=function(){$(".dkv-overlay").css("display","none");$(".dkv-player .dkv-embed").html("");$(".dkv-player").css("display","none")};dkvideos.modal.resize=function(e){var t=$(".dkv-main .dkv-content").outerHeight(),n=$(".dkv-sidebar .dkv-content").outerHeight(),r=$(".dkv-modal").outerHeight(),i=$(".dkv-videos ul").outerHeight();i<400&&(i=400);$(".dkv-sidebar .dkv-content").css("height",i);$(".dkv-main .dkv-content").css("height",i);$(".dkv-main .dkv-content").css("width","100%");this._resize();typeof e!="undefined"&&e()};dkvideos.scroll.init=function(){var e=$(window),t=$(document);this.check(e,t)};$(document).ready(function(){angular.bootstrap($(".dkv-modal"),["videos"]);dkvideos.modal.init();dkvideos.player.init()});$(window).resize(function(){dkvideos.player.resize();dkvideos.modal.resize()});