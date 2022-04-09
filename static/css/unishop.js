var main = {
    init: function () {
        var _this = this;

        _this.moveTop();
        _this.locationChange();
        _this.searchAuto();
        _this.tabs();
        _this.previewCart();
        _this.addTouchClass();
        _this.numberInput();
        _this.showAllPlugins();

        _this.contentHeight();
        setTimeout(_this.contentHeight, 2000);
    },
    moveTop: function () {
        var linkMove = $('#move-to-top'), contentTop = $('.js-content-move');

        if(contentTop.length && linkMove.length){
            $(window).scroll(function() {
                var t = $(document).scrollTop();
                var contentTopX = contentTop.offset().top;
                if (t >= contentTopX) {
                    linkMove.fadeIn();
                } else {
                    linkMove.fadeOut();
                }
            });

            linkMove.click(function(event) {
                event.preventDefault();

                $('html,body').animate({
                    scrollTop: 0
                }, 500);
            });
        }

    },
    locationChange: function (){
        $(".js-language").on("click", function (event) {
            event.preventDefault();

            var url = location.href;
            if (url.indexOf('?') == -1) {
                url += '?';
            } else {
                url += '&';
            }
            location.href = url + 'locale=' + $(this).data("value");
        });
    },
    searchAuto: function (){
        var input = $('.js-search-auto');

        input.on("keyup", function(){
            var $this = $(this),
                value = $this.val(),
                form = $this.closest('form'),
                url = form.attr("action"),
                resultWrap = form.find('.js-search-auto-result');

            if(value.length > 3){
                $.get(url + '?query='+value+'&ajax=1', function(data) {
                    var content = $(data).find('.js-auto-search');

                    resultWrap.html("");
                    if(content.length){
                        resultWrap.show();
                        resultWrap.html(content);
                    }else{
                        resultWrap.hide();
                    }
                });
            }
        });

        $('body').click(function (e) {
            var popup = $(".js-search-auto-result");
            if (!$('.js-search-auto').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
                popup.hide();
            }
        });
    },
    tabs: function(){
        var button = $('.js-tab'), content = $('.js-tab-content');
        button.on("click", function(){
            var $this = $(this),
                contentWrapId = $this.data('tab-content');

            button.removeClass('selected');
            content.removeClass('selected');

            $this.addClass('selected');
            $('#' + contentWrapId).addClass('selected');
        });

        var btnMoveToTab = $('.js-move-to-tab');
        btnMoveToTab.on("click", function(event){
            event.preventDefault();

            var $this = $(this),
                tab = $('.js-tab'),
                currentTabContent = $('#' + $this.data('tab-content')),
                thisTfb = $('.js-tab[data-tab-content="'+$this.data('tab-content')+'"]');

            tab.removeClass('selected');
            thisTfb.addClass('selected');
            content.removeClass('selected');
            currentTabContent.addClass('selected');

            var top = currentTabContent.offset().top - 70;
            $('html,body').animate({
                scrollTop: top
            }, 500);
        });
    },
    previewCart: function(){
        var _this = this,
            preview = $('.js-preview-cart');

        preview.each(function(){
            var $this = $(this),
                popup = $this.find('.js-cart-popup');

            if(popup.length){
                $this.hover(function (){
                    var url = $this.data('url');

                    popup.html("");
                    $.get(url + '?ajax=1', function(html) {
                        var cartContentHtml = $(html).find('.js-cart-ajax');

                        if(cartContentHtml){
                            popup.html(html);
                        }
                    });
                });
            }
        });
    },
    addTouchClass: function(){
        if(is_touch_device()){
            $('body').removeClass('no-touch').addClass('touch');
        }
    },
    numberInput: function (){
        $('body').on("keyup", ".js-number", function(){
            var reg_number = /[^0-9]/g;

            $(this).val($(this).val().replace(reg_number, ''));
        });
    },
    contentHeight: function (){
        var content = $('.js-content'),
            left = $('.js-left-sidebar'),
            right = $('.js-right-sidebar'),
            contentPadding = parseInt(content.css('padding-top')) + parseInt(content.css('padding-bottom'));

        content.css("min-height", "0");
        if(content.length && left.length){
            var contentHeight = content.outerHeight();
            var leftHeight = left.outerHeight();

            if(contentHeight < leftHeight){
                content.css("min-height", (parseFloat(leftHeight) - contentPadding - 2) + "px");
            }
        }

        if(content.length && right.length){
            var contentHeight = content.outerHeight();
            var rightHeight = right.outerHeight();

            if(contentHeight < rightHeight){
                content.css("min-height", (parseFloat(rightHeight) - contentPadding  - 2) + "px");
            }
        }
    },
    showAllPlugins: function (){
        var wrap = $('.js-nav-sidebar-wrap');

        wrap.each(function(){
            hideElements = $(this).find(".menu-v li:hidden");
            btn = $(this).find('.js-nav-sidebar-show');

            if(hideElements.length){
                btn.removeClass('hide');
                btn.on("click", function(){
                    hideElements.toggleClass("show");
                    btn.find('.js-icon-plus, .js-icon-minus').toggleClass("hide");
                });
            }
        });
    }
};

