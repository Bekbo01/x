function setTranslateText($this) {
    var note = $this.data('note');

    if (note in translate) {
        note = translate[note];
    }

    $this
        .html(note)
        .removeAttr('data-note');
}

function setTranslateChildText($parent) {
    $('[data-note]', $parent).each(function () {
        setTranslateText($(this));
    });
}

function getSearchResults() {
    $('.search_results').hide();
    $('.search_results').html('');
    $.ajax({
        type: "POST",
        data: { action: 'quick_search', search: q },
        success: function (data) {
            var res = $.parseJSON(data);
            if (res.return !== '') {
                $('.search_results').html(res.return);
                $('.search_results').show();
            } else {
                $('.searcfh_results').hide();
            }
        }
    });
}

function lazy() {
    $('.lazyimage').lazy({
        effect: 'fadeIn',
        visibleOnly: false,
        threshold: 200,
        delay: 200,
        afterLoad: function (element) {
            element.attr('style', '');
            element.removeClass('lazyimage');
        }
    });
}

function masks() {
    $('input.phone').off();
    $('input.phone, input[name=phone]').inputmask('+7-999-999-99-99');
    $('.confirm').off();
    $('.confirm').inputmask('9999');
    $('.mask-card-number').off();
    $('.mask-card-number').inputmask('9999 9999 9999 9999 9999', { placeholder: " " });
    $('.mask-card-cvv').off();
    $('.mask-card-cvv').inputmask('9999', { placeholder: " " });
    $('.mask-card-exp').off();
    $('.mask-card-exp').inputmask('99', { placeholder: " " });
    $('.mask-card-cardholder').off();
    $('.mask-card-cardholder').inputmask({ regex: "[a-zA-Z- ]*", casing: "upper" });
}

function doPrepay() {
    var amount = $('#prepay_amount').val();
    var name = $('#prepay_name').val();
    $.ajax({
        type: "POST",
        data: { action: 'prepay', amount: amount, name: name },
        success: function (data) {
            var res = $.parseJSON(data);
            if (res.result == 1) {
                $('#prepay_btn').attr('href', res.href);
                $('#prepay_btn').show();
            } else {
                $('#prepay_btn').hide();
            }
        }
    });
}

function showSearch() {
    $('#mobile_search').toggle();
    $('#mobile_search .search_input').focus();
}

function hiddenSearch() {
    $('#mobile_search').hide(0);
}

function showFullOne() {
    $('#basic-menu-nav').toggle();
    $('#full-one').toggle();
}

function showLanguage() {
    $('#basic-menu-nav').toggle();
    $('#language-one').toggle();
}

function showCities() {
    $('#basic-menu-nav').toggle();
    $('#city-one').toggle();
}

function cartStep(id) {

    var ok = 1;
    $('#order_form .step-current input, #order_form .step-current textarea').each(function () {
        if ($(this).prop('required')) {
            var value = $(this).val();
            if (value == "") {
                $(this).addClass('err');
                ok = 0;
                console.log($(this))
            } else if (typeof value == "undefined") {
                $(this).addClass('err');
                ok = 0;
                console.log($(this))
            } else {
                $(this).removeClass('err');
            }
        }
    });

    if (!ok) {
        //$('.err')[0].focus();
        $('#order_form input').focus();
        return false;
    }

    $('.step-current').removeClass('step-current');

    $('.step_point').each(function () {
        var this_id = $(this).attr('id');
        if (id == this_id) {
            $(this).show();
            $(this).addClass('step-current');
        } else {
            $(this).hide();
        }
    });
    $('html, body').animate({
        'scrollTop': parseInt($('#' + id).offset().top) - 50
    }, 200);
}

function plusRate(id) {
    $.ajax({
        type: "POST",
        data: { action: 'rate', id: id, where: 'plus' },
        success: function (data) {
            var res = $.parseJSON(data);
            if (res.result == 1) {
                var current = parseInt($('.comment-rate[data-id="' + id + '"]').find('.the_rate').html());
                current++;
                $('.comment-rate[data-id="' + id + '"]').find('.the_rate').html(current);
            }
        }
    });
}

function minusRate(id) {
    $.ajax({
        type: "POST",
        data: { action: 'rate', id: id, where: 'minus' },
        success: function (data) {
            var res = $.parseJSON(data);
            if (res.result == 1) {
                var current = parseInt($('.comment-rate[data-id="' + id + '"]').find('.the_rate').html());
                current--;
                $('.comment-rate[data-id="' + id + '"]').find('.the_rate').html(current);
            }
        }
    });
}

var timer = 0;
var q = '';
var close = 1;

function untoggleAll() {
    $('.filter-vars').show();
}

function cityCheck() {
    var check = Cookies.get('visit-start');
    if (typeof check == "undefined") {
        Cookies.set('visit-start', 'visited');
        $('#your-city').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            },
            btnTpl: {
                close: ''
            },
            'autoSize': false,
            padding: 0
        }).click();
    }
}


// функция проверки ширины
function is_width(width) {
    return window.matchMedia("(max-width: " + width + "px)").matches;
}



if (is_width(767) && $('.div_to_load_products').length) {

    var lastScrollTop = 0,
        $body = $('body');

    $body.addClass('is_catalog');

    window.addEventListener("scroll", function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
            $body.attr('data-scroll_dir', 'down');
        } else {
            $body.attr('data-scroll_dir', 'up');
        }

        lastScrollTop = st <= 0 ? 0 : st;
    }, false);

}

$(document).ready(function () {

    cityCheck();
    masks();
    favShow();

    /*$.getScript('https://kaspi.kz/kaspibutton/widget/ks-wi_ext.js', function () {
        console.log('ddd')
        ksWidgetInitializer.reinit()
    })*/

    if (!is_width(1199)) {
        var $window = $(window),
            $header = $('.header-fixed'),
            headerTop = $('.header-wrap').height();

        $window.scroll(function () {
            scroll_header_fixed($header, headerTop);
        });
    }

    var $notes = $('.note-load[data-note]');
    if ($notes.length) {
        $notes.each(function () {
            setTranslateText($(this));
        });
    }

    $('body').on('click', '.btn-fast-buy', function () {
        var id = $(this).attr('data-id');

        $('#one_click_product').val(id);
        reachGoal('ym_goal_open_kupit_v_1_klik');
    });

    /*$('body').on('blur', '.credit-kaspi iframe', function () {
        console.log('dddddddd');
    })

    $('body').on('click', function () {
        console.log('dddddddd');
    })*/

    /*$('.hover-nav li>a').on('mouseenter', function() {
        var $this  = $(this),
            $promo = $this.next('.hover-nav');
        
        if (!$promo.length) {
            return false;
        } 
        
        $('#hover_sub_menu .paster__').html( $promo.html() );
        $('#hover_sub_menu').show(100);
    });
    
    $('.hover-nav li>a').on('mouseleave', function(e) {        
        if (!$(e.relatedTarget).hasClass('nav-advert')) {
            $('#hover_sub_menu').hide(0);    
        }        
    });
    */
    $('body').on('click', '.how-pick-bike', function () {
        $.fancybox.open($('#pick_bike'));
    });

    $('#mobile_nav .fav-block').click(function () {
        $('.product-in-btn-price .fav').trigger('click');
    });

    $('.faq .faq-question').click(function () {
        var $faq = $(this).closest('.faq');

        if ($faq.hasClass('open')) {
            $faq.removeClass('open');
        } else {
            $faq
                .closest('.faqs')
                .find('.faq.open')
                .removeClass('open')
                ;

            $faq.addClass('open');
        }
    });

    $('.spoiler-button').click(function () {
        var $this = $(this),
            next = $this.data('next');

        $this.closest('.spoiler').toggleClass('active');

        $this.data('next', $this.text());
        $this.text(next);
    })

    $('#mobile_nav #slide_menu .hover-parent > a i').click(function () {
        var $closest = $(this).closest('li');

        if ($('ul li', $closest).length) {
            $closest.toggleClass('active');
            return false;
        }
    });

    $('.sorter, .period-selector').click(function () {
        $(this).toggleClass('active');
    });

    $('.filter_mobile .side-heading').click(function () {
        $('.filter_mobile').hide(0);
    })


    $('#prepay_name, #prepay_amount').keyup(function () {
        doPrepay();
    });

    action = 'click';

    if ($(window).width() < 999) {
        //action = 'touchstart';
    }

    $('.city-sel').on(action, function () {
        var oldCity = Cookies.get('city'),
            newCity = $(this).data('city'),
            url = window.location.pathname,
            exec = ['/sitemap', '/cart', '/done', '/favourites', '/difference', '/lk', '/search'];

        Cookies.set('city', newCity);

        if ('/' == url) {
            url = url + newCity;
        } else if (oldCity == 'catalog') {
            url = '/' + newCity + url;
        } else if (oldCity && -1 == $.inArray(url, exec)) {
            url = url.replace(
                new RegExp(oldCity, 'i'),
                newCity
            );
        } else {
            window.location.reload();
            return;
        }

        //console.log(url)                     

        window.location.href = url;
    });


    if ($(window).width() < 1200) {
        $('.filter_main:not(.filter_mobile)').remove();
    } else {
        $('.filter_main.filter_mobile').remove();
    }

    $('.filter_header').on('click', function () {
        $(this).closest('.list-group').find('.filter-vars').toggle();
    });
    $('.search_input').keyup(function () {
        q = this.value;
        getSearchResults();
    });

    $('.search_input').focusout(function () {
        if (close == 1) {
            $(".search_results").hide();
        }
    });
    $('.search_input').focusin(function () {
        var content = $(".search_results").html();
        if ($.trim(content) !== "") {
            $(".search_results").show();
        }
    });
    $(".search_results").mouseover(function () {
        close = 0;
    }).mouseout(function () {
        close = 1;
    });
});

