'use strict';
// Get all localized variables

function ExpireCookie(minutes, content) {
    var date = new Date();
    var m = minutes;
    date.setTime(date.getTime() + (m * 60 * 1000));
    jQuery.cookie(content, m, { expires: date, path:'/' });
}

/* Time calculating in seconds! [example: fb_like_modal(30)] P.S. After 30 seconds, the function will be run */
function fb_likeus_modal(ShowTime){
    var modalContainer = jQuery('#fbpageModal');
    var timeExe = ShowTime*1000;
    var closeBtn = modalContainer.find('button[data-dismiss="modal"]');
    var cookie = jQuery.cookie('ts_fb_modal_cookie'),
        setTime = 360;

    if( cookie != setTime ){
        modalContainer.delay(timeExe).queue(function() {
            jQuery(this).hide();
            jQuery(this).modal('show'); //calling modal() function
            jQuery(this).dequeue();
        });
    }else{
        modalContainer.modal('hide');
    }
    //If you clicked on the close button, the function sends a cookie for 30 minutes which helps to not display modal at every recharge page
    closeBtn.on('click', function(){
        ExpireCookie(setTime, 'ts_fb_modal_cookie');
    });
}

function ts_set_like(){
    jQuery('.touchsize-likes').on('click',function() {
        var link, id, postfix;

        link = jQuery(this);
        if(link.hasClass('active')) return false;
    
        id = jQuery(this).attr('data-id'),
        postfix = link.find('.touchsize-likes-postfix').text();
        
        jQuery.post(VideoTouch.ajaxurl, { action:'touchsize-likes', likes_id:id, postfix:postfix }, function(data){
            link.html(data).addClass('active').attr('title','You already like this');
        });
    
        return false;
    });
    
    if( jQuery('body.touchsize-likes').length ) {
        jQuery('.touchsize-likes').each(function(){
            var id = jQuery(this).attr('id');
            jQuery(this).load(VideoTouch.ajaxurl, { action:'touchsize-likes', post_id:id });
        });
    }
}

/* Testimonials */
jQuery(function(){
    jQuery('ul.testimonials-controls li').click(function(){
        var testimonial_id = jQuery(this).attr('id');
            jQuery(this).parent().prev().find('li').hide();
            jQuery(this).parent().find('li.active').removeClass('active');
            jQuery(this).parent().prev().find('#' + testimonial_id).show();
            jQuery(this).addClass('active');
    });
});


/* Article carousel */

function initCarousel() {
    jQuery('.carousel-wrapper').each(function () {
        var thisElem = jQuery(this);
        var numberOfElems = parseInt(jQuery('.carousel-container', thisElem).children().length, 10);
        var oneElemWidth;
        var numberOfColumns = [
            ['col-lg-2', 6],
            ['col-lg-3', 4],
            ['col-lg-4', 3],
            ['col-lg-6', 2],
            ['col-lg-12', 1]
        ];
        var curentNumberOfColumns;
        var moveMargin;
        var leftHiddenElems = 0;
        var rightHiddenElems;
        var curentMargin = 0;
        var numberOfElemsDisplayed;
        var index = 0;
        var carouselContainerWidth;
        var carouselContainerWidthPercentage;
        var elemWidth;
        var elemWidthPercentage;

        while (index < numberOfColumns.length) {
            if (jQuery('.carousel-container>div', thisElem).hasClass(numberOfColumns[index][0])) {
                curentNumberOfColumns = numberOfColumns[index][1];
                break;
            }
            index++;
        }

        elemWidth = 100 / numberOfElems;
        elemWidth = elemWidth.toFixed(4);
        elemWidthPercentage = elemWidth + '%';

        function showHideArrows(){
            if(curentNumberOfColumns >= numberOfElems){

                jQuery('ul.carousel-nav > li.carousel-nav-left', thisElem).css('opacity','0.4');
                jQuery('ul.carousel-nav > li.carousel-nav-right', thisElem).css('opacity','0.4');

            } else if(leftHiddenElems === 0){

                jQuery('ul.carousel-nav > li.carousel-nav-left', thisElem).css('opacity','0.4');
                jQuery('ul.carousel-nav > li.carousel-nav-right', thisElem).css('opacity','1');

            } else if (rightHiddenElems === 0 ){

                jQuery('ul.carousel-nav > li.carousel-nav-left', thisElem).css('opacity','1');
                jQuery('ul.carousel-nav > li.carousel-nav-right', thisElem).css('opacity','0.4');

            } else {
                jQuery('ul.carousel-nav > li.carousel-nav-left', thisElem).css('opacity','1');
                jQuery('ul.carousel-nav > li.carousel-nav-right', thisElem).css('opacity','1');
            }
        }

        function reinitCarousel() {

            showHideArrows();
            jQuery('.carousel-container', thisElem).css('margin-left', 0);
            leftHiddenElems = 0;
            jQuery('ul.carousel-nav > li', thisElem).unbind('click');

            if (jQuery(window).width() <= 973) {

                carouselContainerWidth = 100 * numberOfElems;
                carouselContainerWidthPercentage = carouselContainerWidth + '%';
                rightHiddenElems = numberOfElems - 1;
                moveMargin = 100;
                curentMargin = 0;

                jQuery('ul.carousel-nav > li', thisElem).unbind('click');

                jQuery('ul.carousel-nav > li', thisElem).click(function () {
                    if (jQuery(this).hasClass('carousel-nav-left')) {
                        if (leftHiddenElems > 0) {
                            curentMargin = curentMargin + moveMargin;
                            jQuery('.carousel-container', thisElem).css('margin-left', curentMargin + '%');
                            rightHiddenElems++;
                            leftHiddenElems--;
                        }
                    } else {
                        if (rightHiddenElems > 0) {
                            curentMargin = curentMargin - moveMargin;
                            jQuery('.carousel-container', thisElem).css('margin-left', curentMargin + '%');
                            rightHiddenElems--;
                            leftHiddenElems++;
                        }
                    }
                    // Trigger arrows color change
                    showHideArrows();
                });

            } else {

                while (index < numberOfColumns.length) {
                    if (jQuery('.carousel-container>div', thisElem).hasClass(numberOfColumns[index][0])) {
                        numberOfElemsDisplayed = numberOfColumns[index][1];
                        moveMargin = 100 / numberOfElemsDisplayed;
                        rightHiddenElems = numberOfElems - numberOfElemsDisplayed;
                        oneElemWidth = 100 / numberOfColumns[index][1];
                        break;
                    }
                    index++;
                }

                carouselContainerWidth = oneElemWidth * numberOfElems;
                carouselContainerWidthPercentage = carouselContainerWidth + '%';

                curentMargin = 0;

                jQuery('ul.carousel-nav > li', thisElem).click(function () {
                    if (jQuery(this).hasClass('carousel-nav-left')) {
                        if (leftHiddenElems > 0) {
                            curentMargin = curentMargin + moveMargin + 0.00001;
                            jQuery('.carousel-container', thisElem).css('margin-left', curentMargin + '%');
                            rightHiddenElems++;
                            leftHiddenElems--;
                        }
                    } else {
                        if (rightHiddenElems > 0) {
                            curentMargin = curentMargin - moveMargin;
                            jQuery('.carousel-container', thisElem).css('margin-left', curentMargin + '%');
                            rightHiddenElems--;
                            leftHiddenElems++;
                        }
                    }
                    // Trigger arrows color change
                    showHideArrows();
                });
            }

            //Set the container total width
            jQuery('.carousel-container', thisElem).width(carouselContainerWidthPercentage).css({
                'max-height': '9999px',
                'opacity': '1'
            });

            //Set width for each element
            jQuery('.carousel-container>div', thisElem).each(function () {
                jQuery(this).attr('style', 'width: ' + elemWidthPercentage + ' !important; float:left;');
            });
        }

        reinitCarousel();

        jQuery(window).resize(function () {
            reinitCarousel();
            resizePreRoll();
        });
    });
}