var form = {
    init: function (){
        var _this = this;

        _this.formStyler();
        _this.submit();
    },
    formStyler: function (){
        if(document.location.pathname == "/order/"){
            return true;
        }
        $('input[type="checkbox"], input[type="radio"], .js-select').styler();

        $('body').on('change', 'input[type="checkbox"]', function() {
            if ($(this).is(':checked')) {
                $(this).closest('.jq-checkbox').addClass('checked');
                $(this).closest('label').addClass('checked');
            } else {
                $(this).closest('.jq-checkbox, label').removeClass('checked');
                $(this).closest('label').removeClass('checked');
            }
        });

        $('body').on('change', 'input[type="radio"]', function() {
            var inputs = $('input[type="radio"][name="'+$(this).attr('name')+'"]');
            inputs.each(function(){
                var input = $(this);
                if (input.is(':checked')) {
                    input.closest('.jq-radio').addClass('checked');
                    input.closest('label').addClass('checked');
                }else{
                    input.closest('.jq-radio').removeClass('checked');
                    input.closest('label').removeClass('checked');
                }
            });

        });
    },
    submit: function (){
        $('body').on("click", ".js-submit-form", function (){
            var $this = $(this),
                form = $this.closest("form");

            if(!$this.hasClass('disabled')){
                form.submit();
            }
        });
    }
};

var selectList = {
    init: function (){
        var _this = this;

        $('body').on("click", '.js-select-toggle', function(){
            var items = $(this).closest('.js-select-list').find('.js-select-items');

           if(items.is(':visible')){
               items.hide();
           }else{
               items.show();
           }
        });

        $('body').on("click", '.js-select-toggle a', function(event){
            event.preventDefault();
        });

    }
};

