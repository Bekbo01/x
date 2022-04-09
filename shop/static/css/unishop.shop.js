var filter = {
    init: function (){
        var _this = this;

        _this.openOptions();
        _this.openCloseMobFilter();
        _this.send();
        _this.rangeOption();
        _this.showMoreOptions();

    },

    openOptions: function(){
        var _this = this;

        var title = $('.js-filter-title');

        title.on("click", function (){
            var filterItem = $(this).closest('.js-filter-item'),
                options = filterItem.find('.js-filter-options');

            if(!options.is(':visible')){
                options.slideDown();
                filterItem.removeClass('closed');
            }else{
                options.slideUp();
                filterItem.addClass('closed');
            }
        });
    },
    openCloseMobFilter: function(){
        var _this = this,
            filterHead = $('.js-mobile-filter-head'),
            filterBody = $('.js-mobile-filter-body');

        filterHead.on('click', function(){
            filterBody.toggle();
            if(filterHead.hasClass('filter-open')){
                filterHead.removeClass('filter-open');
            }else{
                filterHead.addClass('filter-open');
            }
        })
    },
    send: function (){
        $('.js-filters.js-ajax form input').change(function () {
            var form = $(this).closest('form');
            productList.ajaxUpdateListFormFields(form.serializeArray());
        });
        $('.js-filters.js-ajax form').submit(function () {
            var form = $(this);
            productList.ajaxUpdateListFormFields(form.serializeArray());
            return false;
        });
    },
    rangeOption: function (){
        $('.js-filters .js-filter-range').each(function () {
            if (!$(this).find('.js-slider-range').length) {
                $(this).append('<div class="js-slider-range"></div>');
            } else {
                return;
            }
            var min = $(this).find('.js-min');
            var max = $(this).find('.js-max');
            var min_value = parseFloat(min.attr('placeholder'));
            var max_value = parseFloat(max.attr('placeholder'));
            var step = 1;
            var slider = $(this).find('.js-slider-range');
            if (slider.data('step')) {
                step = parseFloat(slider.data('step'));
            } else {
                var diff = max_value - min_value;
                if (Math.round(min_value) != min_value || Math.round(max_value) != max_value) {
                    step = diff / 10;
                    var tmp = 0;
                    while (step < 1) {
                        step *= 10;
                        tmp += 1;
                    }
                    step = Math.pow(10, -tmp);
                    tmp = Math.round(100000 * Math.abs(Math.round(min_value) - min_value)) / 100000;
                    if (tmp && tmp < step) {
                        step = tmp;
                    }
                    tmp = Math.round(100000 * Math.abs(Math.round(max_value) - max_value)) / 100000;
                    if (tmp && tmp < step) {
                        step = tmp;
                    }
                }
            }
            slider.slider({
                range: true,
                min: parseFloat(min.attr('placeholder')),
                max: parseFloat(max.attr('placeholder')),
                step: step,
                values: [parseFloat(min.val().length ? min.val() : min.attr('placeholder')),
                         parseFloat(max.val().length ? max.val() : max.attr('placeholder'))],
                slide: function( event, ui ) {
                    var v = ui.values[0] == $(this).slider('option', 'min') ? '' : ui.values[0];
                    min.val(v);
                    v = ui.values[1] == $(this).slider('option', 'max') ? '' : ui.values[1];
                    max.val(v);
                },
                stop: function (event, ui) {
                    min.change();
                }
            });
            min.add(max).change(function () {
                var v_min =  min.val() === '' ? slider.slider('option', 'min') : parseFloat(min.val());
                var v_max = max.val() === '' ? slider.slider('option', 'max') : parseFloat(max.val());
                if (v_max >= v_min) {
                    slider.slider('option', 'values', [v_min, v_max]);
                }
            });
        });
    },
    showMoreOptions: function (){
        var btn = $('.js-filter-options-show-all');

        btn.click(function (event){
            event.preventDefault();

            var $this = $(this),
                optionsList = $this.closest(".js-filter-options"),
                optionsEls = optionsList.find('.js-filter-options-el');

            if(optionsEls.is(":hidden")){
                optionsEls.removeClass("hide");
                $this.find('.js-icon-plus').addClass("hide");
                $this.find('.js-icon-minus').removeClass("hide");
            }else{
                optionsEls.addClass("hide");
                $this.find('.js-icon-plus').removeClass("hide");
                $this.find('.js-icon-minus').addClass("hide");
            }


        });
    }
};