function visibleBeforeAnimation(){
    jQuery('.ts-grid-view.animated, .ts-thumbnail-view.animated, .ts-big-posts.animated, .ts-list-view.animated, .ts-super-posts.animated').each(function(){
        jQuery(this).find('article').each(function(index){
            var thisElem = jQuery(this);
            if( !thisElem.hasClass('shown') && thisElem.isOnScreen() === true ){
                thisElem.addClass('shown');
                thisElem.stop().delay(100*index).animate({opacity: 1},1000);
            }
        });
    });
    jQuery('.content-block.animated').each(function(index){
        var thisElem = jQuery(this);
        var pixelsFromTransform = 0;
        if( thisElem.hasClass('slideup') ){
            pixelsFromTransform = 250;
        }
        if( thisElem.isOnScreen() === true ){
            thisElem.addClass('shown');
            thisElem.animate({opacity: 1},800);
        }
    });
    
    jQuery('.ts-counters').each(function(index){
        var thisElem = jQuery(this);
        if ( thisElem.isOnScreen() ) {
            startCounters();
        };
    });

}

function animateArticlesOnLoad(){
    var thisElem;
    // If adds fade effect to articles in grid view
    jQuery(window).on('scroll',function(){
        jQuery('.ts-grid-view.animated, .ts-thumbnail-view.animated, .ts-big-posts.animated, .ts-list-view.animated, .ts-super-posts.animated').each(function(){
            jQuery(this).find('article').each(function(index){
                thisElem = jQuery(this);
                if( !thisElem.hasClass('shown') && thisElem.isOnScreen() === true ){
                    thisElem.addClass("shown");
                    thisElem.stop().delay(100*index).animate({opacity: 1},1200);
                }
            });
        });
    });
}

jQuery.fn.isOnScreen = function(){
     
    var win = jQuery(window);
     
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
     
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
     
    return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));
     
};

function animateBlocksOnScroll(){
    var thisElem;
    jQuery(window).on('scroll',function(){
        jQuery('.content-block.animated').each(function(index){
            var thisElem = jQuery(this);
            var pixelsFromTransform = 0;
            if( thisElem.hasClass('slideup') ){
                pixelsFromTransform = 150;
            }
            if( !thisElem.hasClass('shown') && thisElem.isOnScreen() === true ){
                thisElem.addClass('shown');
                thisElem.stop().delay(100*index).animate({opacity: 1},1000);
            }
        });
        jQuery('.ts-counters').each(function(index){
            var thisElem = jQuery(this);
            var pixelsFromTransform = 0;
            if( !thisElem.hasClass('shown') && thisElem.isOnScreen() === true ){
                thisElem.addClass('shown');
                startCounters();
            }
        });
    });
    
}

function activateStickyMenu(){
    if( jQuery('.ts-header-menu:last').length > 0 ){
        var lastMenuOnPage = jQuery('.ts-header-menu:last');
        var alignMenu = jQuery('#nav').attr('class').split(' ');
        jQuery(window).on('scroll',function(){
            var normalMenuTop = jQuery(lastMenuOnPage) != ''? jQuery(lastMenuOnPage).offset().top : '';
            var normalMenuHeight = jQuery('nav#nav').height();
            var stickyMenuHeight = jQuery('.ts-sticky-menu .container').outerHeight();
            if( jQuery(window).scrollTop() > normalMenuHeight + normalMenuTop && !jQuery('.ts-sticky-menu').hasClass('active') ){
                jQuery('.ts-sticky-menu').outerHeight(stickyMenuHeight);
                jQuery('.ts-sticky-menu').addClass('active');
            } else if( jQuery(window).scrollTop() < normalMenuHeight + normalMenuTop && jQuery('.ts-sticky-menu').hasClass('active') ) {
                jQuery('.ts-sticky-menu').removeClass('active');
                jQuery('.ts-sticky-menu').outerHeight(0);
            }
        });
        jQuery('.ts-sticky-menu').addClass(''+alignMenu[2]+' '+alignMenu[3]);
    }
}

function startOnePageNav(){
    jQuery('.main-menu a').click(function(e){
        e.preventDefault();
        var navItemUrl = jQuery(this).attr('href');
        if( navItemUrl === '' ){
            return false;
        }
        jQuery(document).scrollTo(navItemUrl,500);
    });
}

function filterButtonsRegister(){
    // Adds active class to "all" button
    jQuery('.ts-filters > li:first').find('a').addClass('active');
    
    // Code to change the .active class on click
    jQuery('.ts-filters > li a').click(function(e){
        e.preventDefault();
        
        var thisElem = jQuery(this);
        jQuery('.ts-filters > li').find('.active').removeClass('active');
        thisElem.addClass('active');
        return false;
    });
}

function hidePreloader(){
    // Animate the proloader after the page has been loaded
    setTimeout(function () {
        jQuery('.ts-page-loading').addClass('ts-page-loading-animate');
    }, 600);
}