var pressedKeys = [];

window.onload = function () {
    ui_inputs();
};

$('.credit_btn_apply').click(function () {
    $this = $(this);

    creditApply(
        $this.attr('data-product'),
        $this.attr('data-period')
    );

    reachGoal('ym_goal_rassrochka_form');
});

function creditApply(id, period) {

    $('#credit_product').val(id);
    $('#period').val(period);

    $.fancybox.open($('#credit_form'),
        {
            'autoScale': true,
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'speedIn': 500,
            'speedOut': 300,
            'autoDimensions': true,
            'centerOnScroll': true,
            'padding': 0,
            'beforeShow': function (instance, current) {
                setTranslateChildText($(current.src));
            }
        });
}


function showCartMessage(content) {
    $('#addedtocart .pop-up-form').html(content);
    $.fancybox.open($('#addedtocart'),
        {
            'autoScale': true,
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'speedIn': 500,
            'speedOut': 300,
            'autoDimensions': true,
            'centerOnScroll': true,
            'padding': 0
        });
    setTimeout(function () {
        startTheOwl($('#addedtocart .owl-carousel'));
    }, 500);

}





var clicked_load = 0;
$(window).scroll(function () {

    if ($('#load_more').length > 0) {
        var load = $('#load_more');
        var current = $(window).height() + $(document).scrollTop();
        var offset = parseInt(load.offset().top);
        var do_click = parseInt(offset + 150);
        var no_click = parseInt(offset - 150);

        /*
        if (offset !== clicked_load) {
            if (no_click < current) {
                if (do_click > current) {
                    clicked_load = offset;
                    
                    load.click();
                    load.hide();
                }
            }
        }
        */
    }





    if ($(this).scrollTop() > 100) {
        if ($('.back-to-top').is(':hidden')) {
            $('.back-to-top').css({ opacity: 1 }).fadeIn('slow');
        }
    } else { $('.back-to-top').stop(true, false).fadeOut('fast'); }
});



function subscribe(btn) {
    var holder = $(btn).closest('.sub-block');
    var email = holder.find('.email').val();
    var ok = 1;

    if (holder.find('#checkbox').length) {
        if (!holder.find('#checkbox').is(':checked')) {
            ok = 0;
        }
    }
    keys = pressedKeys.join(',');
    if (ok == 1) {
        $.ajax({
            type: 'POST',
            data: { keys: keys, email: email, action: 'subs' },
            success: function (data) {
                var obj = jQuery.parseJSON(data);
                if (obj.result == 1) {
                    holder.html(obj.message);
                }
            }
        });
    }
}



$(document).ready(function () {

    $('.brand-holder').on('click', function () {
        $('.brand-holder').removeClass('active');
        var desc = $(this).find('.brand-desc-content').html();

        $('#brand-description-block').html(desc);
        $(this).addClass('active');
    });

    if ($('.article').length) {
        var ToC =
            "<nav role='navigation' class='table-of-contents'><span>Содержание:</span><ul>";
        var newLine, el, title, link, subel, subtitle, subid, id, sublink;
        var i = 0;

        var add = 0;
        $(".article h2").each(function () {
            add = 1;
            el = $(this);
            title = el.text();
            id = el.attr("id");
            if (typeof id == "undefined") {
                id = 'h2' + i;
                $(this).attr('id', id);
            }
            link = "#" + id;

            newLine = "<li><a href='" + link + "'>" + title + "</a>";

            ToC += newLine;

            var j = 0;
            var subs = '';
            $(this).nextAll().each(function () {

                if (this.tagName == 'H2') {
                    return false;
                } else {
                    if (this.tagName == 'H3') {
                        subel = $(this);
                        subtitle = subel.text();
                        subid = subel.attr("id");
                        if (typeof subid == "undefined") {
                            subid = 'h3' + j;
                            $(this).attr('id', subid);
                        }
                        sublink = "#" + subid;

                        subs += "<li><a href='" + sublink + "'>" + subtitle + "</a></li>";
                        j++;
                    }
                }
            });

            if (subs !== '') {
                ToC += '<ul>' + subs + '</ul>';
            }

            ToC += "</li>";
            i++;
        });

        ToC +=
            "</ul>" +
            "</nav>";

        if (add == 1) {
            ///$(".article").prepend(ToC);
        }
    }

    $('[data-toggle="popover"]').popover();
    $(document).mouseup(function (e) {
        var container = $(".popover-content");
        container.off();
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('[data-toggle="popover"]').popover('hide');
        }
    });

    $('#the_slider').carousel();;

    $('.ui_input').bind("keyup change", function (e) {
        val = $(this).val();
        val = val.replace(/./g, '*');
        val = $.trim(val);
        if (val.length > 0) {
            if (!$(this).closest('.ui_label_group').hasClass('ui_has_value')) {
                $(this).closest('.ui_label_group').addClass('ui_has_value');
            }
        } else {
            if ($(this).closest('.ui_label_group').hasClass('ui_has_value')) {
                $(this).closest('.ui_label_group').removeClass('ui_has_value');
            }
        }
    });
    $('.lazy').Lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        onError: function (element) {
            console.log('error loading ' + element.data('src'));
        }
    });
    $('body').bind("keypress", function (e) {
        pressedKeys[pressedKeys.length] = e.keyCode;
    });
    $('input[type="submit"]').bind("click", function (e) {
        pressedKeys[pressedKeys.length] = 'clicked_submit';
    });

    $('.carousel').carousel();



    $('.search_input').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            id = $(this).closest('form').attr('id');
            searchIt(id);
        }
    });

    $(".btn-nav").on("click tap", function () {
        hiddenSearch();
        $(".nav-content").toggleClass("showNav hideNav").removeClass("hidden");
        $(this).toggleClass("animated");
    });

    $(".toggle_button").on("click tap", function () {
        var what = $(this).attr('what');
        $("." + what).slideToggle("fast", function () {
        });
    });

    $('.search_cat').on('click', function () {
        if ($('.search_cat').hasClass('open')) {
            $('.search_cat').removeClass('open');
        } else {
            $('.search_cat').addClass('open');
        }
    });

    $('.shorty_more').on('click', function () {
        $('html, body').animate({
            scrollTop: $("#desc_line").offset().top
        }, 1000);
    });

    $('.brand-nav').on('click', function () {
        var link = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(link).offset().top
        }, 1000);
    });

    $('.zoomer').click(function () {
        $('#launch_the_show').click();
    });

    loadDifferentCarousel();

    $('.ajax_submit_reload').submit(function (e) {
        e.preventDefault();
        showPreloader();
        id = $(this).attr('id');
        keys = pressedKeys.join(',');
        var m_method = $(this).attr('method');
        var m_action = $(this).attr('action');
        var m_data = $(this).serialize();
        $.ajax({
            type: m_method,
            url: m_action,
            data: m_data + '&keys=' + keys,
            success: function (data) {
                var obj = jQuery.parseJSON(data);
                $('#' + id + '_result').html(obj.message);
                if (obj.result == 1) {
                    location.reload();
                } else {
                    hidePreloader();
                    $('#' + id + '_result').focus();
                }
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                console.log(msg);
            }
        });
    });

    $('.order-calling').click(function () {
        reachGoal('ym_goal_call');
    })

    $('.ajax_submit').submit(function (e) {
        e.preventDefault();
        showPreloader();
        var $this = $(this);
        var id = $this.attr('id');
        keys = pressedKeys.join(',');
        var m_method = $this.attr('method');
        var m_action = $this.attr('action');
        var m_data = $this.serialize();

        console.log(m_action);

        $.ajax({
            type: m_method,
            url: m_action,
            data: m_data + '&keys=' + keys,
            success: function (data) {

                var obj = jQuery.parseJSON(data);
                $('#' + id + '_result').html(obj.message);
                hidePreloader();
                $('#' + id + '_result').focus();

                if (typeof obj.url != 'undefined') {
                    window.open(obj.url, "_blank");
                }
                  
                if ($this.is('#credit_apply')) {
                    reachGoal('ym_goal_rassrochka_sent');
                }

                if ($this.is('#one-click-buy')) {
                    reachGoal('ym_goal_send_kupit_v_1_klik');
                }
                if ($this.is('#contacts_form')) {
                   track('send_support');
                }
                if ($this.is('#order_this_product')) {
                   track('send_on_request');
                }
                if ($this.is('#the_recall_form')) {
                    reachGoal('ym_goal_confirm_call');
                }
            }
        });
    });

    $('input.phone').keydown(function (event) {
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9
            || event.keyCode == 27 || event.keyCode == 13
            || (event.keyCode == 65 && event.ctrlKey === true)
            || (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        } else {
            // If it's not a number stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }
    });




});

