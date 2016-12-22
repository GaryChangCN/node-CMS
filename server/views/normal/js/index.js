(function() {
    var index = {
        initSwiper: function() {
            new Swiper('.swiper-container-pc', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 'auto',
                paginationClickable: true,
                centeredSlides: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false
            });
            new Swiper('.swiper-container-moblie', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 'auto',
                paginationClickable: true,
                centeredSlides: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false
            });
        },
        init: function() {
            this.initSwiper();
        }
    };
    index.init();
})()