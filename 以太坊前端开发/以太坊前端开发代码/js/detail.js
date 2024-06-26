$(function () {
	var goodsId = sessionStorage.getItem("goodsId");

	// 检查是否存在商品 ID
	if (!goodsId) {
		console.error("商品id不存在");
		return;
	}

	// 使用 axios 获取商品详情
	axios
		.get(`http://localhost:9000/goods/item/${goodsId}`)
		.then(function (res) {
			if (res.data.code === 1) {
				const goods = res.data.info;

				// 使用 jQuery 更新 DOM 元素
				$(".middleBox").append(
					'<img class="middleImage" src="' + goods.img_big_logo + '" />'
				);
				$(".title").html(goods.title);
				$(".old").html(goods.price);
				$(".discount").html(goods.sale_type);
				$(".curprice").html(goods.current_price);
				$(".desc").html(goods.goods_introduce);
			} else {
				alert(res.data.message); // 如果需要，可以显示错误消息
			}
		})
		.catch(function (error) {
			console.error("Error", error);
			alert("请求商品详情失败，请稍后再试。");
		});
});
