(function() {
    var equipProduct = {
        bindEvent: function() {
            $(".star").click(function() {
                var _id = $(this).parents(".card-item").data("id");
                if ($(this).attr('id') === "star-on") {
                    //取消星标事件
                    $(this).parent().children("#star-on").addClass("star-hide");
                    $(this).parent().children("#star-off").removeClass("star-hide");
                } else {
                    $(this).parent().children("#star-off").addClass("star-hide");
                    $(this).parent().children("#star-on").removeClass("star-hide");
                }
            });
            //详情下拉动画-
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
        },
        // 根据 localStorage 更新星标
		setStar: function() {
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			if (quoteLocalStage && quoteLocalStage.product) {
				var productArr = quoteLocalStage.product;
				var $star = $(".star");
				$star.each(function() {
                    console.log($(this).data("id"));
					if(~productArr.indexOf($(this).data("id"))) {
						$(this).parent().children("#star-off").addClass("star-hide");
						$(this).parent().children("#star-on").removeClass("star-hide");
					}
				})
			}
		},
        init: function() {
            var _this = this;
            _this.bindEvent();
            _this.setStar();
        }
    }
    equipProduct.init();
})()