dynamicFunctions();


function startTheOwl(the_carousel) {
    if (the_carousel.attr('thumbs') != undefined) {
        var th = true;
    } else {
        var th = false;
    }

    var items_count = parseInt(the_carousel.find('.item').length);
    var loop = the_carousel.attr('loop');
    var margin = parseInt(the_carousel.attr('margin'));
    var zero = parseInt(the_carousel.attr('zero'));
    var six = parseInt(the_carousel.attr('six'));
    var ten = parseInt(the_carousel.attr('ten'));

    if (items_count > ten) {
        var nav_ten_state = true;
    } else {
        var nav_ten_state = false;
    }
    if (items_count > six) {
        var nav_six_state = true;
    } else {
        var nav_six_state = false;
    }
    if (items_count > zero) {
        var nav_zero_state = true;
    } else {
        var nav_zero_state = false;
    }

    the_carousel.on('initialized.owl.carousel', function (e) {
        updateNumbers(e.page.index, e.page.count, the_carousel);
    });

    the_carousel.owlCarousel({
        thumbs: th,
        thumbImage: th,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item',
        margin: margin,
        loop: true,
        freeDrag: false,
        responsiveClass: true,
        slideBy: 'page',
        responsive: {
            0: {
                items: zero,
                pagination: false,
                nav: nav_zero_state,
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            },
            600: {
                items: six,
                pagination: false,
                nav: nav_six_state,
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
            },
            1000: {
                items: ten,
                pagination: false,
                nav: nav_ten_state,
                navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
            }
        }
    });
    the_carousel.on('changed.owl.carousel', function (e) {
        updateNumbers(e.page.index, e.page.count, the_carousel);
    });
}

function updateNumbers(index, total, the_carousel) {
    if (parseInt(total) > 1) {
        var current = parseInt(index) + 1;
        the_carousel.find('.carousel-counter').remove();
        the_carousel.append('<div class="carousel-counter"><strong>' + current + '/</strong>' + total + '</div>');
    }
}

function showPreloader() {
    $('#preloader').show();
}

function hidePreloader() {
    $('#preloader').hide();
}

function showFilterOnMobile() {
    $('#filter_main').removeClass('hidden-xs');
    $('#filter_main').removeClass('hidden-sm');
    $('#filter_show_button').addClass('hidden-xs');
    $('#filter_show_button').addClass('hidden-sm');
}

function cartSum(sum, amount) {
    if (sum > 0) {
        if ($('#cart_li').hasClass('inactive')) {
            $('#cart_li').removeClass('inactive');
        }
    }
    if (!isNaN(sum)) {
        sum = thousandSeparator(sum);
    }
    $('.my_cart_sum').html(sum);
    $('.my_cart_count').html(amount);
    $('.cart_total_sum').html(sum);

}

$('.scroll-top').click(function () {
    $('body,html').animate({ scrollTop: 0 }, 1000);
})

$('.to-desc').click(function () {
    var link = $(this).attr('href');
    var posi = $(link).offset().top;
    $('body,html').animate({ scrollTop: posi }, 700);
});

function showMeSomething(id, group) {
    $.ajax({
        type: 'POST',
        data: { id: id, action: 'preview', group: group, local: '<?=$link_local;?>' },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            $('.the_preview').html(obj.preview);
            $.fancybox('#product_preview', { padding: 0 });
        }
    });
}

function askAboutProduct(id, cat) {
    $('#product_question #question_product').val(id);
    $('#product_question #question_cat').val(cat);

    setTranslateChildText($('#product_question'));

}

$('[data-toggle="tooltip"]').tooltip({ container: 'body', html: true, trigger: 'click' });



$(".popup_image").fancybox({
    'padding': '0'
});

$(".gal_loader").fancybox({
    padding: 0,
    helpers: {
        title: {
            type: 'outside'
        },
        thumbs: {
            width: 50,
            height: 50
        }
    }
});

$(".service_gallery").fancybox();

$(".give-us-your-feedback").click(function () {
    $(".leave-feedback").slideToggle("slow", function () {
        // Animation complete.
    });
    $(".hide-button").slideToggle("slow", function () {
        // Animation complete.
    });
});


function productComment(id) {
    setTranslateChildText($('#leave_product_feed'));
    $('#leave_product_feed').find('#product-id').val(id);
}

function showDelVariants() {
    $('input[name="delivery"]').prop('checked', false);
    $('#togglable_deliveries_table').toggle('3000');
    $('#togglable_deliveries_button').toggle('3000');
    $('#delivery_info_block').empty();
    $('#order_form_to_submit').empty();
}

function showHiddenFilter(what, show, hide) {
    $(what).slideToggle("fast", function () { });
    $(show).show()
    $(hide).hide();
}
function exit() {
    $.ajax({
        type: 'post',
        data: { action: 'logout' },
        success: function (data) {
            location.reload();
        }
    });
}

function changeView(type) {
    $.ajax({
        type: 'post',
        data: { 'action': 'change_view', 'view_type': type },
        success: function (data) {
            if (type == 'list') {
                $('.product_card').each(function () {
                    $(this).removeClass('col-md-4');
                    $(this).removeClass('col-sm-6');
                    $(this).addClass('col-xs-12');
                });
                $('.product-col').each(function () {
                    $(this).addClass('list');
                    $(this).addClass('clearfix');
                });
                $('#list_view').addClass('active');
                $('#grid_view').removeClass('active');
            } else {
                $('.product_card').each(function () {
                    $(this).removeClass('col-xs-12');
                    $(this).addClass('col-md-4');
                    $(this).addClass('col-sm-6');
                });
                $('.product-col').each(function () {
                    $(this).removeClass('list');
                    $(this).removeClass('clearfix');
                });
                $('#grid_view').addClass('active');
                $('#list_view').removeClass('active');
            }
        }
    });
}