var cart = {
    init: function (){
        var _this = this;

        _this.addToCart();
        _this.cartDialog();
        _this.selectQuantity();
        _this.countQty();
    },
    cartDialog: function(){
        var _this = this;

        $('body').on( "click", ".js-product-card-dialog", function (){
            $.magnificPopup.open({
                items: {
                    src: $(this).data('href')
                },
                type: 'ajax',
                callbacks: {
                    ajaxContentAdded: function() {
                        this.content.find('input[type="checkbox"], input[type="radio"], .js-select').styler();
                        var productCard = this.content.find('#product-cart');
                        if(productCard.length && productCard.data('id')){
                            productListCustom.viewed(productCard.data('id'));
                        }
                    },
                    open: function() {
                        $.magnificPopup.instance._onFocusIn = function(e) {
                            if( $(e.target).closest( '#storequickorder' ) ) {
                                return true;
                            }
                            $.magnificPopup.proto._onFocusIn.call(this,e);
                        };
                    }
                }
            }, 0);
        });
    },
    addToCart: function (){
        var _this = this;
        
        $('body').on('submit', '.js-add-to-cart', function(event){
            event.preventDefault();

            var $this = $(this),
                url = $this.attr('action'),
                data = $this.serialize(),
                previewCartCount = $('.js-cart-preview-count'),
                previewCartTotal = $('.js-cart-preview-total'),
                cartDialog = $('#cart-form-dialog'),
                btn = $this.find(".js-submit-form");

            btn.addClass("cart-loading");
            $.post(url + '?html=1', data, function (response) {
                btn.removeClass("cart-loading");

                if(response.status == 'ok'){
                    previewCartCount.html(response.data.count);
                    previewCartTotal.html(response.data.total);
                    
                    var productBlock = $this.closest('.js-product').find('.js-product-cart-preview');
                    if(productBlock.length == 0){
                        productBlock = $this.closest('.js-product-cart-preview');
                    }
                    if(cartDialog.length > 0){
                        $.magnificPopup.close();
                    }
                    var position = productBlock.data('position');
                    var productBlockCopy = $('<div></div>').append(productBlock.html());
                    var cart_preview = $('.js-fixed .js-preview-cart');
                    if(!cart_preview.length || !cart_preview.is(':visible')){
                        cart_preview = $('.js-header-cart');
                    }

                    productBlockCopy.css({
                        'z-index': 100,
                        top: productBlock.offset().top,
                        left: productBlock.offset().left,
                        width: productBlock.width()+'px',
                        height: productBlock.height()+'px',
                        position: (position) ? position :'absolute',
                        overflow: 'hidden',
                        background: "#FFF"
                    }).insertAfter('body').animate({
                        top: cart_preview.offset().top,
                        left: cart_preview.offset().left,
                        width: 0,
                        height: 0,
                        opacity: 0.7
                    }, 650, function() {
                        productBlockCopy.remove();

                        productListCustom.showAddedMsg($('.js-preview-cart'));
                    });
                }else{
                    messages.notifyDanger(response.errors);
                }
            }, 'json');
        });
    },
    selectQuantity: function (){
        var _this = this;

        $('body').on("click", '.js-pr-count-action', function(){
            var $this = $(this),
                action = $this.data('action'),
                wrap = $this.closest('.js-pr-count'),
                inputQuantity = wrap.find('input'),
                quantity = inputQuantity.val();

            if(action == 'add'){
                inputQuantity.val(parseInt(quantity) + 1);
            }else{
                if(quantity > 1){
                    inputQuantity.val(parseInt(quantity) - 1);
                }
            }
            inputQuantity.change();
        });
    },
    countQty: function (){
        $('body').on("click", ".js-qty-action", function(){
            var $this = $(this),
                wrapOut = $this.closest('.js-qty'),
                action = $this.data('type'),
                input = wrapOut.find('input'),
                currentQty = parseInt(input.val());

            if(action == "-"){
                if(currentQty > 1 ){
                    currentQty--;
                }else{
                    currentQty = 1;
                }
            }else{
                if(currentQty){
                    currentQty++;
                }else{
                    currentQty = 1;
                }
            }

            input.val(currentQty);
            input.change();
        });
    }

};