function resizeVideo(iframe_width, iframe_height){
    if(jQuery('.embedded_videos').length){
        jQuery('.embedded_videos iframe').each(function(){

            var iframe_width = jQuery(this).width();
            var iframe_height = jQuery(this).height();

            var iframe_proportion = iframe_width/iframe_height;

            if ( iframe_height > iframe_width){
                iframe_proportion = jQuery(this).attr('width')/jQuery(this).attr('height');
            }
            
            var iframe_parent_width = jQuery(this).parents('.embedded_videos').parent().width();
            jQuery(this).attr('width',iframe_parent_width);
            jQuery(this).attr('height',iframe_parent_width/iframe_proportion);
        });

        jQuery('.embedded_videos .wp-video').each(function(){
            var iframe = jQuery(this);
            var iframe_width = jQuery(this).width();
            var iframe_height = iframe_width/1.777;
            var iframe_proportion = iframe_width/iframe_height;
            
            var iframe_parent_width = jQuery(this).parents('.embedded_videos').parent().width();
            console.log(iframe_parent_width);
            jQuery(iframe).css('width',iframe_parent_width);
            jQuery(iframe).css('height',iframe_parent_width/iframe_proportion);
            jQuery(iframe).find('.wp-video-shortcode').css('width',iframe_parent_width);
            jQuery(iframe).find('.wp-video-shortcode').css('height',iframe_parent_width/iframe_proportion);

            setTimeout(function(){
                jQuery(window).trigger('resize');
            },400);

        });
    }
}

function twitterWidgetAnimated(){
    /*Tweets widget*/
    var delay = 4000; //millisecond delay between cycles
    
    function cycleThru(variable, j){
        var jmax = jQuery(variable + " li").length;
        jQuery(variable + " li:eq(" + j + ")")
            .css('display', 'block')
            .animate({opacity: 1}, 600)
            .animate({opacity: 1}, delay)
            .animate({opacity: 0}, 800, function(){
                if(j+1 === jmax){
                    j=0;
                }else{
                    j++;
                }
                jQuery(this).css('display', 'none').animate({opacity: 0}, 10);
                cycleThru(variable, j);
            });
    }

    jQuery('.tweets').each(function(index, val) {
        //iterate through array or object
        var parent_tweets = jQuery(val).attr('id');
        var actioner = '#' + parent_tweets + ' .ts-twitter-container.dynamic .slides_container .widget-items';
        cycleThru(actioner, 0);
    });
}

//Add logo to the center of all menu item list
function addLogoToMenu(logoContent){
    var menu_item_number = jQuery(".menu-with-logo > .main-menu > li").length;
    var middle = Math.round(menu_item_number / 2);
    jQuery(".menu-with-logo > .main-menu > li:nth-child(" + middle + ")").after(jQuery('<li class="menu-logo">'+logoContent+'</li>'));
    if (typeof logoContent !== 'undefined') {
        jQuery(".ts-sticky-menu .main-menu > li:nth-child(" + middle + ")").after(jQuery('<li class="menu-logo">'+logoContent+'</li>'));
    }
}

jQuery(document).on('click', '#ts-mobile-menu .trigger', function(event){
    event.preventDefault();
    jQuery(this).parent().next().slideToggle();
}); 

jQuery(document).on('click', '#ts-mobile-menu .menu-item-has-children > a', function(event){
    event.preventDefault();
    if (jQuery(this).next().attr('class').split(' ')[0] === 'ts_is_mega_div') {
        jQuery(this).next().children().slideToggle();
    }else{
        jQuery(this).next().slideToggle();
    }
});

jQuery(document).on('click', '.ts-vertical-menu .menu-item-has-children > a', function(event){
    event.preventDefault();
    jQuery(this).parent().toggleClass('collapsed');
    jQuery(this).next().slideToggle();
});


/* This function aligns the vertical center elements */
function alignElementVerticalyCenter(){
    var container = jQuery('.site-section');

    jQuery(container).each(function(){
        if( jQuery(this).hasClass('ts-fullscreen-row') ){
            var windowHeight = jQuery(window).height();
            var containerHeight = windowHeight;
        }else{
            var windowHeight = '100%';
            var containerHeight = jQuery(this).outerHeight();
        }

        var innerContent = jQuery(this).find('.container').height();
        var insertPadding = Math.round((containerHeight-innerContent)/2);

        if( jQuery(this).attr('data-alignment') == 'middle' ){
            jQuery(this).css({'padding-top':insertPadding,'padding-bottom':insertPadding,'min-height':windowHeight});
        }else if( jQuery(this).attr('data-alignment') == 'top' ){
            jQuery(this).css('min-height',windowHeight);
        }else if( jQuery(this).attr('data-alignment') == 'bottom' ){
            jQuery(this).css({'width':'100%','height':containerHeight,'position':'relative','min-height':windowHeight});
            jQuery(this).children('.container').css({'width':'100%','height':'100%'});
            jQuery(this).find('.row-align-bottom').css({'position':'absolute','width':'100%','bottom':'0'});
        }
    });

    // align the elements vertically in the middle for banner box
    if( jQuery('.ts-banner-box').length > 0 ){
        jQuery('.ts-banner-box').each(function(){
            var containerHeight = jQuery(this).outerHeight();
            var innerContent = jQuery(this).find('.container').height();
            var insertPadding = Math.round((containerHeight-innerContent)/2);

            jQuery(this).css({'padding-top':insertPadding,'padding-bottom':insertPadding});
        });
    }
        
}

function alignMegaMenu(){
    setTimeout(function(){
        if ( jQuery('.main-menu').length > 0 ) {
            jQuery('.main-menu').each(function(){
                if( !jQuery(this).parent().hasClass('mobile_menu') ){
                    var thisElem = jQuery(this).find('.is_mega .ts_is_mega_div');
                    if ( jQuery(thisElem).length > 0 ) {
                        var windowWidth = jQuery(window).width();
                        var thisElemWidth = jQuery(thisElem).outerWidth();
                        jQuery(thisElem).removeAttr('style');
                        var menuOffset = jQuery(thisElem).offset().left;
                        var result = Math.round((windowWidth-thisElemWidth)/2);

                        var result2 = result - menuOffset;
                        jQuery(thisElem).css('left',result2);
                    };
                }
            });
        };
    },100);
}

function fb_comments_width(){
    setTimeout(function(){
        jQuery('#comments .fb-comments').css('width','100%');
        jQuery('#comments .fb-comments > span').css('width','100%');
        jQuery('#comments .fb-comments > span > iframe').css('width','100%');
    },300);
}

function startCounters(){
    var $chart = jQuery('.chart');
    var $cnvSize = 160;
    $chart.easyPieChart({
        animate: 2000,
        scaleColor: false,
        barColor: main_color,
        size: $cnvSize,
        onStep: function(from, to, percent) {
            jQuery(this.el).find('.percent').text(Math.round(percent)).css({
                "line-height": $cnvSize+'px',
                width: $cnvSize 
            })
        }
    })
}