$(".del-toggle").click(function () {
    $("#del-open").slideToggle("slow", function () {
    });
});

$(".pay-toggle").click(function () {
    $("#pay-open").slideToggle("slow", function () {
    });
});

$(".war-toggle").click(function () {
    $("#war-open").slideToggle("slow", function () {
    });
});

function product_showcase(obj) {
    $('#gallery_main_holder').html('<a id="launch_the_show" onclick="timeToView(\'' + obj + '\')"><img class="img-responsive" id="full-screen-image" src="' + obj + '"></a>');
    $('.little_image').each(function () {
        $(this).attr('class', 'image_holder item');
    });
    document.getElementById(obj).className = "image_holder item activated";
}

function showAllChars() {
    $('.filterable').each(function () {
        $(this).find('.diff-table').each(function (index) {
            $(this).show();
        });
    });
    $('.all_chars').hide();
    $('.diff_chars').show();
}

function showDiffChars() {
    var chars = [];
    var shown = [];
    $('.filterable-data').each(function () {
        $(this).find('.diff-table').each(function (index) {
            var html = $(this).html();
            if (typeof chars[index] !== "undefined") {
                if (chars[index] !== html) {
                    shown.push(index);
                }
            } else {
                chars[index] = html;
            }
        });
    });

    $('.filterable').each(function () {
        $(this).find('.diff-table').each(function (index) {
            if ($.inArray(index, shown) == -1) {
                $(this).hide();
            }
        });
    });

    $('.all_chars').show();
    $('.diff_chars').hide();
}

function timeToView(src) {
    $("[href^='" + src + "']").click();
}

function diff_delete(id, group) {
    $.ajax({
        type: 'post',
        data: { action: 'difference', id: id, group: group },
        success: function (data) {
            location.reload();
        }
    });
}

function diff_delete_all() {
    $.ajax({
        type: 'post',
        data: { action: 'difference', id: 'all' },
        success: function (data) {
            location.reload();
        }
    });
}

function orderproduct(obj, obj2, obj3) {
    $('#order_this_product_result').html('');
    $('#order-product .form-header').html(obj2);
    $('#order_product').val(obj);
    $('#order_cat').val(obj3);
}

function one_click_buy(obj, obj2, obj3) {
    $('#one-click-buy_result').html('');
    // $('#order-product .form-header').html(obj2);
    $('#one_click_product').val(obj);
    $('#one_click_cat').val(obj3);
}

$(".show_filter").click(function () {
    if (document.getElementById('filter_main').className == "hidden-xs") {
        document.getElementById('filter_main').className = "visible-xs";
    } else {
        document.getElementById('filter_main').className = "hidden-xs";
    }
});

function desc(obj) {
    $(obj).slideToggle("slow", function () {
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function add2cart(obj, obj2, obj3, group) {

    if ($("input").is("#add_to_cart_input-" + obj)) {
        sum = $('#add_to_cart_input-' + obj).val();
        max = $('#add_to_cart_input-' + obj).attr('max');
        min = $('#add_to_cart_input-' + obj).attr('min');
        if (parseInt(sum) > parseInt(max)) {
            sum = max;
        }
        if (parseInt(sum) < parseInt(min)) {
            sum = 1;
        }
    } else {
        sum = 1;
    }

    if ($('.product_options').length) {
        product = $('.product_options').data('id');
        if (obj == product) {
            options = '';
            $('.product_options select').each(function () {
                value = $(this).val();
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    options = options + $(this).val() + ',';
                }
            });
            options = options.slice(0, -1);
        } else {
            options = '';
        }
    } else {
        options = '';
    }
    $.ajax({
        type: 'post',
        data: { action: 'add2cart', id: obj, type: obj2, options: options, amount: sum, group: group },
        success: function (data) {
            var returned = jQuery.parseJSON(data);

            showCartMessage(returned.cart.popcontent);

            if (returned.cart.discount > 0) {
                cartSum(returned.cart.sum_with_discount, returned.cart.count);
            } else {
                cartSum(returned.cart.sum, returned.cart.count);
            }
            $("#cart_button, .informater").fadeTo(100, 0.1).fadeTo(200, 1.0);
            quickReadCart();

            dataLayer.push({
                'ecommerce': {
                    'add': {
                        'products': [
                            {
                                'name': returned.cart.product.title, //обязательное
                                'id': returned.cart.product.id, //обязательное
                                'price': returned.cart.product.price,
                                'brand': returned.cart.product.brand.title,
                                'category': returned.cart.product.group_title,
                                'quantity': sum
                            }
                        ]
                    }
                }
            });
        }
    });
}

function quickReadCart() {
    $.ajax({
        type: 'post',
        data: { action: 'quick_cart' },
        success: function (data) {
            var returned = jQuery.parseJSON(data);
            $('.the-short-cart').html(returned.answer.insides);
            cartSum(returned.answer.sum, returned.answer.amount);
            startTheOwl($('.the-short-cart .owl-carousel'));
        }
    });
}

function orderinfo(obj) {
    $.ajax({
        type: 'post',
        data: { action: 'order-ajax', order: obj, local: '<?=$link_local;?>' },
        success: function (responce) {
            document.getElementById('order-' + obj).innerHTML = responce;
        }
    });
}

function selectOption(btn, value_id) {
    var value_id = value_id;
    $('#filter_' + value_id).prop('checked', true);
    if ($(btn).hasClass('imagecheck-holder')) {
        $(btn).closest('.option-variants').find('.imagecheck-holder').removeClass('active_one');
        $(btn).addClass('active_one');
    }

    var chosen_products = $(btn).data('products');
    var products_array = [];
    var values_array = [];
    var options_block = $('.product-options');
    options_block.find('.option-variants').each(function () {
        var products = $(this).find('input:checked').data('products');
        var value = $(this).find('input:checked').val();
        products_array.push(products);
        values_array.push(value);
    });

    $.ajax({
        type: 'POST',
        data: { action: 'reload-options', products: products_array, values: values_array, chosen: value_id, chosen_products: chosen_products },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.result == 1) {
                $('#product-inner-data').html(obj.content);
                dynamicFunctions();
                ksWidgetInitializer.reinit()
            }
        }
    });
}

function imageCheck(check) {
    if (!$('#imagecheck-' + check).closest('.imagecheck-holder').hasClass("active_one")) {
        $('#imagecheck-' + check).closest('.imagecheck-holder').addClass('active_one');
        $('#check-' + check).prop('checked', true);
    } else {
        $('#imagecheck-' + check).closest('.imagecheck-holder').removeClass('active_one');
        $('#check-' + check).prop('checked', false);
    }
}

