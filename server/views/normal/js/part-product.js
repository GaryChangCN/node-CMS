(function() {
    var partProduct = {
        bindEvent: function() {
            $(".more").click(function(e) {
                e.preventDefault();
                $(this).parent().next().removeClass("card-cover-hide");
            });
            $(".des").click(function(e) {
                e.preventDefault();
            })

            $(".close-card-cover").click(function(e) {
                e.preventDefault();
                $(this).parent().parent().addClass("card-cover-hide");
            })

            $('.img-more').click(function(e) {
                e.preventDefault();
                var links = $(this).children('a');
                blueimp.Gallery(links);
            })

            $("body").on("click", ".tab-item", function(e) {
                e.preventDefault();
                var $id = $(this).data("id");
                var $this = $(this);
                if($this.hasClass("item-select")) return false;

                $(this).siblings().removeClass('item-select');
                $(this).addClass("item-select");
                $(".card").removeClass("card-show");
                $("#" + $id).addClass("card-show");
            });
        },
        // 根据 localStorage 更新星标
		setStar: function() {
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			if (quoteLocalStage && quoteLocalStage.product) {
				var productArr = quoteLocalStage.product;
				var $star = $(".star");
				$star.each(function() {
					if(~productArr.indexOf($(this).data("id"))) {
						$(this).parent().children("#star-off").addClass("star-hide");
						$(this).parent().children("#star-on").removeClass("star-hide");
					}
				})
			}
		},
        init: function() {
            this.bindEvent();
            this.setStar();
        }
    };
    partProduct.init();
})()