var menu = {
    init: function (){
        var _this = this;

        _this.responsiveMenu();
        _this.resizeMenu();
        _this.headerMenuHover();
    },
    responsiveMenu: function(){
        var _this = this, items = $(".js-resp-nav");

        jQuery.each(items, function(){
            _this.responsived($(this));
        });
    },
    resizeMenu: function(){
        var _this = this;

        $(window).resize(function() {
            _this.responsiveMenu();
        });
    },
    responsived: function(menu){
        var _this = this,
            menuWidth = menu.width(),
            menuItems = menu.children('.js-resp-nav-el'),
            ItemElse = menu.find('.js-resp-nav-else'),
            ItemElseWidth = parseFloat(ItemElse.removeClass('hide').outerWidth(true)),
            submenuElse = ItemElse.find('.js-resp-subnav-else'),
            allItemsWidth = 0;

        ItemElse.addClass('hide');
        submenuElse.html("");
        menuItems.removeClass('hide');

        jQuery.each(menuItems, function(){
            var $this = $(this),
                elWidth = parseFloat($this.outerWidth(true));

            if((allItemsWidth + elWidth + ItemElseWidth) > menuWidth){
                ItemElse.removeClass('hide');
                $this.clone().appendTo(submenuElse);
                $this.addClass('hide');
            }
            allItemsWidth += $this.outerWidth(true);
        });
    },
    headerMenuHover: function (){
        var headerMenu = $('#header-nav'),
            mobileBtnShowHideMenu = $('.js-nav-btn[data-id="'+headerMenu.attr("id")+'"]'),
            item = $('.js-header-nav-el');

        if(!mobileBtnShowHideMenu.is(':visible')){
            item.hover(function(){

                var $this = $(this),
                    subMenuWrap = $this.children('.js-header-nav-sub');

                subMenuWrap.css("padding-top", "15px");
                subMenuWrap.css("opacity", "0");
                subMenuWrap.show();
                subMenuWrap.animate({ paddingTop: "0" , opacity: 1}, 300 );

            },function(){
                var $this = $(this),
                    subMenuWrap = $this.children('.js-header-nav-sub');

                subMenuWrap.hide();
            });
        }
    }
};

var slider = {
    init: function (){
        var _this = this,
            pause = parseInt($('.js-main-slider').data("pause")) * 1000,
            auto = (pause) ? true : false;

        var slider = $('.js-main-slider').bxSlider({
            nextText: '',
            prevText: '',
            responsive: true,
            auto: auto,
            pause: pause,
            autoHover: true,
            adaptiveHeight:true,
            onSliderLoad: function(currentIndex){
                $(".js-slider-wrap .bx-next, .js-slider-wrap .bx-prev, .js-slider-wrap .bx-pager-item").click(function(){
                    slider.stopAuto();
                });
            }
        });

        $(function () {
            if (navigator.userAgent.search("Firefox") >= 0) {
                var ff_version = navigator.userAgent.match(/Firefox\/([\d]+\.[\d])+/);
                ff_version = parseFloat(ff_version[1]);
                if (ff_version == 0 || ff_version >= 59) {
                    $('body').on('mousedown', '.bx-viewport a', function () {
                        var ff_link = $(this);
                        var ff_href = ff_link.attr('href');
                        if (ff_href) {
                            location.href = ff_href;
                            return false;
                        }
                    });
                }
            }
        });


    },
    autoHeight: function (){
        var slider = $('.js-slider-wrap, .js-main-promo'),
            productDay = $('.js-product-day');

        if(slider.length && productDay.length && slider.offset().top == productDay.offset().top){
            productDay.css("height", "auto");
            slider.css("height", "auto");

            var heightSlider = slider.height();
            var heightProduct = productDay.height();

            if(heightSlider > heightProduct){

                productDay.css("height", heightSlider + "px");
            }else if(heightProduct > heightSlider){
                slider.css("height", heightProduct + "px");
            }

        }
    }
};

var photoGallery = {
    init: function (){
        var _this = this;

        var slider = $('.js-sidebar-photos').bxSlider({
            nextText: '',
            prevText: '',
            pager: false,
            responsive: true,
            auto: true,
            pause: 6500,
            autoHover: true,
            onSliderLoad: function(currentIndex){
                $(".js-sidebar-photos .bx-next, .js-sidebar-photos .bx-prev, .js-sidebar-photos .bx-pager-item").click(function(){
                    slider.stopAuto();
                });
            }
        });
    }
};