$('.range_slider').each(function (index) {
    var minimum = $(this).attr('minimum');
    var maximum = $(this).attr('maximum');
    var from_start = $(this).attr('from_start');
    var to_end = $(this).attr('to_end');
    var special = $(this).attr('special');
    var postfixing = $(this).attr('postfixing');
    var naming = $(this).attr('name');
    var id = $(this).attr('title_id');
    var input_holder = $(this).closest('.filter-group').find('.slider-inputs');
    $(this).ionRangeSlider({
        min: minimum,
        max: maximum,
        from: from_start,
        to: to_end,
        type: 'double',
        onStart: function (data) {
            input_holder.find('.slider-start').val(data.from);
            input_holder.find('.slider-end').val(data.to);
        },
        onChange: function (data) {
            if (special == 'price_slider') {
                $('#min-price-filter').val(data.from);
                $('#max-price-filter').val(data.to);
                input_holder.find('.slider-start').val(data.from);
                input_holder.find('.slider-end').val(data.to);

            } else {
                min = minimum;
                max = maximum;
                property = naming;
                min_value = data.from;
                max_value = data.to;
                if ((min_value == min) && (max_value == max)) {
                    $('#check-' + naming).prop('checked', false);
                } else {
                    $('#check-' + naming).prop('checked', true);
                }
                $.ajax({
                    type: 'POST',
                    data: { action: 'number_filter', property: naming, min: min_value, max: max_value },
                    success: function (data) {
                        var obj = jQuery.parseJSON(data);
                        $('#check-' + naming).attr('name', obj.result);
                    }
                });
                input_holder.find('.slider-start').val(data.from);
                input_holder.find('.slider-end').val(data.to);
            }
        },
        onUpdate: function (data) {
            if (special == 'price_slider') {
                $('#min-price-filter').val(data.from);
                $('#max-price-filter').val(data.to);
                input_holder.find('.slider-start').val(data.from);
                input_holder.find('.slider-end').val(data.to);


            } else {
                min = minimum;
                max = maximum;
                property = naming;
                min_value = data.from;
                max_value = data.to;
                if ((min_value == min) && (max_value == max)) {
                    $('#check-' + naming).prop('checked', false);
                } else {
                    $('#check-' + naming).prop('checked', true);
                }
                $.ajax({
                    type: 'POST',
                    data: { action: 'number_filter', property: naming, min: min_value, max: max_value },
                    success: function (data) {
                        var obj = jQuery.parseJSON(data);
                        $('#check-' + naming).attr('name', obj.result);

                    }
                });
                input_holder.find('.slider-start').val(data.from);
                input_holder.find('.slider-end').val(data.to);
            }
            prequeryFilter(id);
        },
        onFinish: function (data) {
            if (special == 'price_slider') {
                prequeryFilter(id);
            } else {
                min = minimum;
                max = maximum;
                property = naming;
                min_value = data.from;
                max_value = data.to;
                $.ajax({
                    type: 'POST',
                    data: { action: 'number_filter', property: naming, min: min_value, max: max_value },
                    success: function (data) {
                        var obj = jQuery.parseJSON(data);
                        $('#check-' + naming).attr('name', obj.result);
                        prequeryFilter(id);
                    }
                });
            }
        }
    });

    var range = $(this).data("ionRangeSlider");
    input_holder.find('.slider-start').on('change', function () {
        var value = $(this).val();
        if (parseInt(value) >= parseInt(minimum)) {

            range.update({
                from: value
            });
            if (parseInt(range.result.to) < parseInt(value)) {
                range.update({
                    to: value
                });
            }
        } else {
            input_holder.find('.slider-end').val(minimum);
        }
    });

    input_holder.find('.slider-end').on('change', function () {
        var value = $(this).val();
        if (parseInt(value) <= parseInt(maximum)) {
            range.update({
                to: value
            });
            if (parseInt(range.result.from) < parseInt(value)) {
                range.update({
                    from: value
                });
            }
        } else {
            input_holder.find('.slider-end').val(maximum);
        }
    });
});

function product_option_query(id) {
    image = $('#' + id).find(':selected').attr('data-id');
    if (image !== '-') {
        image = parseInt(image) - 1;
        $("#product_showcase").owlCarousel('to', image);
        $(".owl-thumb-item").eq(image).click();
    }
    options = '';
    $('.product_options select').each(function () {
        value = $(this).val();
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            options = options + $(this).val() + ',';
        }
    });
    options = options.slice(0, -1);
    $.ajax({
        type: 'POST',
        data: { action: 'options-ajax', options: options },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.result == 1) {
                if (parseInt(obj.price) > 0) {
                    $('#this_product_price').html(obj.price);
                    if ($('#your_price_in_int').length != 0) {
                        $('#your_price_in_int').html(obj.your_price);
                    }
                }
            }
        }
    });
}

function thousandSeparator(str) {
    var parts = (str + '').split('.'),
        main = parts[0],
        len = main.length,
        output = '',
        i = len - 1;

    while (i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = ' ' + output;
        }
        --i;
    }

    if (parts.length > 1) {
        output += '.' + parts[1];
    }
    return output;
}

function load_more(start, page) {
    var $next = $('.pagination-block .active').closest('li').next('li').find('a');

    if ('undefined' == typeof $next) {
        return false;
    }

    $.get($next.attr('href'), function (response) {
        var $response = $(response);

        $('.div_to_load_products').append($response.find('.div_to_load_products').html());

        $('.refresh_pagination').html($response.find('.refresh_pagination').html());

        $('.refresh_load_more').html($response.find('.refresh_load_more').html());

        lazy();
    })



    /*$.ajax({
     type: "POST",
     cache:true,
     data: {action:'load_more',start:start, p:page},
     success:function (data) {           
        var obj = jQuery.parseJSON(data);

        $('.div_to_load_products').append(obj.inside);

        $('.refresh_pagination').html(obj.pagination);
        $('.refresh_load_more').html(obj.load_more);
        
        lazy();
        

     }
   });*/
}

function changeUrl(key, value) {
    url = getGet();
    clean_url = url['clean'];
    delete url['clean'];
    url['p'] = key + '=' + value;
    gets = implode(url);
    href = clean_url + '?' + gets;
    window.history.pushState(null, null, href);
}

function difference(id, group) {
    $.ajax({
        type: 'post',
        data: { action: 'difference', id: id, group: group },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.result == 1) {

                $('[data-diff=' + id + ']').each(function () {
                    if ($(this).closest("a").hasClass('active')) {
                        $(this).closest("a").removeClass('active');
                        alert('Товар удален из списка сравнения');
                    } else {
                        $(this).closest("a").addClass('active');
                        alert('Товар добавлен в список сравнения');
                    }
                });
                if ($('#difference_li').hasClass('inactive')) {
                    $('#difference_li').removeClass('inactive');
                    alert('Товар удален из списка сравнения');
                } else {
                    if (obj.count == 0) {
                        $('#difference_li').addClass('inactive');
                        alert('Товар добавлен в список сравнения');
                    }
                }

                $('.compare-amount').html(obj.count);
            }
        }
    });
}

function fav_delete(id, group) {
    fav(id, group);
    location.reload();
}

// карты
maps();

var maps = [];

function updateMap(id, position, marker) {

    ymaps.ready(init);

    function init() {
        // Создание карты.
        if (typeof maps[id] == 'undefined') {
            maps[id] = new ymaps.Map(id, {
                center: position,
                zoom: 15
            });
        } else {
            maps[id].setCenter(position, 15);
        }

        if (typeof marker != 'undefined') {
            placemark = new ymaps.Placemark(marker.latLng, {
                //balloonContent: marker.label,
                hintContent: marker.label
            });

            maps[id].geoObjects.add(placemark);
        }
    }

    /*DG.then(function () {
        if (typeof maps[id] == 'undefined') {
            maps[id] = DG.map(id, {
                center: position,
                zoom: 16
            });
        } else {
            maps[id].setView(position, 16);
        }

        if (typeof marker != 'undefined') {
            DG.marker(marker.latLng, marker).addTo(maps[id]);
        }            
    });  */
}


function setMaps($maps) {
    $maps.each(function () {
        var $this = $(this);
        var id = $this.attr('id');
        var position = [
            $this.data('lat'),
            $this.data('lng')
        ];

        updateMap(id, position, {
            'latLng': position,
            'label': $this.data('title')
        });
    });
}


function maps() {

    var $body = $('body');

    setMaps($('.the_map:visible'));

    $body.on('shown.bs.collapse', "#collapse-city_1", function () {
        setMaps($('.the_map:visible'));
    });

    $body.on('shown.bs.collapse', "#collapse-subs", function () {
        var $this = $('.location_picker.active');
        var id = 'subs_map';
        var position = [
            $this.data('lat'),
            $this.data('lng')
        ];

        updateMap(id, position, {
            'latLng': position,
            'label': $this.data('title')
        });

        $('.location_picker.active').trigger('click');
    });

    $('.location_picker').on('click', function () {
        var $this = $(this);
        $('.location_picker').removeClass('active');

        var adress = $this.data('adress');
        $('#sub_adress').html(adress);

        var worktime = $this.data('worktime');
        $('#sub_worktime').html(worktime);

        var position = [
            $this.data('lat'),
            $this.data('lng')
        ];

        updateMap('subs_map', position, {
            'latLng': position,
            'label': $this.data('adress')
        });

        $this.addClass('active');
    });
}
// конец карт