var messages = {

    notifySuccess: function(text, offset){
        if(!text) text = 'Sent!';
        $.notify({
            message: text,
            icon: 'fa fa-check'
        },{
            delay: 5000,
            type: 'success',
            placement: {
                align: "right",
                from: 'bottom'
            }
        });
    },
    notifyRemoveElement: function(text){
        if(!text) text = 'Deleted!';
        $.notify({
            message: text
        },{
            delay: 5000,
            placement: {
                align: "right",
                from: 'bottom'
            }
        });
    },
    notifyDanger: function(text){
        if(!text) text = 'An error has occurred!';
        $.notify({
            message: text,
            icon: 'fa fa-exclamation-circle'
        },{
            delay: 5000,
            type: 'danger',
            placement: {
                align: "right",
                from: 'bottom'
            }
        });
    }

};



var specialProducts = {
    init: function (){
        var _this = this;

        $('.js-special-list').bxSlider({
            slideWidth: 244,
            minSlides: 1,
            maxSlides: 5,
            slideMargin: 15,
            moveSlides: 1,
            pager: false,
            nextText: '',
            prevText: '',
            infiniteLoop: false,
            hideControlOnEnd: true

        });


    }
};

var carouselBrands = {
    init: function (){
        $('.js-main-brands').bxSlider({
            slideWidth: 256,
            minSlides: 1,
            maxSlides: 5,
            slideMargin: 0,
            moveSlides: 1,
            pager: true,
            nextText: '',
            prevText: ''
        });
    }
};

var productList = {
    init: function (){
        var _this = this;

        _this.switchProductListView();
        _this.setCountPerPageProducts();
        _this.productTile();
    },
    switchProductListView: function(){
        var _this = this,
            cookieOptions = {expires: 7, path: '/'},
            switchBtn = $('.js-switch-pr-view');

        $('body').on('click', '.js-switch-pr-view', function(){
            var $this = $(this),
                type = $this.data('view');

            if(type){
                $.cookie('CategoryProductsView', type, cookieOptions);
            }

            var form = $('.js-filters.js-ajax form');

            _this.ajaxUpdateList(window.location.search);

            switchBtn.removeClass('selected');
            $this.addClass('selected');
        });


    },
    setCountPerPageProducts: function () {
        var _this = this,
            select = $('#set-per-page');

        select.change(function () {
            var $this = $(this),
                count = $this.val(),
                cookieOptions = {expires: 7, path: '/'};

            $.cookie('products_per_page', count, cookieOptions);
            var href = window.location.href.replace(/(page=)\w+/g, 'page=1');
            window.location.href = href;
        });

    },
    ajaxUpdateListFormFields: function(fields){
        var _this = this,
            params = [];

        for (var i = 0; i < fields.length; i++) {
            if (fields[i].value !== '') {
                params.push(fields[i].name + '=' + fields[i].value);
            }
        }
        var url = '?' + params.join('&');
        _this.ajaxUpdateList(url, true);
    },
    ajaxUpdateList: function(url, $isPushState){
        var _this = this;
        var productList = $('.js-product-list-ajax');
        var loader = $('.js-product-list-ajax-loader');

        $(window).lazyLoad && $(window).lazyLoad('sleep');
        productList.html("");
        loader.show();
        var getUrl = (url.indexOf('?') < 0) ? url+'?_' : url;
        getUrl += '&_=_'+ (new Date().getTime()) + Math.random();
        $.get(getUrl, function(html) {
            var tmp = $('<div></div>').html(html);
            productList.html(tmp.find('.js-product-list-ajax').html());
            productList.find('img').retina();


            loader.hide();
            if (!!(history.pushState && history.state !== undefined) && $isPushState) {
                if(url == "?") url = window.location.pathname;
                window.history.pushState({}, '', url);
            }

            $(window).lazyLoad && $(window).lazyLoad('reload');

            $(window).on("popstate", function(e) {
                location.reload();
            });

            _this.productTile();
            if (typeof $.autobadgeFrontend !== 'undefined') {
                $.autobadgeFrontend.reinit();
            }
            if (typeof $.pluginprotilegallery !== 'undefined') {
                $.pluginprotilegallery.lazyload();
            }

        });
    },
    productTile: function (){
        var product = $('.no-touch .js-product-tile'), timeOut;

        product.hover(function(){
            var $this = $(this),
                prevProduct = $this.prev(),
                btnActions = $this.find('.js-action'),
                dialog = $this.find('.js-dialog');

            btnActions.css({marginTop: "15px", opacity: 0});

            if(prevProduct.length && $this.offset().top == prevProduct.offset().top){
                prevProduct.addClass('next-hover');
            }

            $this.addClass('hover');
            btnActions.first().show();
            btnActions.first().animate({ marginTop: "0", opacity: 1}, 300 );
            timeOut = setTimeout(function(){
                btnActions.last().show();
                btnActions.last().animate({ marginTop: "0", opacity: 1}, 150 );
            }, 150);

            dialog.fadeIn();

            //var img = $this.find('.js-product-tile-img');
            //img.animate({maxHeight: "100%", maxWidth: "100%"}, 150);

        }, function (){
            var $this = $(this),
                prevProduct = $this.prev(),
                btnActions = $this.find('.js-action'),
                dialog = $this.find('.js-dialog');

            clearTimeout(timeOut);
            prevProduct.removeClass('next-hover');
            $this.removeClass('hover');
            btnActions.first().stop();
            btnActions.last().stop();
            btnActions.hide();
            dialog.hide();

            //var img = $this.find('.js-product-tile-img');
            //img.stop();
            //img.removeAttr("style");

        });
    }
};

