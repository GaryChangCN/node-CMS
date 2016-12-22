(function(){
	var centerDetail = {
		init: function() {
			var swiper = new Swiper('.swiper-container', {
				slidesPerView: 'auto',
				paginationClickable: true,
				centeredSlides: true,
				autoplay: 2000,
				autoplayDisableOnInteraction: false
			});
		}
	};
	centerDetail.init();
})();