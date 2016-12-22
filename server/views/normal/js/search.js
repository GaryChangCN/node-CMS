(function() {
    var search = {
        bindEvent: function() {
            var _this = this;

            $('.tab-item').click(function(e) {
                if ($(this).hasClass('item-select')) return false;

                $(this).parent().children().removeClass('item-select');
                $(this).addClass('item-select');
                if ($(this).data('type') === 'product') {
                    $('#product').removeClass('hidden');
                    $('#explore').addClass('hidden');
                } else {
                    $('#product').addClass('hidden');
                    $('#explore').removeClass('hidden');
                }
            });

            $(".more").click(function(e) {
                e.preventDefault();
                $(this).parent().next().removeClass("card-cover-hide");
            });

            $(".des").click(function(e) {
                e.preventDefault();
            });

            $(".close-card-cover").click(function(e) {
                e.preventDefault();
                $(this).parent().parent().addClass("card-cover-hide");
            });

            $('.img-more').click(function(e) {
                e.preventDefault();
                var links = $(this).children('a');
                blueimp.Gallery(links, {
                    hidePageScrollbars: false,
                });
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
        search: function() {
            var keywords = window.location.search;
            var _this = this;

            $.get("/api/search" + keywords, function(data) {
                if (data.productList.length > 0 || data.articleList.length > 0) {
                    var searchData = data;
                    var searchKeywords = keywords.replace("&language=en", "");
                    searchKeywords = searchKeywords.replace("?keywords=", "");
                    searchData.keywords = decodeURI(searchKeywords);
                    searchData.articleLength = searchData.articleList.length;
                    searchData.productLength = searchData.productList.length;
                    for (var i = 0; i < searchData.articleList.length; i++) {
                        var keywordsIndex = searchData.articleList[i].content.indexOf(searchKeywords);
                        if (~keywordsIndex) {
                            searchData.articleList[i].content = searchData.articleList[i].content.replace(searchData.keywords, "<b>" + searchData.keywords + "</b>")
                            searchData.articleList[i].content = searchData.articleList[i].content.slice(Math.max(0, (keywordsIndex - 50)), (keywordsIndex + 50));
                        }
                    };
                    if (~keywords.indexOf('language=en')) {
                        searchData.chinese = false;
                    } else {
                        searchData.chinese = true;
                    }
                    _this.templateSearch(searchData);
                } else {
                    _this.templateSearch();
                }
            });
        },
        templateSearch: function(data) {
            var html = null;
			var _this = this;
            var keywords = window.location.search;
            if (data) {
                data.isNull = false;
                html = template('search-template', data);
            } else {
                if (~keywords.indexOf('language=en')) {
                    html = template('search-template', {
                        isNull: true,
                        chinese: false
                    })
                } else {
                    html = template('search-template', {
                        isNull: true,
                        chinese: true
                    })
                }
            }
            $('#search-content').html(html);
            _this.bindEvent();
            _this.setStar();
        },
        init: function() {
            this.search();
        }
    };
    search.init();
})();