var productListCustom = {
    init: function() {
        var _this = this;

        _this.compare();
        _this.favorites();
        _this.clear();
        _this.viewed();
    },
    viewed: function($productId){
        var _this = this;

        if($('#product-cart').length && $('#product-cart').data('id')){
            _this.add('viewed_list', $('#product-cart').data('id'), 20);
        }
    },
    compare: function(){
        var _this = this;

        _this.list(
            'shop_compare',
            $(".js-preview-compare"),
            '.js-add-to-compare',
            compareProductSidebar.list
        );
    },
    favorites: function(){
        var _this = this;

        _this.list(
            'favorites_list',
            $(".js-preview-favorite"),
            '.js-add-to-favorites'
        );
    },
    list: function (listName, listPreviewWrap, elAddToListBtn, callbackFunction){
        var _this = this;

        $("body").on('click', elAddToListBtn, function (event) {
            event.preventDefault();
            var $this = $(this),
                countInList = 0,
                isAdded = true,
                countPreviewView = listPreviewWrap.find('.js-products-list-count'),
                linPreviewView = listPreviewWrap.find('.js-products-list-link'),
                productId = $(this).data('product');

            if (!$this.hasClass('active')) {
                countInList = _this.add(listName, productId);
            } else {
                countInList = _this.remove(listName, productId);
                isAdded = false;
            }
            var url = (countInList > 0) ? linPreviewView.attr('href').replace(/compare\/.*$/, 'compare/' + _this.get(listName) + '/') : '/compare/';

            linPreviewView.attr('href', url);
            countPreviewView.html(countInList);

            if(isAdded){
                _this.showAddedMsg(listPreviewWrap);
            }

            $(elAddToListBtn + "[data-product='"+productId+"']").toggleClass('active');

            if(callbackFunction){
                callbackFunction({that: $this, url: url, productId: productId, isAdded: isAdded});
            }
        });
    },
    add: function(listName, productId, limit){
        var _this = this, list = $.cookie(listName), listArr = [];

        if (list && list != "null" && list != "0" ) {
            list = list.replace(",null", "");
            list = list.replace(",0", "");
            var listArr = list.split(',');

            var i = $.inArray(productId + '', listArr);
            if (i != -1) {
                listArr.splice(i, 1);
            }
        }
        listArr.unshift(productId);

        if(limit){
            listArr.splice(limit);
        }

        _this.save(listArr, listName);

        return listArr.length;
    },
    remove: function(listName, productId){
        var _this = this, list = $.cookie(listName);

        if (list) {
            list = list.split(',');
        } else {
            list = [];
        }
        var i = $.inArray(productId + '', list);
        if (i != -1) {
            list.splice(i, 1);
        }

        _this.save(list, listName);

        return list.length;
    },
    get: function(listName){
        return $.cookie(listName);
    },
    save: function(list, listName){
        if (list.length > 0) {
            for(var i = 0; i < list.length; i ++){
                if (!parseInt(list[i])){
                    list.splice(i, 1);
                }
            }
        }
        if (list.length > 0) {
            $.cookie(listName, list.join(','), { expires: 30, path: '/'});
        } else {
            $.cookie(listName, null, {path: '/'});
        }
    },
    clear: function (){
        var _this = this, btn = $('.js-clear-pr-list');

        btn.on("click", function (){
            var $this = $(this),
                list = [],
                listName = $this.data("list") + "_list";

            _this.save(list, listName);
            location.reload();

        });
    },
    showAddedMsg: function(listPreviewWrap){
        listPreviewWrap.addClass('active');
        setTimeout(function(){
            listPreviewWrap.removeClass('active');
        }, 3000);
    }
};