var modalForm = {
    init: function (){
        var _this = this;

        _this.loadContentForm('a[href="/login/"]');
        _this.loadContentForm('a[href="/forgotpassword/"]');
        _this.submitForm();
    },
    loadContentForm : function (selectorBtnElement){
        var _this = this;
        var selectorContent = '.js-ajax-form';

        $('body').on("click", selectorBtnElement, function (event){
            event.preventDefault();
            var url = $(this).attr('href')+"?ajax=1";

            $.magnificPopup.close();
            $('body').prepend("<div class='js-loading-bg mfp-bg mfp-ready'><div class='mfp-preloader'></div></div>");

            $.get(url, function(data) {
                $('.js-loading-bg').remove();

                var content = $(data).find(selectorContent);
                _this.openModal(content, url);
            });
        });
    },
    openModal: function (content, url){
        var _this = this;

        $(content).find('form').attr("action", url);
        $(content).find('input[type="checkbox"], input[type="radio"], .js-select').styler();


        $.magnificPopup.open({
            items: {
                src: "<div class='popup-content'>"+content.outerHTML()+"</div>"
            },
            type: 'inline'
        }, 0);

    },

    submitForm: function(){
        var _this = this;

        $('body').on("submit", '.js-ajax-form form', function(event){
            event.preventDefault();

            var url = $(this).attr("action"),
                data = $(this).serialize(),
                btn = $(this).find('input[type="submit"]');

                btn.hide();
                btn.after($('<i class="icon16 loading js-loading"></i>'));

            $.post(url, data, function(data){
                var content = $(data).find('.js-ajax-form');
                if(content.length > 0){
                    _this.openModal(content, url);
                    btn.show();
                    $(this).find(".js-loading").remove();
                }else{
                    window.location.reload();
                }
            });

        });
    }

};

var dropDownWrap = {
    init: function (){
        var _this = this;

        var selectorButton = '.js-btn-drop-down',
            selectorWrap = '.js-drop-down-wrap',
            selectorOuter = '.js-drop-down-outer';

        $(document).click(function(event) {
            if((!$(event.target).closest(selectorWrap).length && !$(event.target).closest(selectorOuter).length) || $(event.target).hasClass('js-bg')) {
                $(selectorWrap).each(function (){
                    $(this).removeClass('show');
                });
            }
        });

        $(selectorButton).on("click", function (){
            var $this = $(this),
                wrap = $('#' + $(this).data("id"));

            if(wrap.is(':visible')){
                 wrap.removeClass('show');
            }else{
                $(selectorWrap).each(function (){
                    $(this).removeClass('show');
                });
                _this.open($this, wrap);
            }
        });
    },
    open: function (btn, wrap){
        if(wrap.is(':visible')){
            wrap.animate({ opacity: 0 }, 200,  function() {
                wrap.removeClass('show');
            } );

            btn.removeClass('active');
        }else{
            wrap.css("padding-top", "20px");
            wrap.css("opacity", "0");
            wrap.addClass('show');
            wrap.animate({ paddingTop: "0" , opacity: 1}, 200);

            btn.addClass('active');
        }
    }
};