/* Running functions on page load */
jQuery(window).on('load resize orientationchange', function(){
    alignMegaMenu();
    var video_height = jQuery('#videoframe').height();
    jQuery('#watch-list-sidebar > .watch-playlist').css({height:video_height});

});


function showMosaic(){
    if( jQuery('.mosaic-view').length > 0 ){
        jQuery('.mosaic-view').each(function(){
            if(jQuery(this).hasClass('fade-effect')){
                jQuery(this).find('.scroll-container > div').each(function(index){
                    var thisElem = jQuery(this);
                    var parentOffset = thisElem.parent().parent().parent().parent().offset().left;
                    var parentWidth = thisElem.parent().parent().parent().parent().outerWidth();
                    
                    if( !thisElem.hasClass('shown') && thisElem.offset().left < parentOffset+parentWidth ){
                        thisElem.delay(index*2).animate({opacity:1},1000).addClass('shown');
                    }
                });
            }
        });
    }
}

function getFrameSize(content){
    if( !jQuery('body').hasClass('single-video') ){
        return false;
    }
    var frame = jQuery(content),
        new_iframe_url = frame.attr('src').split('?feature=oembed'),
        videoLink = new_iframe_url[0],
        videoWidth = frame.width(),
        videoHeight = frame.height(),
        container = jQuery(".video-container").width(),
        calc = parseFloat(parseFloat(videoWidth/videoHeight).toPrecision(1)),
        frameHeight = parseInt(container/calc)

    var frameOptions = {
        iframe:frame,
        videourl:videoLink,
        iwidth:container,
        iheight:frameHeight
    }
    return frameOptions
}
function autoPlayVideo(){
    jQuery('#post-video .video-container').css("display","block");
    jQuery('#post-video .video-container p iframe').css("display","block");
    jQuery('.overimg').css("display","none");
}


function videoPostShow(){

    if ( jQuery('.video-post-open').prev().height() <= 120 ){
        jQuery('.video-post-open').hide();
        jQuery('.video-post-open').prev().find('.content-cortina').hide();
    } else{
        jQuery('.video-post-open').prev().addClass('content-is-big');
    }

    jQuery('.video-post-open').click(function(){
        var element = jQuery(this);

        // Hide the details button if content is smaller

        

        // If show less
        if ( jQuery(element).hasClass('opened') ){
            jQuery(element).prev().css('height', '100px');
            jQuery(element).prev().find('.content-cortina').show();
            jQuery(element).find('i.icon-up').removeClass('icon-up').addClass('icon-down');
            jQuery(element).removeClass('opened');
        }

        // If show more
        else if ( !jQuery(element).hasClass('opened') ){
            jQuery(element).prev().css('height','auto');
            jQuery(element).prev().find('.content-cortina').hide();
            jQuery(element).find('i.icon-down').removeClass('icon-down').addClass('icon-up');
            jQuery(element).addClass('opened');
        }
        return false;
    });
}

function singleVideoResize(){
    jQuery('.video-single-resize').click(function(){
        var container = jQuery('.featured-image.video-featured-image > .container');
        var iframe = jQuery(container).find('iframe');
        var is_iframe = true;

        if( jQuery(iframe).length <= 0 ){
            iframe = jQuery(container).find('.wp-video');
            is_iframe = false;
            jQuery(iframe).animate({opacity: 0},300);
        }

        if( jQuery(iframe).length <= 0 ){
            iframe = jQuery(container).find('.video-container');
            is_iframe = false;
            jQuery(iframe).animate({opacity: 0},300);
        }

        var element = jQuery(this);
        if( VideoTouch.jwplayer == 'n' ){
            var iframe_width = jQuery(iframe).width();
            var iframe_height = jQuery(iframe).height();
        }else{
            var iframe_width = jQuery(iframe).width();
            var iframe_height = iframe_width/1.777;
        }

        var iframe_proportion = iframe_width/iframe_height;

        setTimeout(function(){
            // If make smaller
            if ( !jQuery(container).hasClass('is-smaller') ) {
                jQuery(container).addClass('is-smaller');
                jQuery(element).removeClass('in').addClass('out');
                jQuery(element).find('i:last-child').removeClass('icon-left').addClass('icon-right');
                jQuery(element).find('i:first-child').removeClass('icon-right').addClass('icon-left');
            }
            else if( jQuery(container).hasClass('is-smaller') ){
                jQuery(container).removeClass('is-smaller');
                jQuery(element).removeClass('out').addClass('in');
                jQuery(element).find('i:first-child').removeClass('icon-left').addClass('icon-right');
                jQuery(element).find('i:last-child').removeClass('icon-right').addClass('icon-left');
            }
        
            var iframe_parent_width = jQuery(iframe).parents('.embedded_videos').parent().width();
            
            if( VideoTouch.jwplayer == 'y' ){
                jQuery('#videoframe_wrapper').removeAttr('style');
                jwplayer().resize(iframe_parent_width, iframe_parent_width/iframe_proportion);
            }

            jQuery(iframe).css('width',iframe_parent_width);
            jQuery(iframe).css('height',iframe_parent_width/iframe_proportion);
            jQuery(iframe).find('.wp-video-shortcode, .mejs-layer').css('width',iframe_parent_width);
            jQuery(iframe).find('.wp-video-shortcode, .mejs-layer').css('height',iframe_parent_width/iframe_proportion);
            jQuery(iframe).find('.mejs-time-rail').css('width',iframe_parent_width);
        },400);

        setTimeout(function(){
            jQuery(window).trigger('resize');
            jQuery(iframe).animate({opacity: 1},150);
        },700);

        return false;
    });
}

function ts_get_video_modal_ajax(){
    jQuery("[data-toggle='modal']").click(function(){
        var post_id = jQuery(this).attr('data-id');
        var data = {
                'action'     : 'ts_get_video_modal',
                'nonce_video': VideoTouch.video_nonce,
                'post_id'    : post_id
        };

        jQuery.post(VideoTouch.ajaxurl, data, function(response){
         
            var iframe_video = jQuery("[data-video-id='" + post_id + "']").html();
            var url_to_post = jQuery("a[data-id='" + post_id + "']").attr('data-href');

            if( typeof(iframe_video) !== 'undefined' ){
                jQuery('#modal_video').find('.ts-add-link').attr('href', url_to_post);

                jQuery('#modal_video .modal-body').append(response).find('#videoframe').append(iframe_video);
            }else{
                jQuery('#modal_video').find('.ts-add-link').attr('href', url_to_post);
                jQuery('#modal_video .modal-body').append(response);
            }
            
            jQuery('#modal_video').modal('show');            
            ts_set_like();
            jQuery('#modal_video').on('hidden.bs.modal', function () {
                jQuery('#modal_video .modal-body').html('');
                jQuery('#modal_video').find('.ts-add-link').attr('href', '');
            })

        });
    });
}