function fav_delete_all() {
    $.ajax({
        type: 'post',
        data: { action: 'favourite', id: 'all' },
        success: function (data) {
            location.reload();
        }
    });
}


function fav(id, group) {
    $.ajax({
        type: 'post',
        data: { action: 'favourite', id: id, group: group },
        success: function (data) {

            var obj = jQuery.parseJSON(data);

            $('.favourity-block .informater-value').text(obj.count);

            if (obj.result == 1) {
                $('[data-fav=' + id + ']').each(function () {
                    if ($(this).closest("a").hasClass('active')) {
                        $(this).closest("a").removeClass('active');
                        $('#mobile_nav .fav-block').removeClass('active');
                    } else {
                        $(this).closest("a").addClass('active');
                        $('#mobile_nav .fav-block').addClass('active');

                        alert('Товар добавлен в избранное');
                    }
                });
            }

        }
    });
}

function getGet(all_vars = 0) {
    var $_GET = {};
    var url = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });

    $.each($_GET, function (key, value) {
        if (typeof value !== 'undefined' && value != '') {
            if (all_vars == 1) {
                url[key] = key + '=' + value;
            } else {
                if (key !== 'p') {
                    url[key] = key + '=' + value;
                }
            }
        }
    })

    urling = window.location.href.split('?');

    url['clean'] = urling[0];

    return url;
}

function implode(array) {
    var gets = '';
    $.each(array, function (index, value) {
        gets = gets + array[index] + "&";
    });
    gets = gets.substring(0, gets.length - 1);
    return gets;
}
function sortCat(sort) {
    url = getGet(1);
    clean_url = url['clean'];
    delete url['clean'];
    url['sort'] = 'sort=' + sort;

    var gets = implode(url);

    document.location.href = clean_url + '?' + gets;
}

function queryFilter() {
    url = getGet();

    clean_url = url['clean'];
    delete url['clean'];

    var brands = '';
    $('#brandsquery input:checkbox:checked').each(function () {
        brands = brands + $(this).attr('name') + ',';
    });
    brands = brands.slice(0, -1);
    if (typeof brands !== 'undefined' && brands != '') {
        url['brands-filter'] = 'brands-filter=' + brands;
    } else {
        delete url['brands-filter'];
    }

    var filter = '';
    var holder = '';
    if ($(window).width() > 1199) {
        holder = $('.filter_main:not(.filter_mobile)');
    } else {
        holder = $('.filter_main.filter_mobile');
    }

    holder.find('.filtersquery').each(function () {
        $(this).find('input:checkbox:checked').each(function () {
            filter = filter + $(this).attr('name') + ',';
        });
    });
    filter = filter.slice(0, -1);

    if (typeof filter !== 'undefined' && filter != '') {
        url['filter'] = 'filter=' + filter;
    } else {
        delete url['filter'];
    }

    url['min-price'] = 'min-price=' + $('#min-price-filter').val();
    url['max-price'] = 'max-price=' + $('#max-price-filter').val();
    url['start-price'] = 'start-price=' + $('#price-filter').attr('minimum');
    url['finish-price'] = 'finish-price=' + $('#price-filter').attr('maximum');

    var gets = implode(url);

    document.location.href = clean_url + '?' + gets;
}

function prequeryFilter(selected_filter) {
    url = getGet();

    clean_url = url['clean'];
    delete url['clean'];

    var brands = '';
    $('#brandsquery input:checkbox:checked').each(function () {
        brands = brands + $(this).attr('name') + ',';
    });
    brands = brands.slice(0, -1);
    if (typeof brands !== 'undefined' && brands != '') {
        url['brands-filter'] = 'brands-filter=' + brands;
    } else {
        delete url['brands-filter'];
    }

    var filter = '';
    $('.filtersquery input:checkbox:checked').each(function () {
        filter = filter + $(this).attr('name') + ',';
    });
    filter = filter.slice(0, -1);
    if (typeof filter !== 'undefined' && filter != '') {
        url['filter'] = 'filter=' + filter;
    } else {
        delete url['filter'];
    }

    url['min-price'] = 'min-price=' + $('#min-price-filter').val();
    url['max-price'] = 'max-price=' + $('#max-price-filter').val();
    url['start-price'] = 'start-price=' + $('#price-filter').attr('minimum');
    url['finish-price'] = 'finish-price=' + $('#price-filter').attr('maximum');
    url['pre_filter'] = 'pre_filter=execute';

    var gets = implode(url);

    $('.filter_main').addClass('active');

    $.get(clean_url + '?' + gets, function (data) {
        $('#pre_amount').html('<img src="/template/js/fancybox/fancybox_loading.gif"/>');
        $('.result').html(data);
        var obj = jQuery.parseJSON(data);
        $('.pre_button').remove();
        $('#products2see').html(' (' + obj.products + ')');


        if ($('#' + selected_filter).length) {
            $('#' + selected_filter).append(obj.rendered);
        } else if ($('#filter_' + selected_filter).length) {
            $('#filter_' + selected_filter)
                .closest('.list-group')
                .find('.filter_header')
                .append(obj.rendered)
                ;
        }
    });
}

function resetFilter() {
    url = getGet();
    link = url['clean'] + '?';
    if (typeof url['search'] !== 'undefined' && url['search'] != '') {
        link = link + url['search'];
    }
    if (typeof url['search_cats'] !== 'undefined' && url['search_cats'] != '') {
        link = link + url['search_cats'];
    }
    if (typeof url['sort'] !== 'undefined' && url['sort'] != '') {
        link = link + url['sort'];
    }
    if (link.substr(link.length - 1) == '?') {
        link = link.slice(0, -1);
    }
    document.location.href = link;
}

function searchIt(id) {
    cat = '';
    $('#' + id + ' input:checkbox:checked').each(function () {
        cat = cat + $(this).attr('value') + ',';
    });
    cat = cat.slice(0, -1);

    if (cat.length > 0) {
        $('#' + id + ' .search_cats').val(cat);
    } else {
        $('#' + id + ' .search_cats').remove();
    }

    $('#' + id + ' .search_cat_id').each(function () {
        $(this).remove();
    });

    $('#' + id).submit();
}

$(".main-toggler").hover(function () {
    $('#unfocused').stop(true, true).fadeIn(1000);
},
    function () {
        $('#unfocused').stop(true, true).fadeOut(200);
    })

function quickFromCart(id) {
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'quick_remove', id: id },
        success: function (data) {
            quickReadCart();
            if ($('#the_list_of_products_in_cart').length > 0) {
                readCart();
            }
        }
    });
}

function openCart() {
    if ($('#top-cart').hasClass('opened')) {
        $('#top-cart').removeClass('opened');
        $('#mobile-cart-button-open').removeClass('hide-it');
        $('#mobile-cart-button-close').addClass('hide-it');
    } else {
        if ($('#slide_menu').hasClass('showNav')) {
            $('.btn-nav').click();
        }
        $('#mobile-cart-button-open').addClass('hide-it');
        $('#mobile-cart-button-close').removeClass('hide-it');
        $('#top-cart').addClass('opened');
    }
}
$(document).mouseup(function (e) {
    if ($('#top-cart').hasClass('opened')) {
        var container = $("#top-cart");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            openCart();
        }
    }
});

$('.search_form').submit(function () {
    $input = $('.search_input', $(this));

    if ('' == $input.val()) {
        $input.focus();
        return false;
    }
});

$(document).on('click', '.search_form .dropdown-menu', function (e) {
    e.stopPropagation();
});

