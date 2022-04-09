if (!window.shop_dp) {
	window.shop_dp = {
		plugin_url: '/wa-apps/shop/plugins/dp/',
		dialog_url: '/dp-plugin/dialog/',
		service_url: '/dp-plugin/service/',
		calculate_url: '/dp-plugin/calculate/',
		svg_url: '/dp-plugin/svg/',
		point_url: '/dp-plugin/city-save/',
		city_search_url: '/dp-plugin/city-search/',
		city_save_url: '/dp-plugin/city-save/',
		location: {
			country_code: 'kaz',
			country_name: 'Казахстан',
			region_code: 'Алматы',
			region_name: '',
			city: 'Алматы'
		},
		loader: {
			assets: {},
			loadCSS: function(url) {
				$('<link>')
					.appendTo('head')
					.attr({
						type: 'text/css',
						rel: 'stylesheet',
						href: url
					});
			},
			load: function(asset, callback) {
				var self = this;

				var resolve = function (is_from_cache) {
					if (typeof callback === 'function' && asset in self.assets) {
						callback.call(window.shop_dp.loader.assets[asset], is_from_cache);
					}
				};

				if (window['shop_dp_is_loading_asset_' + asset]) {
					$(document).on('shop_dp_asset_loaded_' + asset, resolve);
					return false;
				}

				if (!(asset in this.assets) && !window['shop_dp_is_loading_asset_' + asset]) {
					window['shop_dp_is_loading_asset_' + asset] = true;

					$.ajax({
						dataType: 'script',
						cache: false,
						url:
							window.shop_dp.plugin_url +
							'js/' +
							(asset === 'core' ? 'core' : 'frontend.' + asset) +
							'.js',
						complete: function() {
							window['shop_dp_is_loading_asset_' + asset] = false;
							$(document).trigger('shop_dp_asset_loaded_' + asset);
							resolve(false);
						}
					});
				} else {
					resolve(true);
				}
			}
		},
		map_service: 'yandex',
		map_params: {"google_key":"AIzaSyCIgLKJaChaqtg2HnXti1ykjPxzRkmGZAU","yandex_key":"19b75426-2705-4c87-aaca-2a6b1c2d22fd"}
	};

	(function($) {
		window.shop_dp.loader.load('core');
	})(jQuery);
}
