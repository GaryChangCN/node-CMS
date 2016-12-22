(function() {
	var global = {
		bindEvent: function() {
			var _this = this;
            var maskDiv = '<div class="love-mask" style="width:100%;height:100%;position:fixed;z-index:250;left:0;top:0;background: #000 !important;opacity: 0.7 !important;"></div>';
			// 搜索
			$("body").on("blur", "input.search", function() {
				var keywords = $(this).val();
				var language = ~window.location.href.indexOf('language=en') ? '&language=en' : '';
				if (keywords) {
					window.location = window.location.origin + "/search.html?keywords=" + keywords + language;
				} else {
					return false;
				}
			});

			$("body").on("click", ".to-search", function() {
				var keywords = $(this).prev('input').val();
				var language = ~window.location.href.indexOf('language=en') ? '&language=en' : '';
				if (keywords) {
					window.location = window.location.origin + "/search.html?keywords=" + keywords + language;
				} else {
					return false;
				}
			});

			$("body").on("focus", "input.search", function() {
				var self = this;
				$(document).keyup(function(e){
					var key = e.which;
					if(key==13){
						var keywords = $(self).val();
						var language = ~window.location.href.indexOf('language=en') ? '&language=en' : '';
						if (keywords) {
							window.location = window.location.origin + "/search.html?keywords=" + keywords + language;
						} else {
							return false;
						}
					}
				});
			});

			$("body").on("click", ".star", function() {
				console.log($(this));
				var _id=$(this).parents(".card-item").data("id");
				if($(this).attr('id')==="star-on"){
					//取消星标事件
					$(this).parent().children("#star-on").addClass("star-hide");
					$(this).parent().children("#star-off").removeClass("star-hide");
					_this.ProductToQuote($(this).data("id"), "del");
				}else{
					$(this).parent().children("#star-off").addClass("star-hide");
					$(this).parent().children("#star-on").removeClass("star-hide");
					_this.ProductToQuote($(this).data("id"), "add");
				}
			});

			$("body").on("click", ".choose-combo", function() {
				var $combo = $(this).attr("combo");
				var $name = $(this).data("name") ? $(this).data("name") : "BEST CHOOSE";
				var $englishName = $(this).data("english") ? $(this).data("english") : "BEST CHOOSE";
				var $item = $(this).parent().parent(".card-item").find(".item-title");
				var productArr = [];
				$item.each(function() { productArr.push($(this).data("id"))});

				var combo = {
					combo: $combo,
					name: $name,
					englishName: $englishName,
					product: productArr
				}
				_this.comboToQuote(combo, "add");
			})

			$("body").on("click", ".delete-product", function() {
				var $id = $(this).data("id");
				_this.ProductToQuote($id, "del");
			});

			$("body").on("click", ".delete-combo", function() {
				var $combo = $(this).attr("combo");
				var combo = { combo: $combo }
				_this.comboToQuote(combo, "del");
			});

			$("body").on("click", ".remove-all", function() {
				_this.removeAll();
			});

			$("img").error(function() {
				$(this).attr("src", "http://ohnpdrepj.bkt.clouddn.com/%E9%BB%98%E8%AE%A4%E5%8A%A0%E8%BD%BD%E9%94%99%E8%AF%AF.png");
			});

			$(".love-remove-all").click(function() {
				_this.removeAll();
			})

            //控制pc端产品下拉panel
            $(".product").mouseover(function() {
                $(".slide-down").css('bottom', '-225px')
            }).mouseout(function() {
                $(".slide-down").css('bottom', '10px');
            });
            $(".slide-down").mouseout(function() {
                $(this).css('bottom', '10px');
            }).mouseover(function() {
                $(".slide-down").css('bottom', '-225px')
            }).children().mouseover(function() {
                $(".slide-down").css('bottom', '-225px')
            });
            //控制移动端下拉菜单1
            $(".open-slide-down").click(function() {
                var height = $(window).height() - $("slide-down").height() - 65;
                $(".mobile-navbar-cover").css('height', height + 'px');
                $(".slide-down").slideDown("fast", function() {
                    setTimeout(function() {
                        $(".open-slide-down").hide();
                        $(".open-slide-up").show();
                    }, 100);
                });
            });
            $(".open-slide-up,.mobile-navbar-cover").click(function() {
                $(".mobile-navbar-cover").css('height', '0');
                $(".open-mobile-search").show().next().hide(); //初始化搜索框
                $(".slide-down").slideUp("fast", function() {
                    setTimeout(function() {
                        $(".open-slide-down").show();
                        $(".open-slide-up").hide();
                    }, 100);
                });
            });
            $(".product").click(function() {
                $(".product-slide-down").not($(this).next()).slideUp();
                $(this).next(".product-slide-down").slideToggle();
            });
            //控制搜索样式
            $(".open-mobile-search").click(function() {
                $(this).hide().next().show().children("input").focus();
            });

            // 中英切换
            $(".select-language").click(function(e) {
                var url = window.location.href;
                if ($(this).hasClass("select")) return false;
                if ($(this).data("language") === "cn") {
                    if (~url.indexOf("?language=en")) {
                        if (window.location.search === "?language=en") {
                            url = url.replace("?language=en", "");
                        } else {
                            url = url.replace("?language=en", "?");
                        }
                    } else {
                        url = url.replace("&language=en", "");
                    }
                } else {
                    if (~url.indexOf("?")) {
                        url = url + "&language=en";
                    } else {
                        url = url + "?language=en";
                    }
                }
                window.location = url;
            })

            var ToggleLove = {
                open: function() {
                    $(".pc-love").addClass('select');
                    $(".love-container").css('right', '0px');
                    $("body").append(maskDiv);
                },
                close: function() {
                    $(".love-container").css('right', '-340px');
                    $(".pc-love").removeClass('select');
                    $(".love-mask").remove();
                }
            }
            $(".pc-love").click(function() {
                var a = $(".love-container");
                if (a.css('right') === "0px") {
                    ToggleLove.close();
                } else {
                    ToggleLove.open()
                }
            });
            $(".close-love").click(function() {
                ToggleLove.close();
            });
            $("body").on("click", ".love-mask", function() {
                ToggleLove.close();
            });
		},
		// 点击侧栏删除产品时取消星标
		delStar: function(productId) {
			if(/(search)|(equip-product)|(part-product)/i.test(window.location.href)) {
				var $star = $(".star");
				if(productId) {
					$star.each(function() {
						if($(this).data("id") === productId) {
							$(this).parent().children("#star-on").addClass("star-hide");
							$(this).parent().children("#star-off").removeClass("star-hide");
						}
					})
				} else {
					$star.each(function() {
						$(this).parent().children("#star-on").addClass("star-hide");
						$(this).parent().children("#star-off").removeClass("star-hide");
					})
				}
			}
		},
		// 产品添加或删除
		ProductToQuote: function(productId, state) {
			var _this = this;
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			if(quoteLocalStage)	{
				if(state === 'add') {
					if (~quoteLocalStage.product.indexOf(productId)) {
						alert("你已经把它添加到询单啦！");
						return;
					} else {
						quoteLocalStage.product.push(productId);
						_this.setQuoteStage(quoteLocalStage);
						_this.updateProductTemplate(productId, state);
					}
				} else {
					if(~quoteLocalStage.product.indexOf(productId)) {
						quoteLocalStage.product.splice(quoteLocalStage.product.indexOf(productId), 1);
						_this.setQuoteStage(quoteLocalStage);
						_this.updateProductTemplate(productId, state);
					} else {
						return;
					}
				}
			} else {
				_this.setQuoteStage();
				_this.ProductToQuote(productId, state);
			}
		},
		// 更新产品列表
		updateProductTemplate: function(productId, state) {
			var _this = this;
			if (state === "del") {
				if(~window.location.href.indexOf("quote.html")) {
					$("#quote-list").find(".product-item[product="+ productId +"]").remove();
					$("#nav-list").find("li[product="+ productId +"]").remove();
				} else {
					$("#nav-list").find("li[product="+ productId +"]").remove();
				}
				_this.delStar(productId);
			} else {
				var arr = [productId];
				$.post("/api/product/arr", { arr: JSON.stringify(arr) }, function(data) {
					var templateData = data;
					templateData.chinese = ~window.location.search.indexOf('language=en') ? false : true;
					var html = template("nav-quote-product", templateData);
					$("#nav-list").append(html);
					if(~window.location.href.indexOf("quote.html")) {
						var html2 = template("quote-product", templateData);
						$("#quote-list").append(html2);
					}
				});
			}
		},
		// 组合添加或删除
		comboToQuote: function(combo, state) {
			var _this = this;
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			if(quoteLocalStage)	{
				if(state === "add") {
					var isAdd = false;
					for(var i = 0; i < quoteLocalStage.combo.length; i++) {
						if(quoteLocalStage.combo[i].combo === combo.combo) {
							isAdd = true;
						}
					}
					if(!isAdd) {
						quoteLocalStage.combo.push(combo);
						_this.setQuoteStage(quoteLocalStage);
						_this.updateComboTemplate(combo, state);
					} else {
						alert("你已经把它添加到询单啦！");
						return;
					}
				} else {
					for(var i = 0; i < quoteLocalStage.combo.length; i++) {
						if(quoteLocalStage.combo[i].combo === combo.combo) {
							var delIndex = i;
						}
					}
					if (~delIndex) {
						quoteLocalStage.combo.splice(delIndex, 1);
						_this.setQuoteStage(quoteLocalStage);
	                    _this.updateComboTemplate(combo, state);
					} else {
						return;
					}
				}
			} else {
				_this.setQuoteStage();
				_this.comboToQuote(combo, state);
			}
		},
		// 更新组合列表
		updateComboTemplate: function(combo, state) {
			var _this = this;
			if (state === "del") {
				if(~window.location.href.indexOf("quote.html")) {
					$("#quote-list").find(".product-item[combo='"+ combo.combo +"']").remove();
					$("#nav-list").find("li[combo='"+ combo.combo +"']").remove();
				} else {
					$("#nav-list").find("li[combo='"+ combo.combo +"']").remove();
				}
			} else {
				var arr = [combo];
				var templateData = {
					list: arr,
					chinese: ~window.location.search.indexOf('language=en') ? false : true
				}
				var html = template("nav-quote-combo", templateData);
				$("#nav-list").append(html);
				if(~window.location.href.indexOf("quote.html")) {
					var html2 = template("quote-combo", templateData);
					$("#quote-list").append(html2);
				}
			}
		},
		// 清除所有
		removeAll: function () {
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			quoteLocalStage.product = [];
			quoteLocalStage.combo = [];
			if(~window.location.href.indexOf("quote.html")) {
				$("#quote-list").empty();
				$("#nav-list").empty();
			} else {
				$("#nav-list").empty();
			}
			this.setQuoteStage(quoteLocalStage);
			this.delStar();
		},
		// 初始化列表
		setQuoteTemplate: function() {
			debugger;
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			if(quoteLocalStage.combo.length > 0) {
				var templateData = {
					list: quoteLocalStage.combo,
					chinese: ~window.location.search.indexOf('language=en') ? false : true
				}
				var comboHtml = template("nav-quote-combo", templateData);
				$("#nav-list").append(comboHtml);
				if(~window.location.href.indexOf("quote.html")) {
					var comboHtml2 = template("quote-combo", templateData);
					$("#quote-list").append(comboHtml2);
				}
			};
			if(quoteLocalStage.product.length > 0) {
				$.post("/api/product/arr", { arr: JSON.stringify(quoteLocalStage.product) }, function(data) {
					var templateData = data;
					templateData.chinese = ~window.location.search.indexOf('language=en') ? false : true;
					var html = template("nav-quote-product", templateData);
					$("#nav-list").append(html);
					if(~window.location.href.indexOf("quote.html")) {
						var html2 = template("quote-product", templateData);
						$("#quote-list").append(html2);
					}
				});
			}
		},
		setQuoteStage: function(quote) {
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			var _this = this;
			if(quoteLocalStage && quoteLocalStage.createTime) {
				if(quote) {
					quote.updateTime = new Date();
					localStorage.setItem("quote", JSON.stringify(quote));
				} else {
					// 检查组合数据是否有效
					if(quoteLocalStage.combo.length > 0) {
						var effectiveCombo = [];
						for (var i = 0; i < quoteLocalStage.combo.length; i++) {
							if(quoteLocalStage.combo[i].combo) {
								effectiveCombo.push(quoteLocalStage.combo[i]);
							}
						}
						quoteLocalStage.combo = effectiveCombo;
						_this.setQuoteStage(quoteLocalStage);
					}

					var lastTime = quoteLocalStage.updateTime || quoteLocalStage.createTime;
					if(new Date() - new Date(lastTime) < quoteLocalStage.timeValuation) return;
				}
			} else {

				/*
				// 询单数据
				// product : 产品 id 数组
				// combo: 推荐组合数组。
				// combo = [{
				//   combo: 标志
				//	 name: name (组合名),
				//   englishName: englishName,
				// 	 product: ptodcut Array
				// }]
				// createTime: 数据创建时间
				// updateTime: 数据更新时间
				// timeValuation: 数据有效期，使用毫秒值表示
				// 30 天：2678400000
				// 1 年： 31536000000
				// 3 年：94608000000
				*/

				var q = {
					product: quote && quote.product ? quote.product : [],
					combo: quote && quote.combo ? quote.combo : [],
					createTime: new Date(),
					updateTime: new Date(),
					timeValuation: 94608000000
				}

				localStorage.setItem("quote", JSON.stringify(q));
			}
		},
		init: function() {
			var _this = this;
			FastClick.attach(document.body);
			template.config('openTag', '<%');
	    	template.config('closeTag', '%>');
			_this.bindEvent();
			_this.setQuoteStage();
			_this.setQuoteTemplate();
		}
	};
	global.init();
})()