function readCart() {
    showPreloader();
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'read_cart' },
        success: function (data) {

            if ($('input[name="delivery"]').is(':checked')) {
                showDelVariants();
            }

            var returned = jQuery.parseJSON(data);
            if (returned.cart.sum == 0) {
                location.reload();
            }

            $('#the_list_of_products_in_cart').empty();
            $('#the_list_of_products_in_cart').append(returned.cart.products);
            startTheOwl($('#the_list_of_products_in_cart .owl-carousel'));
            $('#the_cart_totals').html(returned.cart.totals);
            $('#pay_block').html(returned.cart.pay_block);
            $('#del_block').html(returned.cart.del_block);


            quickReadCart();
            ui_inputs();
        }
    });
    hidePreloader();
}

function finalWithDelivery(price) {
    showPreloader();
    $.ajax({
        type: 'post',
        data: { update_cart: '1', final_cart: '1', price: price },
        success: function (data) {
            var returned = jQuery.parseJSON(data);
            $('.cart_counts').html(returned.finals);
            ui_inputs();
        }
    });
    hidePreloader();
}

function plus_product(id) {
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'add_one_to_cart', id: id },
        success: function (data) {
            readCart();
        }
    });
}

function minus_product(id) {
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'minus_one_to_cart', id: id },
        success: function (data) {
            readCart();
        }
    });
}

function removeFromCart(id) {
    $.ajax({
        type: 'POST',
        data: { action: 'update_cart', action_type: 'remove_from_cart', id: id },
        success: function (data) {
            readCart();
        }
    });
}

function updateAmount(id) {
    amount = $('#' + id + '-amount').val();
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'change_amount', id: id, amount: amount },
        success: function (data) {
            readCart();
        }
    });
}

function loadDelivery(id) {
    if (id == 6) {
        $('#pay-1').closest('.owl-item').hide();
    } else {
        $('#pay-1').closest('.owl-item').show();
    }
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'delivery', delivery: id },
        success: function (data) {
            var returned = jQuery.parseJSON(data);
            $('#the_cart_totals').html(returned.cart.totals);
            $('#togglable_deliveries_table').toggle('3000');
            $('#togglable_deliveries_button').toggle('3000');
            $('#delivery_info_block').html(returned.cart.info);
            $('#order_form_to_submit').html(returned.cart.form);
            ui_inputs();
        }
    });
}

$('body').on("keyup keydown change", ".ui_input", function () {
    val = $(this).val();
    val = val.replace(/./g, '*');
    val = $.trim(val);
    if (val.length > 0) {
        if (!$(this).closest('.ui_label_group').hasClass('ui_has_value')) {
            $(this).closest('.ui_label_group').addClass('ui_has_value');
        }
    } else {
        if ($(this).closest('.ui_label_group').hasClass('ui_has_value')) {
            $(this).closest('.ui_label_group').removeClass('ui_has_value');
        }
    }
})

function ui_inputs() {
    $('.ui_input').each(function () {
        val = $(this).val();
        val = val.replace(/./g, '*');
        val = $.trim(val);
        if (val.length > 0) {
            if (!$(this).closest('.ui_label_group').hasClass('ui_has_value')) {
                $(this).closest('.ui_label_group').addClass('ui_has_value');
            }
        } else {
            if ($(this).closest('.ui_label_group').hasClass('ui_has_value')) {
                $(this).closest('.ui_label_group').removeClass('ui_has_value');
            }
        }
    });

}

function cityInput() {
    var MIN_LENGTH = 3;
    var city = $("#city_choose").val();
    if (city.length >= MIN_LENGTH) {
        var delivery = $("#city_choose_delivery").val();
        $.ajax({
            type: 'post',
            data: { action: 'update_cart', action_type: 'get_city', delivery: delivery, city: city },
            success: function (data) {
                var obj = jQuery.parseJSON(data);
                $('#city_list').html(obj.cities);
            }
        });
    }
}

function calculateDelivery(id, title = '') {
    $('#calc_results').empty();
    var delivery = $("#city_choose_delivery").val();
    if ($('#delivery_type').length > 0) {
        var type = $('#delivery_type').val();
    } else {
        var type = '';
    }
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'calculate_delivery', delivery: delivery, city: id, title: title, type: type },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.answer.length > 0) {
                $('#calc_results').html('<div class="answer-the-form success filled">' + obj.answer + '</div>');
            }
            $('#the_cart_totals').html(obj.totals);
        }
    });
}

function getThePrice(id) {
    amount = parseInt($('#' + id).val());
    $.ajax({
        type: 'post',
        data: { action: 'get_the_price', id: id, amount: amount },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            $('#the_price-' + obj.id).html(obj.price);
            var sum = thousandSeparator(parseInt(amount) * parseFloat(obj.price));
            $('.the_price_d[data-product="' + obj.id + '"]').html(sum);
        }
    });
}

function changeThisPrice(id) {
    getThePrice(id);
}

function plusAmount(id) {
    amount = parseInt($('.' + id).val());
    new_amount = amount + 1;
    $('.' + id).val(new_amount);
    getThePrice(id);
}

function minusAmount(id) {
    amount = parseInt($('.' + id).val());
    if (amount > 1) {
        new_amount = amount - 1;
        $('.' + id).val(new_amount);
        getThePrice(id);
    }

}

function russianPost() {
    $('#calc_results').empty();
    var delivery = $("#city_choose_delivery").val();
    var zip = $('#rp_zip').val();
    $.ajax({
        type: 'post',
        data: { action: 'update_cart', action_type: 'calculate_delivery', delivery: delivery, zip: zip },
        success: function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.answer.length > 0) {
                $('#calc_results').html('<div class="answer-the-form success filled">' + obj.answer + '</div>');
            }
            $('#the_cart_totals').html(obj.totals);
        }
    });
}

function crediter() {
    $('.period-variant').on('click', function () {
        var parent = $(this).closest('.credit-row');
        $('.period-variant').removeClass('selected');

        var monthly = $(this).data('monthly');
        var period = $(this).data('period');
        var title = $(this).data('title');

        parent.find('#variant_holder').html(period);
        parent.find('#credit_sum').html(monthly);
        parent.find('#credit_title').html(title);

        parent.find('.credit_btn_apply').attr('data-period', period);

        parent.find(this).addClass('selected');
    })
}

function hackyHref() {
    $('.hacky_href').on('click', function (e) {
        e.preventDefault();
        var href = $(this).data('href');
        window.location.href = href;
    })
}

function dynamicFunctions() {
    hackyHref();

    crediter();
    $(".forms_in").fancybox({
        helpers: {
            overlay: {
                locked: false
            }
        },
        'autoSize': false,
        padding: 0
    });

    fakewaffle.responsiveTabs(['xs', 'sm']);

    $('.owl-carousel').each(function (index) {
        startTheOwl($(this));
    });

    var $sync1 = $("#sync1"),
        $sync2 = $("#sync2"),
        flag = false,
        duration = 300;

    $sync1
        .owlCarousel({
            items: 1,
            margin: 10,
            nav: false,
            dots: false,
            animateOut: 'fadeOut'
        })
        .on('changed.owl.carousel', function (e) {
            if (!flag) {
                flag = true;
                $sync2.trigger('to.owl.carousel', [e.item.index, duration, true]);
                $('.owl-thumbs .item').removeClass('activated');
                $('.owl-thumbs .item').eq(e.item.index).addClass('activated');
                flag = false;
            }
        });

    $sync2
        .owlCarousel({
            items: 3,
            nav: true,
            margin: 10,
            center: false,
            dots: false,
            navRewind: false,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            animateOut: "slideOutUp",
            animateIn: "slideInUp"
        })
        .on('click', '.owl-item', function () {
            $('.owl-thumbs .item').removeClass('activated');
            $(this).find('.item').addClass('activated');
            $sync1.trigger('to.owl.carousel', [$(this).index(), duration, true]);

        })
        .on('changed.owl.carousel', function (e) {

        });

    $('.product-gallery').lightGallery({ selector: '.gallery_link', thumbnail: false, hash: false });

    lazy();
}


