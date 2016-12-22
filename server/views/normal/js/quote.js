(function() {
	var quote = {
		errorCount: 0,
		chinese: ~window.location.href.indexOf('language=en') ? false : true,
 		bindEvent: function() {
			var _this = this;
			$('.input-field .input').focus(function(e) {
				e.preventDefault();
				$(this).next('label').addClass('active');
			});
			$('.input-field .input').blur(function(e) {
				e.preventDefault();
				if (!$(this).val()) { $(this).next('label').removeClass('active'); }
			});
			$('.caret').click(function(e) {
				e.preventDefault();
				$(this).parent().find('input').focus();
				var ul = $(this).parent().find('ul');
				ul.show('400', function() {
					_this.listenClick2hide(this);
				});
			});
			$('.dropdown-content li').click(function(e) {
				e.preventDefault();
				var selectValue = $(this).text();
				var selectWrapper = $(this).parent().parent();
				selectWrapper.find('input').val(selectValue);
				$(this).parent().hide();
			})
			$('.select-dropdown-readonly').click(function(e) {
				e.preventDefault();
				var caret = $(this).parent().find('span');
				var ul = $(this).parent().find('ul');
				ul.show('400', function() {
					_this.listenClick2hide(this);
				});
			})

			$(".submit-quote").click(function(e) {
				console.log(e);
				e.preventDefault();
				_this.sendQuote();
			})
		},
		listenClick2hide: function(target) {
 			$(document).click(function(e) {
                if (e.target != target) {
                    $(target).hide();
                    $(document).off();
                }
            });
		},
		sendQuote: function() {
	        if(!$("#name").val()) {
	            alert("请填写完整你的名字！");
	            return false;
	        }
	        if(!$("#email").val()) {
	            alert('请填写你的邮箱！');
	            return false;
	        }
	        if(!$("#country").val()) {
	            alert('请选择你的国家或地区！');
	            return false;
	        }
	        if(!$("#currency").val()) {
	            alert('请选择你希望的报价币种');
	            return false;
	        }
	        if(!$("#phone").val()) {
	            alert('请填写你的电话！');
	            return false;
	        }
	        if($("#quote-list").children(".product-item").length <= 0) {
	            alert('请选择你要咨询的商品！');
	            return false;
	        }

			$(".submit-quote").prop("disabled", true);
			$(".submit-quote").text().indexOf("提交") ? $(".submit-quote").text("提交中……") : $(".submit-quote").text("Loading……");

			var customerOther = "客户的国家或地区：" + $("#country").val()  + "；客户的邮箱：" + $("#email").val() + "；客户的其他联系方式：" + $("#other").val() + "客户的备注信息：" + $("#remarks").val();
			var moneyMap = {
				"CNY 人民币": "RMB",
				"MYR 马来西亚令吉": "RM",
				"HKD 港币": "HKD",
				"USD 美元": "USD"
			}
	        var data = {
				customerName: $("#name").val(),
				customerContact: $("#phone").val(),
				money: moneyMap[$("#currency").val().trim()],
				customerBoard: customerOther
			};
	        var productList = $("#quote-list").children(".product");
	        var comboList = $("#quote-list").children(".combo");
			var quoteLocalStage = JSON.parse(localStorage.getItem("quote"));
			var customerProduct = [];
			var comboMap = {};
			var customCombo = [];

			for (var k = 0; k < quoteLocalStage.combo.length; k++) {
				comboMap[quoteLocalStage.combo[k].englishName] = quoteLocalStage.combo[k];
			}

			for(var j = 0; j < comboList.length; j++) {
				var thisComboProduct = comboMap[$(comboList[j]).attr("combo")].product;
				for (var d = 0; d < thisComboProduct.length; d++) {
					customCombo.push({
						_id: thisComboProduct[d],
						count: $(comboList[j]).find("input[type=number]").val()
					})
				}
			}
			console.log(customCombo);
	        for(var i = 0; i < productList.length; i++) {
				customerProduct.push({
					_id: $(productList[i]).attr("product"),
					count: $(productList[i]).find("input[type=number]").val()
				});
	        }

			data.customerProduct = JSON.stringify(customerProduct.concat(customCombo));
			console.log(data);
			$.ajax({
	            type: "post",
	            url: "/api/order",
	            data: data,
				dataType: "json",
				complete: function() {
					console.log("complete");
				},
	            success: function(response) {
					if(!data.err) {
						alert("Success！");
						$(".submit-quote").prop("disabled", false);
						$(".submit-quote").text().indexOf("提交") ? $(".submit-quote").text("提交") : $(".submit-quote").text("Submit");
					} else {
						alert("Error！")
					}
	            },
				error: function(data) {
					alert("Error！")
				}
	        });
		},
		init: function() {
			var _this = this;
			_this.bindEvent();
		}
	};
	quote.init();
})()

