(function() {
	var contact = {
		initMap: function() {
			var map = new AMap.Map('map', {
				resizeEnable: false,
				lang: 'zh_en',
				mapStyle: 'fresh',
				zoom: 14,
				center: [113.326019, 23.2567]
			});
			var marker = new AMap.Marker({
				position: [113.326019, 23.2567]
			});
			marker.setMap(map);
			marker.on('click', function(e) {
				infowindow.open(map, e.target.getPosition());
			})
			var infowindow;
			var infoWindowContent = '<div class="infowindow-content">' +
				'<div class="amap-info-header">xxxxxxxxxxxxxx</div>' +
				'<div class="amap-info-body">xxxxxxxxxxxxxxxxx</div>';

			map.plugin('AMap.AdvancedInfoWindow', function() {
				infowindow = new AMap.AdvancedInfoWindow({
					panel: 'panel',
					placeSearch: true,
					asOrigin: true,
					asDestination: true,
					content: infoWindowContent,
					offset: new AMap.Pixel(0, -30)
				});
				infowindow.open(map, [113.326019, 23.2567]);
			});
		},
		init: function() {
			var _this = this;
			_this.initMap();
		}
	}
	contact.init();
})()