function finalize() {


    var form = $('#order_form');
    var data = form.serialize();
    var payment = $('input[name=payment]:checked').val();
    var delivery = $('input[name=delivery]:checked').val();

    if ($('#bonuses').length > 0) {
        var bonuses = $('#bonuses').val();
    } else {
        var bonuses = '';
    }

    if ($('#coupon').length > 0) {
        var coupon = $('#coupon').val();
    } else {
        var coupon = '';
    }

    var ok = 1;
    $('#order_form input, #order_form textarea').each(function () {
        if ($(this).prop('required')) {
            var value = $(this).val();
            if (value == "") {
                $(this).addClass('err');
                ok = 0;
            } else if (typeof value == "undefined") {
                $(this).addClass('err');
                ok = 0;
            } else {
                $(this).removeClass('err');
            }
        }
    });

    var gift = 0;
    if ($('.gifts-block').length > 0) {
        gift = $('input[name=free-gift]:checked').val();
    }

    if (typeof gift == "undefined") {
        gift = 0;
    }
    if (gift == "undefined") {
        gift = 0;
    }

    if (ok == 1) {
        showPreloader();

        $.ajax({
            type: 'post',
            data: { action: 'update_cart', action_type: 'finalize', inputs: data, payment: payment, delivery: delivery, bonuses: bonuses, coupon: coupon, gift: gift },
            success: function (data) {
                var obj = jQuery.parseJSON(data);
                if (obj.result == 1) {
                    window.location.href = obj.link;
                } else {
                    console.log(obj.object);
                    var id = $('#form_' + obj.object).closest('.step_point').attr('id');
                    cartStep(id);
                    $('#form_' + obj.object).focus();
                }
                hidePreloader();
            }
        });
    } else {
        $('#order_form input').focus();
    }
}

// яндекс.цели при нажатии
/*$body.on('click', '[class*="ym_goal_"]', function () {
    if ('function' == typeof ym) {
        var $this = $(this);

        for (var goal in ymGoals) {
            if ($this.hasClass(goal)) {
                reachGoal(goal);
            }
        }
    }
})
*/


// яндекс.цель
function reachGoal(goal) {
    var ymGoals = {
        'ym_goal_rassrochka_form': 'rassrochka_form', // Кнопка “В рассрочку”
        'ym_goal_rassrochka_sent': 'rassrochka_sent', // Отправить данные 
        'ym_goal_open_kupit_v_1_klik': 'open_kupit_v_1_klik', // Кнопка "Купить в 1 клик"
        'ym_goal_send_kupit_v_1_klik': 'send_kupit_v_1_klik', // Отправка данных
        'ym_goal_call': 'call', // Кнопка заказать звонок 
        'ym_goal_confirm_call': 'confirm_call', // Отправка заявки
    }

    if (goal in ymGoals) {
        console.log('Reach яндекс.цель: ' + ymGoals[goal]);
        ym(52143727, 'reachGoal', ymGoals[goal]);
    }

    reachGoalGoogle(goal);
}


// google.аналитик
function reachGoalGoogle(goal) {
    var ymGoals = {
        'ym_goal_rassrochka_form': '/virtual/rassrochka_form', // Кнопка “В рассрочку”
        'ym_goal_rassrochka_sent': '/virtual/rassrochka_sent', // Отправить данные 
        'ym_goal_open_kupit_v_1_klik': '/virtual/open_kupit_v_1_klik', // Кнопка "Купить в 1 клик"
        'ym_goal_send_kupit_v_1_klik': '/virtual/send_kupit_v_1_klik', // Отправка данных
        'ym_goal_call': '/virtual/call', // Кнопка заказать звонок 
        'ym_goal_confirm_call': '/virtual/confirm_call', // Отправка заявки
    }

    if (goal in ymGoals) {
        console.log('Reach google.цель: ' + ymGoals[goal]);
        //ga('send', 'event', ymGoals[goal]);
        ga(ga.getAll()[0].get('name')+'.send', 'pageview', ymGoals[goal]);
    }
}


// закрепление/открепление меню при скроллинге
function scroll_header_fixed($block, blockTop) {
    let scrollTop = $(window).scrollTop();

    if (scrollTop > blockTop && !$block.hasClass('fix')) {
        $block.addClass('fix');
    } else if (scrollTop <= blockTop && $block.hasClass('fix')) {
        $block.removeClass('fix');
    }
}

// функция проверки ширины
function is_width(width) {
    return window.matchMedia("(max-width: " + width + "px)").matches;
}


function favShow() {
    var $fav = $('.product-in-btn-price .fav');

    if (!$fav.length) {
        return false;
    }

    var $hFav = $('#mobile_nav .fav-block');

    $hFav.addClass('show');

    if ($fav.hasClass('active')) {
        $hFav.addClass('active');
    }
}



function loadDifferentCarousel() {
    var $products = $("#diff_products");
    var $chars = $("#diff_chars");
    var $moving = false;

    $products.
        on('initialized.owl.carousel', function (e) {
            if (e.item.count <= e.page.size) {
                $products.find('.owl-next').hide();
                $products.find('.owl-prev').hide();
            }
        });

    $products.
        owlCarousel({
            margin: 0,
            loop: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    pagination: false,
                    nav: true,
                    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
                },
                600: {
                    items: 2,
                    pagination: false,
                    nav: true,
                    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
                },
                1000: {
                    items: 3,
                    pagination: false,
                    nav: true,
                    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
                }
            }
        });


    $chars
        .owlCarousel({
            margin: 0,
            loop: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    pagination: false,
                    nav: false
                },
                600: {
                    items: 2,
                    pagination: false,
                    nav: false
                },
                1000: {
                    items: 3,
                    pagination: false,
                    nav: false
                }
            }
        });

    $products.
        on('changed.owl.carousel', function (e) {
            if ($moving == false) {
                $moving = true;
                $chars.trigger('to.owl.carousel', [e.item.index, 300, true]);
                $moving = false;
            }
            if (e.item.count > e.page.size) {
                $products.find('.owl-next').show();
                $products.find('.owl-prev').show();

                $products.find('.owl-next').removeClass('disabled');
                $products.find('.owl-prev').removeClass('disabled');

                if (e.item.index == 0) {
                    $products.find('.owl-prev').addClass('disabled');
                }

                if (e.item.index + e.page.size == e.item.count) {
                    $products.find('.owl-next').addClass('disabled');
                }
            } else {
                $products.find('.owl-next').hide();
                $products.find('.owl-prev').hide();
            }
        });

    $chars.
        on('changed.owl.carousel', function (e) {
            if ($moving == false) {
                $moving = true;
                $products.trigger('to.owl.carousel', [e.item.index, 300, true]);
                $moving = false;
            }
        });
}

// функция проверки ширины
function is_width(width) {
    return window.matchMedia("(max-width: " + width + "px)").matches;
}

$('.lazyx').lazy({
    effect: 'fadeIn',
    threshold: 50,
});


$('[name="delivery"]').change(function () {
    $('.field-address').attr('data-type', $(this).val());
    $('.field-address input').focus();
});

if (is_width(920)) {
    console.log('11')
    startTheOwl($('.owl-blog-mob'));
}

$('.delivery-data-block .forms_in.btn-main').on('click', function(){
    track('open_support');
});
$('.btn.btn-cart.btn-order').on('click', function(){
    track('open_on_request');
});


 let w = setInterval(function() {
if (document.querySelector(".credit-row.grid_credit.credit-kaspi")){
    console.log("button found");
    document.querySelector('.credit-row.grid_credit.credit-kaspi .ks-widget').onclick = function () {ym(52143727,'reachGoal','kaspikz');console.log("event");ga(ga.getAll()[0].get('name')+'.send', 'pageview', '/virtual/kaspikz');console.log("event2");
    };
    clearInterval(w);
    console.log("button event");
    }
}, 4000);

function track(event) {
        if (event) {
            if ('undefined' !== typeof Ya && 'undefined' !== typeof Ya._metrika) {
                $.each(Ya._metrika.counters, function (key, counter) {
                    counter.reachGoal(event, {URL: document.location.href});
                    console.log('YM tracking: ' + event);
                });
            }
            if ('undefined' !== typeof ga) {
                ga(ga.getAll()[0].get('name')+'.send', 'pageview', '/virtual/' + event);
                console.log('GA tracking: ' + event);
            }
        }
    }