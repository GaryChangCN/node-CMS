(function() {
    var support = {
        bindEvent: function() {
            $('.sale-item').click(function() {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $('.sale-text-group').find('.active').removeClass('active');
                } else {
                    $(this).siblings('.active').removeClass('active');
                    $(this).addClass('active');
                    var itemId = $(this).data('item');
                    $('.sale-text-group').find('.active').removeClass('active');
                    $('.sale-text-group').find('div[data-text=' + itemId + ']').addClass('active');
                }
            })
        },
        init: function() {
            this.bindEvent();
        }
    };
    support.init();
})();