var categoriesMainMenu = {
    init: function (){
        var _this = this;

        _this.dropDownDisclosed();
        _this.dropDown();
        _this.mobileShowSubmenu();
    },
    dropDownDisclosed: function (){
        var _this = this;

        var item = $(".js-cat-subs-disclosed");

        item.hover(function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu').first(),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                isCategoriesPositionAbsolute = $('#header-nav-categories').css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap');

            if(isSubmenuAbsolute){
                if(submenu.length > 0){
                    submenu.show();
                }

                var submenuWidth = submenu.outerWidth(true);
                if(!item.hasClass("position-relative")){
                    catMenuWrap.css("padding-right", submenuWidth + "px");
                    if(isCategoriesPositionAbsolute){
                        _this.calcHeight(catMenuWrap, submenu);
                    }
                }
            }
        }, function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu').first(),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap');

            if(isSubmenuAbsolute){
                submenu.hide();
                catMenuWrap.removeAttr('style');
            }
        });

    },
    dropDown: function (){
        var _this = this;

        var item = $(".js-cat-subs-dropdown");

        item.hover(function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu').first(),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                isCategoriesPositionAbsolute = $('#header-nav-categories').css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap'),
                catMenuMarginRight = 0;

            if(isSubmenuAbsolute){
                if(submenu.length){
                    catMenuMarginRight += 258;
                    submenu.show();
                }
                if(!item.hasClass("position-relative")) {
                    catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                    if(isCategoriesPositionAbsolute){
                        _this.calcHeight(catMenuWrap, submenu);
                    }

                }
            }
        }, function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu'),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap');

            if(isSubmenuAbsolute){
                submenu.hide();
                catMenuWrap.removeAttr('style');
            }
        });

        var itemSub = $('.js-subcatmenu-el');
        itemSub.hover(function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu').first(),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                isCategoriesPositionAbsolute = $('#header-nav-categories').css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap'),
                catMenuMarginRight = 518;

            if(isSubmenuAbsolute){
                submenu.show();
                if (!itemSub.hasClass("position-relative")){
                    catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                    if(isCategoriesPositionAbsolute){
                        _this.calcHeight(catMenuWrap, submenu);
                    }
                }

            }
        }, function(){
            var $this = $(this),
                submenu = $this.find('.js-submenu').first(),
                isSubmenuAbsolute = submenu.css("position") == 'absolute',
                catMenuWrap = $this.closest('.js-catmenu-wrap'),
                catMenuMarginRight = 258,
                parent = $this.closest('.js-cat-subs-dropdown');

            if(isSubmenuAbsolute){
                submenu.hide();
                if (!itemSub.hasClass("position-relative")) {
                    catMenuWrap.css('margin-right', catMenuMarginRight + 'px');
                }
            }
        });
    },
    calcHeight: function (wrap, submenuWrap){
        var submenuWrapHeight = submenuWrap.outerHeight(true),
            wrapHeight = wrap.outerHeight(true);

        if(submenuWrapHeight > wrapHeight){
            wrap.css("height", submenuWrapHeight + 'px');
        }
    },
    mobileShowSubmenu: function (){
        var caret = $('.js-catmenu-el-caret');

        caret.on("click", function(){
            var $this =  $(this),
                parent = $this.closest('.js-cat-subs-disclosed, .js-cat-subs-dropdown, .js-subcatmenu-el'),
                submenu = $(parent.find('.js-submenu').first()),
                isSubmenuStatic = (submenu.css('position') != 'absolute');

            if(isSubmenuStatic){
                if(!submenu.is(':visible')){
                    submenu.show();
                    $this.addClass('open');
                }else{
                    submenu.hide();
                    $this.removeClass('open');
                }
            }
        });
    }
};

var mobileMenu = {
    init: function (){
        var _this = this;

        _this.hideShow();
        _this.showSubmenu();
    },
    hideShow: function(){
        var _this = this,
            btnMenuOpen = $(".js-nav-btn");

        btnMenuOpen.on("click", function(){
            var $this = $(this),
                menu = $('#'+$this.data('id'));

            if(menu.hasClass('show')){
                menu.removeClass('show');
                $this.removeClass('show');
            }else{
                menu.addClass('show');
                $this.addClass('show');
            }
        });

        //for filters separated code
        $('.filters .aside-wrap_head').on('click', function () {
            var btn = $(this).find('i.aside-wrap_btn');
            if(btn.is(':visible')){
                var menu = $('#filter-body');

                if(menu.hasClass('show')){
                    menu.removeClass('show');
                    btn.removeClass('show');
                }else{
                    menu.addClass('show');
                    btn.addClass('show');
                }
            }
        })


    },
    showSubmenu: function (){
        var _this = this,
            btn = $('.js-nav-caret');

        btn.on("click", function(){
            var item = $(this).closest('.js-resp-nav-el');

            if(item.hasClass('open')){
                item.removeClass('open');
                $(this).removeClass('open');
            }else{
                item.addClass('open');
                $(this).addClass('open');
            }
        });
    }
};

var mobileSearch = {
    init: function (){
        var btn = $('.js-show-header-nav-search'),
            form = $('.js-header-nav-search');

        btn.on("click", function (){
            if(form.is(":visible")){
                form.removeClass('show');
                $(this).removeClass('active');
            }else{
                form.addClass('show');
                $(this).addClass('active');
            }
        });
    }
};

