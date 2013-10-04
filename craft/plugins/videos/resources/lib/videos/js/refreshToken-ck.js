/**
 * Videos Plugin Assets
 *
 * @package   Videos Plugin
 * @author    Benjamin David
 * @copyright Copyright (c) 2013, Dukt
 * @license   http://dukt.net/
 * @link      http://dukt.net/
 */$(document).ready(function(){function t(){var e=$(".dkv-expires").data("providerclass"),t={providerClass:e};DuktVideosCms.postActionRequest("refreshToken",t,function(e){$(".dkv-expires").html(e)})}if($(".dkv-expires").length>0){var e=$(".dkv-expires").data("providerclass");setInterval(function(){var e=$(".dkv-expires").html();e-=1;$(".dkv-expires").html(e);e<=1&&t()},1e3)}});