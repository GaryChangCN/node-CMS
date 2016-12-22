(function() {
	var library = {
		bindEvent: function() {
			$('.collapsible-header').click(function(e) {
				e.preventDefault();
				$('.collapsible').children('li').removeClass('active');
				$(this).parent('li').toggleClass('active');
			})

			$('.menu-item').click(function (e) {
				e.preventDefault();
				var $name = $(this).data('name');
						$(this).siblings(".menu-item").removeClass('active');
						$(this).addClass('active');
				$('.main').removeClass('active');
				$('.main').addClass(function() {
					if ($(this).data('parent') === $name) return 'active';
				})
			})
		},
		init: function() {
			this.bindEvent();
		}
	};
	library.init();
})()