/* ******************************* */
/*          Video Carousel         */
/* ******************************* */

(function($) {
    $.fn.ts_video_carousel = function(options) {
        var ts_slider_options = $.extend({
            transition: 700
        }, options);

        var $context = $(this),
            $slides = $(this).find('.slides'),
            $slide = $slides.children('li'),
            $nav_arrows = null;

        var viewport = $(window).width(),
            slide_width = $slide.eq(0).outerWidth(true),
            current = 0,
            ts_delay = null,
            prevSlide = 0;

        // get the height of the slide thumb ( afte the iframe has been resized )
        $(window).load(function(){
            if ( $nav_arrows !== null){
                $nav_arrows.css({ 'height': $slide.find('.thumb').height() });
            } 
        });

        $(window).resize(function(){               
            // delay the calculation of the viewport on resize
            if ( ts_delay !== null ){
                clearTimeout(ts_delay);
            }
            
            ts_delay = setTimeout(function(){
                viewport = $(window).width();                    
                if ( $nav_arrows !== null){
                    $nav_arrows.css({ 'height': $slide.find('.thumb').height() });
                } 
                ts_setWidths();                
            }, 400);
        });

        // create navigations
        (function ts_createElements(){
            var navigations =  '<div class="nav-arrow prev"><span class="nav-icon icon-left"></span></div>\
                                <div class="nav-arrow next"><span class="nav-icon icon-right"></span></div>';            
            $slides.after(navigations);
        })();

        // set initial states for slider elements
        (function ts_video_slider_init(){
            $slides.width( slide_width * $slide.size() );
            $slide.eq(0).addClass('current-active');            
            $nav_arrows = $context.find('.nav-arrow');
            $nav_arrows.eq(0).addClass('fade-me');              
            ts_setWidths();
        })();

        function ts_setWidths(){                
            if ( viewport < slide_width ) {
                $slide.width( viewport );
                slide_width = viewport;

                $slide.css( {
                    'left': slide_width * current * -1
                });
            } else {                    
                $slide.removeAttr('style');
                slide_width = $slide.width();
                
                $slide.css( {
                    'left': slide_width * current * -1
                });    
            }

            if ( viewport < $context.parent('.ts-video-slider-wrap').width() ) {
                $context.parent('.ts-video-slider-wrap').width(viewport);
            } else {
                $context.parent('.ts-video-slider-wrap').removeAttr('style');
            }
        };

        $slide.on( 'click', function(){
            if ( $(this).index() < current ){
                $slide.eq(current).removeClass('current-active'); 
                prevSlide = current;                    
                current--;

            } else if( $(this).index() > current) {
                $slide.eq(current).removeClass('current-active');       
                prevSlide = current;                                                    
                current++;
            }
            ts_changeSlide()
        });

        $nav_arrows.on('click', function(){
            if ( $(this).hasClass('next') ) {
                if ( current !== $slide.size() - 1) {
                    $slide.eq(current).removeClass('current-active');     
                    prevSlide = current;                    

                    current++;
                    $nav_arrows.eq(0).removeClass('fade-me');
                    ts_changeSlide();
                }
                if ( $nav_arrows.eq(0).hasClass('fade-me') ){
                    $nav_arrows.eq(0).removeClass('fade-me');
                }
            }
            else if( $(this).hasClass('prev') ){                
                if ( parseFloat($slide.eq(0).css('left').replace( 'px', '')) < 0 && current > 0 ) { 
                    $slide.eq(current).removeClass('current-active');     
                    prevSlide = current;  
                    current--;
                    ts_changeSlide();
                }

                if ( $nav_arrows.eq(1).hasClass('fade-me') ){
                    $nav_arrows.eq(1).removeClass('fade-me');
                }
            }
        });

        function ts_changeSlide(){

            $slide.animate({
                'left': ( slide_width ) * current * -1
            }, {
                duration: ts_slider_options.transition,
                complete: function() {
                    var player = $slide.eq(prevSlide).find('iframe');

                    if (typeof player !== 'undefined') {
                        player.attr('src', player.attr('src') + '&enablejsapi=1');
                    }
                    $slide.eq(current).addClass('current-active');
                }
            });

            if ( current === 0){
                $nav_arrows.eq(0).addClass('fade-me');
            }
            else if( current === $slide.size() - 1){
                $nav_arrows.eq(1).addClass('fade-me');
            }
        }        
    }
})(jQuery);