var compareProductSidebar = {
    list: function(params){
        var $this = params.that,
            url = params.url,
            productId = params.productId,
            isAdded = params.isAdded,
            productsFullWrap = $('.js-compare-products-full'),
            productsEmptyWrap = $('.js-compare-products-empty'),
            productsList = $('.js-compare-products-list'),
            template = $('.js-compare-template');

        $('.js-sidebar-compare-link').attr("href", url);

        if(!isAdded){
            var product = $('.js-compare-product[data-product="'+productId+'"]');
            product.remove();
        }else{
            if(productsList.length && $this.data('name') && template){
                var addedProduct = template.clone();
                addedProduct.removeClass('js-compare-template').addClass('js-compare-product');
                addedProduct.attr("data-product", productId);
                addedProduct.find('.js-add-to-compare').attr("data-product", productId).addClass('active');
                addedProduct.find('.js-compare-name').text($this.data('name'));
                addedProduct.find('.js-compare-name').attr("href", $this.data('url'));
                addedProduct.find('.js-compare-img').attr("href", $this.data('url'));
                if($this.data('img')){
                    addedProduct.find('.js-compare-img').html("<img src='"+$this.data('img')+"'>");
                }
                template.after(addedProduct);
                addedProduct.show();
             }
        }

        if($('.js-compare-product').length){
            productsEmptyWrap.hide();
            productsFullWrap.show();
        }else{
            productsEmptyWrap.show();
            productsFullWrap.hide();
        }
    }
};

var lazyloadingPagination = {
    init: function() {
        var _this = this;

        if ($.fn.lazyLoad) {
            var paging = $('.lazyloading-paging');
            if (!paging.length) {
                return;
            }

            var times = parseInt(paging.data('times'), 10);
            var loading_str = paging.data('loading-str') || 'Loading...';

            // check need to initialize lazy-loading
            var current = paging.find('li.selected');
            if (current.children('a').text() != '1') {
                return;
            }
            paging.hide();
            var win = $(window);

            // prevent previous launched lazy-loading
            win.lazyLoad('stop');

            // check need to initialize lazy-loading
            var next = current.next();
            if (next.length) {
                win.lazyLoad({
                    container: '.js-product-list-ajax .js-category-list',
                    load: function () {
                        win.lazyLoad('sleep');

                        var paging = $('.lazyloading-paging').hide();

                        // determine actual current and next item for getting actual url
                        var current = paging.find('li.selected');
                        var next = current.next();
                        var url = next.find('a').attr('href');
                        if (!url) {
                            win.lazyLoad('stop');
                            return;
                        }
                        var product_list = $('.js-product-list-ajax .js-category-list');
                        var loading = $('<div class="lazyloading-paging-loader"><i class="icon16 loading"></i>'+loading_str+'</div>').insertAfter('.js-product-list-ajax');

                        $.get(url, function (html) {
                            var tmp = $('<div></div>').html(html);
                            if ($.Retina) {
                                tmp.find('.product-tbl-img img, .products-list_item-img img, .product-tile_img img').retina();
                            }
                            product_list.append(tmp.find('.js-product-list-ajax .js-category-list').children());
                            var tmp_paging = tmp.find('.lazyloading-paging').hide();
                            paging.replaceWith(tmp_paging);
                            paging = tmp_paging;

                            var current = paging.find('li.selected');
                            var next = current.next();
                            if (next.length) {
                                if (!isNaN(times) && times <= 0) {
                                    win.lazyLoad('sleep');
                                    if (!$('.lazyloading-load-more').length) {
                                        $('<a href="#" class="lazyloading-load-more">' + link_text + '</a>').insertAfter(paging)
                                            .click(function () {
                                                loading.show();
                                                times = 1;      // one more time
                                                win.lazyLoad('wake');
                                                win.lazyLoad('force');
                                                return false;
                                            });
                                    }
                                } else {
                                    win.lazyLoad('wake');
                                }
                            } else {
                                win.lazyLoad('stop');
                                $('.lazyloading-load-more').hide();
                            }

                            productList.productTile();
                            if (typeof $.autobadgeFrontend !== 'undefined') {
                                $.autobadgeFrontend.reinit();
                            }
                            if (typeof $.pluginprotilegallery !== 'undefined') {
                                $.pluginprotilegallery.lazyload();
                            }
                            loading.remove();
                            tmp.remove();
                        });
                    }
                });
            }
        }
    }
};