var fixedPanel = {
    init: function (){
        var _this = this;

        var content = $("#main-content"),
            fixedPanel = $('.js-fixed');

        if(content.length && fixedPanel.length){

            _this.fixPanel(content, fixedPanel);

            $(window).scroll(function() {
                _this.fixPanel(content, fixedPanel);
            });

            $(window).resize(function() {
                _this.fixPanel(content, fixedPanel);
            });
        }
    },
    fixPanel: function (content, fixedPanel){
        var t = $(document).scrollTop();
        var contentTopX = content.offset().top;
        var viewp = viewport();
        
        var count_favorites = parseInt($('.js-count_favorites').text());
        var count_compare = parseInt($('.js-count_compare').text());
        var count_cart = parseInt($('.js-count_cart').text());

        var show = false;

        if(count_favorites > 0 || count_compare > 0 || count_cart > 0){
            show = true;
        }

        if ((t >= contentTopX || viewp.width <= 1000) && show) {
            if(!fixedPanel.is(":visible")){
                fixedPanel.css("padding", "3px 0");
                fixedPanel.css("bottom", "-50px");
                fixedPanel.addClass("show"); 
                fixedPanel.animate({bottom: "0"}, 200);
                fixedPanel.animate({"padding": "0"}, 300);
            }
        } else {
            fixedPanel.removeClass("show");
        }
    }
};

var subscribeForm = {
    init: function (){
        // MAILER app email subscribe form
        $('#mailer-subscribe-form input.charset').val(document.charset || document.characterSet);
        $('#mailer-subscribe-form').submit(function() {
            var form = $(this);

            var email_input = form.find('input[name="username"]'); // => input[name="email"] after check on valid email//
            var email_submit = form.find('.js-submit-form');
            var email_agree = form.find('input[name="agree"]');
            var loader = form.find('.js-subscribe-load');
            var error = false;

            email_input.removeClass('error');
            email_agree.closest('.js-subscribe-agree').removeClass('error');

            if(email_agree.length > 0 && !email_agree.is(':checked')){
                email_agree.closest('.js-subscribe-agree').addClass('error');
                error = true;
            }
            if(!email_input.val()){
                email_input.addClass('error');
                error = true;
            }else{
                if(!validateEmail(email_input.val())){
                    email_input.addClass('error');
                    error = true;
                }else{
                    email_input.attr('name', 'email');
                }
            }
            if(error === false){
                email_submit.hide();
                loader.show();
                $('#mailer-subscribe-error').hide();

                $.post(form.attr("action"), form.serialize(), function (response) {
                    email_input.attr('name', 'username');
                    if(response.status == "ok"){
                        $('.js-subscribe-inputs').hide();
                        if(response.data.html){
                            $('#mailer-subscribe-thankyou').html(response.data.html);
                        }
                        $('#mailer-subscribe-thankyou').show();
                        $('#mailer-subscribe-error').hide();
                    }else{
                        $('#mailer-subscribe-error').show();
                    }
                    email_submit.show();
                    loader.hide();
                });
            }else{
                email_input.attr('name', 'username');
            }


            return false;
        })
    }
};

var versionSite = {
    init: function (){
        var _this = this;

        _this.switchVersion();
        _this.removeLink();
    },
    switchVersion: function (){
        $('.js-switch-version-link').on("click", function (event){
            event.preventDefault();

            if($.cookie("is_desktop_for_mobile")){
                $.cookie("is_desktop_for_mobile", "", {path: '/', expires: 5});
            }else{
                $.cookie("is_desktop_for_mobile", 1, {path: '/', expires: 5});
            }
            location.reload();
        })
    },
    removeLink: function (){
        $('.js-switch-version-remove').on("click", function (event){
            event.preventDefault();

            $.cookie("is_hide_link_version_site", 1, {path: '/', expires: 1});
            $('.js-switch-version').remove();
        })
    }
};