jQuery(document).ready(function($){

    if( jQuery('#watch-list-sidebar > .watch-playlist').length > 0 ){
        setTimeout(function(){
            var video_height = jQuery('#videoframe').height();
            jQuery('#watch-list-sidebar > .watch-playlist').css({height:video_height});
        }, 500);
    }

    ts_set_like();

    /* Widget Tabs */

    jQuery('.tabs-control > li > a').click(function () {
        var this_id = jQuery(this).attr('href'); // Get the id of the div to show
        var tabs_container_divs = '.' + jQuery(this).parent().parent().next().attr('class') + ' >  div'; // All of elements to hide
        jQuery(tabs_container_divs).hide(); // Hide all other divs
        jQuery(this).parent().parent().next().find(this_id).show(); // Show the selected element
        jQuery(this).parent().parent().find('.active').removeClass('active'); // Remove '.active' from elements
        jQuery(this).addClass('active'); // Add class '.active' to the active element
        return false;
    });

    jQuery('.toggle_title').click(function () {
        jQuery(this).next().slideToggle('fast');
        jQuery(this).find('.toggler').toggleClass('toggled');
    });

    jQuery('.tabs-switch li a').click(function () {
        var tab_id = jQuery(this).attr('href');
        if (jQuery(this).parent().parent().next().find(tab_id).is(':hidden')) {
            jQuery(this).parent().parent().find('li').removeClass('active');
            jQuery(this).parent().addClass('active');
            jQuery(this).parent().parent().next().find('div').hide('fast');
        }
        jQuery(this).parent().parent().next().find(tab_id).show('fast');
        return false;
    });

    var $container = jQuery('.shortcode_accordion > div'),
        $trigger = jQuery('.shortcode_accordion > h3');
    $container.hide();
    $trigger.first().addClass('toggled').next().show();
    $trigger.on('click', function (e) {
        if (jQuery(this).next().is(':hidden')) {
            $trigger.removeClass('toggled').next().slideUp(300);
            jQuery(this).toggleClass('toggled').next().slideDown(300);
        }
        e.preventDefault();
    });

    jQuery('.shortcode_infobox .close').click(function () {
        jQuery(this).parent().fadeOut(500);
    });

    if(jQuery('#post-video').find('iframe').length > 0){
        var option = getFrameSize('#post-video iframe');
    }

    jQuery('.video-single-resize').on('click', function(){
        var date = new Date();
        date.setTime(date.getTime() + (1 * 60 * 1000));
        if( jQuery('.video-featured-image > .container').hasClass('is-smaller') != true ){
            var videoType = 'small';
        }else{
            var videoType = 'big';
        }
        jQuery.cookie('ts_single_video_resize_type', videoType, { expires: date, path:'/' });

        ExpireCookie(1, 'ts_single_video_resize');
    });

    jQuery('a.videoPlay').on('click',function(event){
        event.preventDefault();
        setTimeout(function(){
            autoPlayVideo();
        },500)
    });

    $('#ts-show-login-modal').click(function(e){
        e.preventDefault();
       $('#ts-login-modal').modal('show');
        if( $('.ts-user-login-modal .modal-body .ts-login').hasClass('slideX') ){
            $('.ts-show-login-modal').trigger('click');
        }
    });
    $('#ts-show-register-modal').click(function(e){
        e.preventDefault();
        $('#ts-login-modal').modal('show');
        if( !$('.ts-user-login-modal .modal-body .ts-login').hasClass('slideX') ){
            $('.ts-show-register-modal').trigger('click');
        }
    });

    var content = $('.user-add-post-page');
    content.find('.ts-category-video, #ts-upload-video').hide(); //Video category selector initial hide

    content.find('select[name="ts-post-type"]').on('change', function(){
        if($(this).find('option:selected').val() == 'p'){ //if is post type
            $('.ts-category-video').hide();
            $('.ts-category-post').show();
            $('#ts-upload-video').hide();
        }else{
            $('.ts-category-post').hide();
            $('.ts-category-video').show();
            $('#ts-upload-video').show();
        }
    })

    $('.ts-show-register-modal, .ts-show-login-modal').click(function(e){
        e.preventDefault();
        $('.ts-user-login-modal .modal-body .ts-login').toggleClass('slideX');
        var data = {};
        if( $('.ts-user-login-modal .modal-body .ts-login').hasClass('slideX') ){
            $('.ts-user-login-modal .preloader').fadeIn();
            $(this).addClass('hidden').next().removeClass('hidden');
            data = {
                action: 'ts_get_register_form',
                nonce: VideoTouch.video_nonce
            };
            $.post( VideoTouch.ajaxurl, data, function(response) {
                if( response ) {
                    $('.ts-user-login-modal .preloader').fadeOut();
                    $('.ts-user-login-modal .modal-body .ts-form-register').append(response).find('.indicator').hide();
                    ts_ajax_request_new_user();

                    $('.ts-user-login-modal').find('form > .ts-form-group').each(function(){
                        var inputResult = $(this).children('label').html();
                        $(this).children('input').attr('placeholder',inputResult);
                    })
                    $('.ts-user-login-modal').find('.login-submit input[type="submit"]').attr('class','btn medium active');
                }

            });
        }else{
            $(this).addClass('hidden').prev().removeClass('hidden');
            $('.ts-user-login-modal .modal-body .ts-form-register').empty()
        }
    });

    if( jQuery('.ts-preroll').length > 0 ){
        jQuery('.featured-video').hide();
        resizePreRoll();
    }

    function resizePreRoll(){
        // Resize the pre-roll video
        var preRollContainerWidth = jQuery('.ts-preroll').parent().width();
        var preRollContainerHeight = preRollContainerWidth/1.777;

        // Set the sizes for pre-roll
        jQuery('.ts-preroll').width(preRollContainerWidth);
        jQuery('.ts-preroll').height(preRollContainerHeight);
        jQuery('.ts-preroll > .wp-video').width(preRollContainerWidth);
        jQuery('.ts-preroll > .wp-video').height(preRollContainerHeight);
        setTimeout(function(){
            jQuery('.ts-preroll > .wp-video > .mejs-container').width(preRollContainerWidth);
            jQuery('.ts-preroll > .wp-video > .mejs-container').height(preRollContainerHeight);
            jQuery('.ts-preroll .mejs-overlay').width(preRollContainerWidth);
            jQuery('.ts-preroll .mejs-overlay').height(preRollContainerHeight);
            jQuery('.ts-preroll .wp-video-shortcode').attr('width', preRollContainerWidth);
            jQuery('.ts-preroll .wp-video-shortcode').attr('height', preRollContainerHeight);
            jQuery('.ts-preroll .wp-video-shortcode').width(preRollContainerWidth);
            jQuery('.ts-preroll .wp-video-shortcode').height(preRollContainerHeight);
        }, 700);
    }

    function Countdown(options) {
        var timer,
        instance = this,
        seconds = options.seconds || 10,
        updateStatus = options.onUpdateStatus || function () {},
        counterEnd = options.onCounterEnd || function () {};

        function decrementCounter() {
            updateStatus(seconds);
            if (seconds === 0) {
              counterEnd();
              instance.stop();
            }
            seconds--;
        }

        this.start = function () {
            clearInterval(timer);
            timer = 0;
            seconds = options.seconds;
            timer = setInterval(decrementCounter, 1000);
        };

        this.stop = function () {
            clearInterval(timer);
        };
    }

    jQuery(document).on('click', '.ts-preroll-linkto', function(event){
        var contentVideoPreRoll = jQuery(this).closest('.ts-preroll');
        var timePreroll = jQuery(this).closest('.ts-preroll').attr('data-time');
        var prerollId = jQuery(this).closest('.ts-preroll').attr('data-id');

        jQuery.post(VideoTouch.ajaxurl, {
                action     : 'tsSetViewClickPreroll',
                ts_security: VideoTouch.video_nonce,
                prerollId  : prerollId,
                field      : 'click'
            }, function(data){
                return;
            }
        );
    });

    jQuery(document).on('click', '.ts-preroll .mejs-overlay-play', function(event){
        var thisContainer = jQuery(this).closest('.embedded_videos');
        var contentVideoPreRoll = jQuery(this).closest('.ts-preroll');
        var timePreroll = jQuery(this).closest('.ts-preroll').attr('data-time');
        var prerollId = jQuery(this).closest('.ts-preroll').attr('data-id');
        jQuery('.mejs-overlay.mejs-layer.mejs-overlay-play').remove();
        
        jQuery.post(VideoTouch.ajaxurl, {
                action     : 'tsSetViewClickPreroll',
                ts_security: VideoTouch.video_nonce,
                field      : 'view',
                prerollId  : prerollId
            }, function(data){
                return;
            }
        );

        setTimeout(function(){
            contentVideoPreRoll.remove();
            jQuery('.featured-video').show();
            jQuery('.videoPlay').click();
            jQuery('.mejs-play').click();
            if( jQuery('.embedded_videos iframe').length > 0 ){
                autoPlayVideo();
                if( jQuery('a.videoPlay').length > 0 ){
                    jQuery('a.videoPlay').click();
                }
            }
            if( VideoTouch.jwplayer == 'y' ){
                jwplayer('videoframe').play();
            }
        }, timePreroll * 1000);

        var myCounter = new Countdown({  
            seconds: timePreroll-1,  // number of seconds to count down
            onUpdateStatus: function(sec){
                jQuery('#pre-roll-counter span').text(sec);
            }, // callback for each second
            onCounterEnd: function(){
                resizeVideo();
            } // final action
        });

        myCounter.start();
        jQuery('#pre-roll-counter').delay(1000).fadeIn(200);

    });

    function ts_ajax_request_new_user(){
        var client = new XMLHttpRequest();

        $('#ts-btn-new-user').click( function(event) {
                
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
         
            jQuery('.ts-error-message').css('display', 'none');
            $('.ts-result-message').hide();
         
            var nonce        = $('#ts_new_user_nonce').val();
            var user         = $('#ts-username').val();
            var pass         = $('#ts-pass').val();
            var mail         = $('#ts-email').val();
            var name         = $('#ts-name').val();
            var nick         = $('#ts-nick').val();
            var url          = $('#ts-url').val();
            var description  = $('#ts-description').val();
            var img          = $('#ts-img-file').val();
            var data         = {};
            var emailRegEx   = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var errors       = 0;
            
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g,"");
            };

            if ( !emailRegEx.test(mail) )errors = errors + 1;

            if ( pass.trim() == '' || pass.length < 5 ) errors = errors + 1;
                
            if ( user.trim() == '' || user.length < 5 ) errors = errors + 1;
            
            if ( name.trim() == '' ) errors = errors + 1;

            if ( nick.trim() == '' ) errors = errors + 1;
            
            if( errors == 0 ){
                $('.indicator').show();

                data = {
                    action      : 'ts_register_user',
                    nonce       : nonce,
                    user        : user,
                    pass        : pass,
                    mail        : mail,
                    name        : name,
                    nick        : nick,
                    url         : url,
                    description : description,
                };

                $.post(VideoTouch.ajaxurl, data, function(response) {
             
                    if( response ) {
             
                        $('.indicator').hide();
                 
                        if( response === '1' ) {
                            jQuery('.ts-error-message').css('display', 'none');
                            $('#ts-success').css('display', '');
                            setTimeout(function(){
                                location.reload();
                            }, 1500);
                        } else {
                            jQuery('.ts-error-message').css('display', 'none');
                            $('.ts-result-message').html( response );
                            $('.ts-result-message').addClass('ts-alert-danger');
                            $('.ts-result-message').show();
                        }
                    }
                });
            }else{
                jQuery('.ts-error-message').css('display', '');
            } 
        });
    }

    if( jQuery('#ts-pass-confirme').length > 0 ){

        jQuery('#ts-pass-confirme').keyup(function(){
            if( jQuery('#ts-pass').val() !== jQuery(this).val() ){
                jQuery('#ts-notconfirm').removeClass('hidden');
                jQuery('#ts-confirm').addClass('hidden');
            }else{
                jQuery('#ts-confirm').removeClass('hidden');
                jQuery('#ts-notconfirm').addClass('hidden');
            }

            if( !jQuery('#ts-confirm').hasClass('hidden') ){
                setTimeout(function(){
                    jQuery('#ts-confirm').fadeOut('slow', function(){
                        jQuery('#ts-confirm').css('display', '').addClass('hidden');
                    });
                }, 4000);
            }

        });

        jQuery('#ts-pass-confirme').focusout(function() {
            if( jQuery('#ts-pass').val() !== jQuery(this).val() ){
                jQuery('#ts-notconfirm').removeClass('hidden');
                jQuery('#ts-confirm').addClass('hidden');
            }else{
                jQuery('#ts-notconfirm').addClass('hidden');
                if( jQuery('#ts-pass').val() !== jQuery('#ts-pass-confirme').val() ){
                    jQuery('#ts-confirm').removeClass('hidden');
                    setTimeout(function(){
                        jQuery('#ts-confirm').fadeOut('slow', function(){
                            jQuery('#ts-confirm').css('display', '').addClass('hidden');
                        });
                    }, 4000);
                }
            }
        });

        jQuery('#ts-btn-update-user').click(function(e){
            if( jQuery('#ts-pass').val() !== jQuery('#ts-pass-confirme').val() ){
                e.preventDefault();
            }
        });
    }

    $('.ts-vertical-menu').find('.menu-item-has-children').each(function(){
        var url_link = $(this).children('a').attr('href');
        $(this).children('a').attr('href','#');
        $(this).append('<span class="menu-item-url-link"><a href="'+url_link+'" title="View page"><i class="icon-link"></i></a></span>')
    });

    $('.menu-item-type-taxonomy').each(function(){
        if($(this).find('.ts_is_mega_div').length !== 0){
            $(this).addClass('menu-item-has-children is_mega');
        }
    })

    $('.ts-user-login-modal').find('form > p').each(function(){
        var inputResult = $(this).children('label').html();
        $(this).children('input').attr('placeholder',inputResult);
    })
    $('.ts-user-login-modal').find('.login-submit input[type="submit"]').attr('class','btn medium active');

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        if ( $(this).attr('data-video-type') == 'upload' ) {
            $('#ts-video-type').val('upload');
        } else{
            $('#ts-video-type').val('url');
        }
    });

    function ts_ajax_load_more(){

        $('.ts-pagination-more').click(function(){
            var loop            = parseInt( $(this).attr('data-loop') );
            var args            = $(this).attr('data-args');
            var paginationNonce = $(this).find('input[type="hidden"]').val();
            var loadmoreButton  = $(this);
            var $container      = $(this).prev();

            // Show preloader
            $('#ts-loading-preload').show();
            
            jQuery.post(VideoTouch.ajaxurl, {
                    action         : 'ts_pagination',
                    args           : args,
                    paginationNonce: paginationNonce,
                    loop           : loop 
                },  function(data){
                        if( data !== '0' ){
                            if( $container.hasClass('ts-filters-container') ){
                                var data_content = $(data).appendTo($container);
                                $container.isotope('appended', $(data_content));
                                setTimeout(function(){
                                    $container.isotope('layout');
                                },1200);
                            }else{
                                $container.append($(data));
                            }
                            loadmoreButton.attr('data-loop', loop + 1);
                            ts_get_video_modal_ajax();
                            echo.init({
                                offset: 100,
                                throttle: 250,
                                unload: false,
                                callback: function (element, op) {
                                    if( op === 'load' ){
                                        setTimeout(function(){
                                            $container.isotope('layout');
                                        },1200);
                                    }
                                }
                            });
                        }else{
                            loadmoreButton.remove();
                        }
                        // Hide the preloader
                        $('#ts-loading-preload').hide();
                    }
            );
        });
    }
    ts_ajax_load_more();
    ts_get_video_modal_ajax();

    //circle share effect on single video page
    $('.post-share-box-circle').find('label').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('shown');
    });

    function ts_send_date_ajax(id){

        $(document).on('click', '.contact-form-submit', function(event) {
            event.preventDefault();
            
            var form         = $(this).closest('form'),
                name         = form.find('.contact-form-name'),
                email        = form.find('.contact-form-email'),
                subject      = form.find('.contact-form-subject'),
                message      = form.find('.contact-form-text'),
                emailRegEx   = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                errors       = 0,
                custom_field = form.find('.ts_contact_custom_field'),
                data         = {},
                this_element = jQuery(this);

            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g,"");
            };

            if ( emailRegEx.test(email.val()) ) {
                email.removeClass('invalid');
            } else {
                email.addClass('invalid');
                errors = errors + 1;
            }

            jQuery(custom_field).each(function(i,val){
                if(jQuery(this).hasClass('contact-form-require')){
                    if (jQuery(this).val().trim() !== '') {
                        jQuery(this).removeClass('invalid');
                    } else {
                        jQuery(this).addClass('invalid');
                        errors = errors + 1;
                    }
                }
            });

            if (name.val().trim() !== '') {
                name.removeClass('invalid');
            } else {
                name.addClass('invalid');
                errors = errors + 1;
            }


            if ( subject.length !== 0 ) {
                if (subject.val().trim() !== '') {
                    subject.removeClass('invalid');
                } else {
                    subject.addClass('invalid');
                    errors = errors + 1;
                }
            }

            if (message.val().trim() !== '') {
                message.removeClass('invalid');
            } else {
                message.addClass('invalid');
                errors = errors + 1;
            }
            
            if ( errors === 0 ) {

                data['action']  = 'videotouch_contact_me';
                data['token']   = VideoTouch.contact_form_token;
                data['name']    = name.val().trim();
                data['from']    = email.val().trim();
                data['subject'] = (subject.length) ? subject.val().trim() : '';
                data['message'] = message.val().trim();
                data['custom_field'] = new Array();

                jQuery(custom_field).each(function(i,val){
                    var title = jQuery(this).next().val();
                    var value = jQuery(this).val();
                    var require = jQuery(this).next().next().val();
                    var new_item = {value : value, title: title, require: require};
                    data['custom_field'].push(new_item);
                });

                $.post(VideoTouch.ajaxurl, data, function(data, textStatus, xhr) {
                    form.find('.contact-form-messages').html('');
                    console.log(data.status);
                    if ( data !== '-1' ) {
                        if ( data.status === 'ok' ) {
                            form.find('.contact-form-messages').removeClass("hidden").html(VideoTouch.contact_form_success).addClass('success');
                            jQuery(this_element).attr('disabled', 'disabled');
                            form.find("input, textarea").not(".contact-form-submit").val('');
                        } else {
                            form.find('.contact-form-messages').removeClass("hidden").html('<div class="invalid">' + data.message + '</div>');
                        }

                        if ( typeof data.token !== "undefined" ) {
                            VideoTouch.contact_form_error = data.token;
                        }

                    } else {
                        form.addClass('hidden');
                        form.find('.contact-form-messages').html(VideoTouch.contact_form_error);
                        $(clickElement).removeAttr('disabled');
                    }
                });
            }
        });
    }
    ts_send_date_ajax();

});

   
jQuery(window).load(function() {

    echo.init({
        offset: 100,
        throttle: 250,
        unload: false,
        callback: function (element, op) {
            if( op === 'load' ){
                setTimeout(function(){
                    if( jQuery(".ts-filters-container").length > 0 ){
                        jQuery(".ts-filters-container").isotope('layout');
                    }
                },500);
            }
        }
    });

    initCarousel();
    animateArticlesOnLoad();
    animateBlocksOnScroll();
    visibleBeforeAnimation();
    activateStickyMenu();
    filterButtonsRegister();
    hidePreloader();
    twitterWidgetAnimated();
    resizeVideo();
    fb_comments_width();
    alignElementVerticalyCenter();
    showMosaic();
    alignMegaMenu();
    videoPostShow();
    singleVideoResize();

    // If onepage layout - run the onepage menu
    if ( ts_onepage_layout == 'yes' ) {
        startOnePageNav();
    }

    jQuery('.flexslider').each(function(){
        var nav_control;
        if( jQuery(this).hasClass('with-thumbs') ){
            nav_control = 'thumbnails';
        } else{
            nav_control = 'none';
        }
        var nav_animation = jQuery(this).attr('data-animation');
        jQuery(this).flexslider({
            animation: nav_animation,
            controlNav: nav_control,
            prevText: "",
            nextText: "",
            smoothHeight: true
            
        });
    });

    jQuery('.panel-heading a[data-toggle="collapse"]').on('click', function(){
        var panelCollapse = jQuery(this).parent().next();
        if ( panelCollapse.hasClass('in')) {
            jQuery(this).find('i').css({
                '-webkit-transform': 'rotate(0deg)',
                '-o-transform': 'rotate(0deg)',
                '-mz-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            })
        } else {
            jQuery(this).find('i').css({
                '-webkit-transform': 'rotate(90deg)',
                '-o-transform': 'rotate(90deg)',
                '-mz-transform': 'rotate(90deg)',
                'transform': 'rotate(90deg)'
            })
        }
    });

    jQuery('.megaWrapper').each(function(){
        if( jQuery(this).hasClass('ts-behold-menu') ){
            jQuery(this).removeClass('ts-behold-menu').addClass('ts-mega-menu');
        }
        jQuery(this).find('.ts_is_mega_div .sub-menu').addClass('ts_is_mega');
        jQuery(this).find('.ts_is_mega_div').parent().addClass('is_mega');
    });

}); //end load function