var countdown = {
    init: function (){
        $(".js-promo-countdown").each(function(){
            var $this = $(this),
                dateEnd = $this.data("end"),
                dayText = $this.data("day-text"),
                isWrap = $this.data("wrap");

            $this.countdown(dateEnd, function(event) {
                if(isWrap){
                    $('.js-countdown-days').html(event.strftime('%D'));
                    $('.js-countdown-hours').html(event.strftime('%H'));
                    $('.js-countdown-minutes').html(event.strftime('%M'));
                    $('.js-countdown-seconds').html(event.strftime('%S'));
                }else{
                    $this.text(event.strftime('%D ' + dayText + ' %H:%M:%S'));
                }
            });
        });


    }
};

var brandsCarousel = {
    init: function (){
        $('.js-brands-carousel').owlCarousel({
            items: 5,
            nav: true,
            navText: ["",""],
            lazyLoad:false,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                900: {
                    items: 3
                },
                1200: {
                    items: 4
                },
                1500: {
                    items: 5
                }
            }
        });
    }
};

var productCarousel = {
    init: function (){
        var _this = this;

        var caruselList = $(".js-product-carusel");

        if(caruselList.length){
            caruselList.each(function(){
                _this.carousel($(this));
            });
        }
    },
    carousel: function (carouselProducts){
        var _this = this;

        carouselProducts.removeClass("active");
        carouselProducts.parent().find('.js-carusel-more').remove();
        carouselProducts.addClass("product-carusel");
        carouselProducts.after('<span class="carusel_more js-carusel-more"></span>');

        var products = carouselProducts.find('.js-product-tile');
         products.removeClass('hide');
        if(products.length){
            var firstProduct = products.first(),
                firstProductOffsetTop = firstProduct.offset().top,
                countLine = carouselProducts.data("count-line") ? parseInt(carouselProducts.data("count-line")) : 1,
                indexLine = 0,
                prevProductOffsetTop = 0,
                countInLine = 0;

            products.each(function(){
                var currentProduct = $(this),
                    currentProductOffsetTop = currentProduct.offset().top;

                if(currentProductOffsetTop != prevProductOffsetTop){
                    indexLine++;
                }

                if (indexLine == 1){
                    countInLine++;
                }

                if(firstProductOffsetTop < currentProductOffsetTop && indexLine <= countLine){
                    firstProductOffsetTop = currentProductOffsetTop;
                }

                if(firstProductOffsetTop < currentProductOffsetTop && countInLine > 2){
                    currentProduct.addClass("hide");
                    carouselProducts.addClass("active");
                }
                prevProductOffsetTop = currentProductOffsetTop;
            });
            _this.showElements(carouselProducts, countInLine);
        }
    },
    showElements: function (carouselProducts, countInLine){
        var btnShowMore = carouselProducts.parent().find('.js-carusel-more');

        btnShowMore.on("click", function(){
            var products = carouselProducts.find('.js-product-tile');
            var productsHide = carouselProducts.find('.js-product-tile.hide');

            var index = 0;
            productsHide.each(function(){
                var currentProduct = $(this);

                if (index < countInLine){
                    currentProduct.removeClass("hide");
                    currentProduct.find(".js-product-tile-img").removeAttr("height").removeAttr("width");
                }

                index++;
            });

            var currentProductsHide = carouselProducts.find('.js-product-tile.hide');
            if(currentProductsHide.length){
                carouselProducts.addClass("active");
            }else{
                carouselProducts.removeClass("active");
            }

            if (typeof $.autobadgeFrontend !== 'undefined') {
                $.autobadgeFrontend.reinit();
            }
        });
    }
};