var openMap = {
    init: function (){
        var _this = this;

        $('.js-open-map').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }
};

var tags = {
    init: function (){
        var _this = this;

        _this.showAll();
    },
    showAll: function (){
        var _this = this,
            btn = $('.js-show-tags');

        btn.on("click", function (){
            var $this = $(this),
                tags = $this.closest('.js-tags').find('.js-tag');

            if($this.hasClass('open')){
                $this.removeClass('open');
                tags.addClass("hide");
            }else{
                $this.addClass('open');
                tags.removeClass("hide");
            }
        });
    }
};

var skCallback = {
    init: function (){
        var _this = this;
        if($('[data-id="form_callback_id"]').length){
            var crm_callback_form = $('[data-id="form_callback_id"]').closest('form');
            crm_callback_form.find("input.crm-stranitsa_otpravki_formy-input").val(window.location.href);
        }

        _this.openModal();
        _this.onTriggerClose();
    },
    openModal: function () {
        var _this = this,
            buttons = $('.js-sk-callback-open'),
            block = $('.js-sk-callback-block');

        if (buttons.size() && block.size()) {
            buttons.magnificPopup({
                items: [
                    {
                        src: '.js-sk-callback-block',
                        type: 'inline'
                    }
                ],
                midClick: true,
                callbacks: {
                    open: function () {
                        _this.closeCustomModals();
                        block.trigger("event-open");
                    },
                    close: function () {
                        block.trigger("event-close");
                    }
                }
            });
        }
    },
    closeCustomModals: function(){
        $(".js-popup").hide();
        $("body").removeClass("_popup-open");
    },
    onTriggerClose: function () {
        var _this = this,
            block = $('.js-sk-callback-block');

        $(block).on("run-close", function () {
            $(this).find(".mfp-close").click();
        });
    }
};

$(function(){
    main.init();
    form.init();
    selectList.init();
    menu.init();
    slider.init();
    photoGallery.init();
    modalForm.init();
    dropDownWrap.init();
    categoriesMainMenu.init();
    mobileMenu.init();
    mobileSearch.init();
    fixedPanel.init();
    subscribeForm.init();
    versionSite.init();
    openMap.init();
    tags.init();
    skCallback.init();
});

$.fn.elementRealWidth = function () {
    $clone = this.clone()
        .css("visibility","hidden")
        .appendTo($('body'));
    var $width = $clone.outerWidth(true);
    $clone.remove();
    return $width;
};

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function is_touch_device() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).ready(function () {
    if(typeof(uni_page_name)!=='undefined') $('.crm-stranitsa_otpravki_formy-input').val(uni_page_name);
    $('.mycrm_form').submit(function(e){
    e.preventDefault();
    $.fancybox.close()
    var form=$(this);
    var formData = new FormData(this);
        $.ajax({
        processData: false,
        contentType: false,
        type: 'POST',
        url: form.attr('action'),
        dataType: "json",
        data: formData,
      success: function (res) {
        var text="Возникла ошибка при отправке, проверьте данные.";
        if(res.status && res.status=='ok'){
            text='Сообщение отправлено!<br>Спасибо, что обратились к нам';
            form.find('input[type="text"],input[type="date"],input[type="number"]').val('');
            $('#albom-one').removeClass("gray");
            $('#albom-two').removeClass("gray");
            $('#albom-three').removeClass("gray");
            $('#albom-fourth').removeClass("gray");
        }
        $.fancybox.open('<div style="max-width:450px;font-size: 18px;padding: 20px;text-align: center;">'+text+'</div>', {smallBtn: false, toolbar: false});

          //console.log(res.data.html);
      },
      error: function (response) {
        alert('Ошибка отправки');
      }
    });
    });
    $('.js_set_form_val').click(function(){
        var form=$(this).data('src');
        if(!form) return;
        form=$(form);
        if($(this).data('form_name'))form.find('input[name="crm_form[forma_otpravki]"]').val($(this).data('form_name'));
    });
});


