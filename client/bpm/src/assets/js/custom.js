;
(function ($) {
    "use strict";

    $.fn.exists = function (callback) {
        var args = [].slice.call(arguments, 1);
        if (this.length) {
            callback.call(this, args);
        }
        return this;
    };

    $.fn.menuWhichSide = function () {
        this.exists(function () {
            var offset = this.offset();
            var posX = offset.left - $(window).scrollLeft() + 250;
            var posXToRight = $(window).width() - posX;
            if (posXToRight < 0) {
                this.addClass('pull-inverse')
            }
        });
        return this;
    };

    var globalUtilities = {
        init: function () {
            this.optimizeFooter();
        },
        optimizeFooter: function () {
            var bodyHeight = $('body').height();
            var windowHeight = window.innerHeight;
            if (windowHeight >= bodyHeight) {
                $('.site-footer').addClass('is-fixed');
            } else {
                $('.site-footer').removeClass('is-fixed');
            }
        }
    };

    var navbar = {
        init: function () {
            //navbar.sticky();
            navbar.baseLevelMenuHover();
            navbar.subMenuHover();
            navbar.mobileMenu();
        },
        sticky: function () {
            $(".sp-header").sticky({
                'wrapperClassName': 'sp-header-wrapper'
            });
        },
        baseLevelMenuHover: function () {
            $.fn.menuWhichSide = function () {
                this.exists(function () {
                    var offset = this.offset();
                    var posX = offset.left - $(window).scrollLeft() + 250;
                    var posXToRight = $(window).width() - posX;
                    if (posXToRight < 0) {
                        this.addClass('pull-inverse')
                    }
                });
                return this;
            };
            $('.entry-site-primary-menu, .entry-user-menu').children('li').on({
                mouseenter: function (e) {
                    if (window.innerWidth < 768) return;
                    $(this).children('ul')
                    .css({display: "block"})
                    .menuWhichSide()
                    .stop()
                    .animate({
                        opacity: 1,
                        'margin-top': 0
                    }, {
                        duration: 300
                    });
                },
                mouseleave: function (e) {
                    if (window.innerWidth < 768) return;
                    $(this).children('ul')
                    .stop()
                    .animate({
                        opacity: 0,
                        'margin-top': -15
                    }, {
                        duration: 300,
                        complete: function () {
                            $(this).css({display: "none"});
                        }
                    });
                }
            });
        },
        subMenuHover: function () {
            $('.entry-site-primary-menu, .entry-user-menu').children('ul').children('li').each(function () {
                $(this).find('ul').first().find('li').on({
                    mouseenter: function (e) {
                        $(this).find('ul').first()
                        .css({display: "block"})
                        .stop()
                        .animate({
                            opacity: 1
                        }, {
                            duration: 300
                        });
                    },
                    mouseleave: function (e) {
                        $(this).find('ul').first()
                        .stop()
                        .animate({
                            opacity: 0
                        }, {
                            duration: 300,
                            complete: function () {
                                $(this).css({display: "none"});
                            }
                        });
                    }
                })
            });
        },
        mobileMenu: function () {
            $('#siteHeader .site-mobile-nav-toggle').on('click', function (e) {
                var $togglingArea = $('.entry-bottom-bar');
                if ($togglingArea.css('display') != 'block') {
                    $(this).addClass('is-open');
                    $togglingArea.show();
                } else {
                    $(this).removeClass('is-open');
                    $togglingArea.hide();
                }
                e.stopPropagation();
            });
            // Sub-menu
            $('#siteHeader .entry-caret').on('click', function (e) {
                var $parentMenu = $(this).parent(),
                    $subMenu    = $parentMenu.children('.entry-sub-menu');
                if ($subMenu.css('display') != 'block') {
                    $parentMenu.addClass('is-open');
                    $subMenu.show();
                } else {
                    $parentMenu.removeClass('is-open');
                    $subMenu.hide();
                }
                e.stopPropagation();
            });
        }
    };

    var backToTop = (function () {
        var init = function () {
            // Scroll (in pixels) after which the "To Top" link is shown
            var offset         = 300,
                //Scroll (in pixels) after which the "back to top" link opacity is reduced
                offset_opacity = 1200,
                //Get the "To Top" link
                $back_to_top   = $('#site-back-to-top');

            //Visible or not "To Top" link
            $(window).scroll(function () {
                if ($(this).scrollTop() > offset) {
                    $back_to_top
                    .css({display: "block"})
                    .stop()
                    .animate({
                        opacity: 0.5,
                    }, {
                        duration: 100,
                        easing: "easeOutExpo"
                    });
                } else {
                    $back_to_top
                    .stop()
                    .animate({
                        opacity: 0,
                    }, {
                        duration: 100,
                        easing: "easeOutExpo",
                        complete: function () {
                            $(this).css({display: "none"});
                        }
                    });
                }
                if ($(this).scrollTop() > offset_opacity) {
                    $back_to_top.addClass('top-fade-out');
                }
            });

            //Smoothy scroll to top
            $back_to_top.on('click', function (event) {
                $("html, body").animate({scrollTop: 0}, 1000, "easeInOutExpo");
                event.preventDefault();
            });
        };
        return {
            init: init
        }
    })();

    var slider = (function () {
        var init = function () {

        };
        return {
            init: init
        }
    })();

    var formValidate = (function () {
        var init = function () {
            // $.validator.addMethod("valueNotEquals", function(value, element, arg) {
            //     return arg != value;
            // }, "Value must not equal arg.");

            // $('#add-new-user-form').validate();
            // $('#add-new-case-form').validate();
            // $('#manage-time-points-form').validate({
            //     rules: {
            //         cost: {
            //             required: true,
            //             number: true
            //         },
            //         saving: {
            //             required: true,
            //             number: true
            //         }
            //     }
            // });
        };
        return {
            init: init
        }
    })();

    var other = {
        init: function () {
            // $('.psb').perfectScrollbar();
            // this.wowAnimation();
        },
        wowAnimation: function () {
            // Appear Animation
            var wow = new WOW({
                boxClass: 'tb-wow',
                offset: 200,
            }).init();
        }
    };

    // DOM READY
    $(document).ready(function () {
        globalUtilities.init();
        navbar.init();
        slider.init();
        backToTop.init();
        formValidate.init();
        other.init();
    });

    $(window)
    .on('load', function () {
        globalUtilities.init();
    })
    .on('resize', function () {
        globalUtilities.init();
    })


})(jQuery); // EOF