var categories = {
    init: function (){
        var _this = this;

        _this.sidebar();
    },
    sidebar: function (){
        var _this = this;

         _this.sidebarInit();

        var openBtn = $('.js-subcat-open');

        openBtn.click(function(){
            var $this = $(this), subs = $($this.parent().find('.js-subcat')[0]);

            if(!subs.is(':visible')){
                subs.slideDown();
                $this.addClass('selected');
            }else{
                subs.slideUp();
                $this.removeClass('selected');
            }
        });
    },
    sidebarInit: function (){
        var treeCats = $('.js-sidebar-cats'),
            currentCat = treeCats.find('.selected'),
            outWrap = currentCat.parents(".js-subcat");

        outWrap.removeClass('hide');
        outWrap.each(function(){
            $(this).parent().find('.js-subcat-open').first().addClass('selected');
        });
    }
};

var categoryText = {
    readMore: function (){
        var wrapOuter = $(".js-category-text-wrap"),
            maxHeight = wrapOuter.data("max-height"),
            wrap = $(".js-category-text"),
            linkMore = $('.js-category-text-more-wrap');

        linkMore.remove();
        //wrapOuter.removeClass("close");
        if (wrapOuter.length && maxHeight){
            wrapOuter.css("max-height", maxHeight + "px");
        }
        if(wrapOuter.length && wrap.length && wrapOuter.outerHeight() < wrap.outerHeight()){
            var textMore = wrapOuter.data("text-more"),
                textHide = wrapOuter.data("text-hide");

            //wrapOuter.addClass("close");
            wrapOuter.after("<div class='js-category-text-more-wrap category-text-more-wrap'><span class='js-category-text-more category-text-more sd-color link-half'>"+textMore+"</span></div>");

            $('.js-category-text-more').on("click", function(){
                var $this = $(this);

                if($this.hasClass("open")){
                    $this.removeClass("open");
                    //wrapOuter.addClass("close");
                    $this.text(textMore);
                    wrapOuter.animate({maxHeight: maxHeight}, 500);
                }else{
                    wrapOuter.animate({maxHeight: wrap.outerHeight() + "px"}, 500);
                    $this.addClass("open");
                    //wrapOuter.removeClass("close");
                    $this.text(textHide);
                }

            });
        }else{
            wrapOuter.removeAttr("style");
        }
    }
};

var reviews = {
    init: function(){
        var _this = this;

        _this.carousel();
    },
    carousel: function (){
        var owl = $('.js-reviews-carusel');
        owl.owlCarousel({
            items: 2,
            margin: 20,
            dots: false,
            nav: true,
            navText: ["",""],
            responsive: {
                0: {
                    items: 1
                },
                900: {
                    items: 2
                },
                1200: {
                    items: 3
                }
            }
        });
    }
};

$(document).ready(function() {
    cart.init();
    specialProducts.init();
    carouselBrands.init();
    filter.init();
    productList.init();
    productListCustom.init();
    lazyloadingPagination.init();
    countdown.init();
    brandsCarousel.init();
    productCarousel.init();
    categories.init();
    categoryText.readMore();
    reviews.init();
});

$(function(){
    if(typeof window.seofilterOnFilterSuccessCallbacks === 'undefined'){
        window.seofilterOnFilterSuccessCallbacks = []
    }
    window.seofilterOnFilterSuccessCallbacks.push(
        function(){
            $('.js-filter-body').find('input[type="checkbox"], input[type="radio"], .js-select').trigger('refresh');
            categoryText.readMore();
        }
    )
});