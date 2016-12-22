(function() {
	var equipDetail = {
		bindEvent: function() {
			$('.choose .card-item').mouseenter(function() {
	        	if ($(this).hasClass('active')) { return false; }

				$(this).parent().children('li').removeClass('active');
				$(this).addClass('active');
			});
		},
		init: function() {
			this.bindEvent();
		}
	};
	equipDetail.init();
})();