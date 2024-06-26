$(function () {
	// 获取分类信息
	axios
		.get("http://localhost:9000/goods/category")
		.then(function (res) {
			if (res.data.code === 1) {
				// 获取服务器分类信息
				res.data.list.forEach(function (item) {
					$(".category").append(`<li data-type="${item}">${item}</li>`);
				});
				console.log(res.data.list);
				console.log("===========");
				console.log(res.data.message);
			} else {
				alert(res.data.message);
			}
		})
		.catch(function (error) {
			console.error("Error fetching category data:", error);
		});

	// 初始化请求参数
	const params = {
		current: 1,
		pagesize: 12,
		category: "",
		filter: "",
		saleType: 10,
		sortType: "id",
		sortMethod: "ASC",
		search: "",
	};

	// 分类点击事件
	$(".category").on("click", "li", function () {
		$(this).addClass("active").siblings().removeClass("active");
		params.category = $(this).data("type");
		params.current = 1;
		getList();
	});

	// 获取所有销售类型筛选的li元素并绑定点击事件
	var saleBoxItems = document.querySelectorAll(".saleBox li");
	saleBoxItems.forEach(function (item) {
		item.addEventListener("click", function () {
			Array.from(saleBoxItems).forEach(function (li) {
				li.classList.remove("active");
			});
			this.classList.add("active");
			params.saleType = this.dataset.type || this.dataset.method;
			params.current = 1;
			getList();
		});
	});

	// 获取所有热门筛选的li元素并绑定点击事件
	var hotBoxItems = document.querySelectorAll(".hotBox li");
	hotBoxItems.forEach(function (item) {
		item.addEventListener("click", function () {
			Array.from(hotBoxItems).forEach(function (li) {
				li.classList.remove("active");
			});
			this.classList.add("active");
			params.filter = this.dataset.type || this.dataset.method;
			params.current = 1;
			getList();
		});
	});

	// 获取所有排序方式筛选的li元素并绑定点击事件
	var sortBoxItems = document.querySelectorAll(".sortBox li");
	sortBoxItems.forEach(function (item) {
		item.addEventListener("click", function () {
			Array.from(sortBoxItems).forEach(function (li) {
				li.classList.remove("active");
			});
			this.classList.add("active");
			params.sortType = this.dataset.type || this.dataset.method;
			params.current = 1;
			getList();
		});
	});

	// 搜索功能
	$(".search").on("blur", function () {
		params.search = $(this).val();
		params.current = 1;
		getList();
	});

	// 跳转按钮点击事件
	$(".go").on("click", function () {
		const pageNum = parseInt($(".jump").val(), 10);
		if (!isNaN(pageNum)) {
			params.current = pageNum;
			getList();
		} else {
			alert("请输入有效的页码");
		}
	});

	// 每页显示数量变更事件
	$(".pagesize").on("change", function () {
		params.pagesize = parseInt($(this).val(), 10);
		params.current = 1;
		getList();
	});

	// 下一页和上一页事件
	$(".next").on("click", function () {
		if (params.current < parseInt($(".total").text().split("/")[1], 10)) {
			params.current++;
			$(".prev").removeClass("disable");
			getList();
		}
	});
	$(".prev").on("click", function () {
		if (params.current > 1) {
			params.current--;
			if (params.current === 1) {
				$(".prev").addClass("disable");
			}
			getList();
		}
	});

	$(".first").click(function(){
	    params.current=1;
	    getList();
	})

	$(".last").click(function(){
		params.current=totalNum;
		getList();
	})

	function getList() {
		// 构建查询参数
		var queryParams = {
			current: params.current,
			pagesize: params.pagesize,
			...params,
		};
		// 发送GET请求获取商品列表
		axios
			.get("http://localhost:9000/goods/list", { params: queryParams })
			.then(function (res) {
				if (res.data.code === 1) {
					const productsDom = res.data.list
						.map(
							product => `
            <li data-id="${product.goods_id}">
              <div class="show">
                <img src="${product.img_big_logo}">
                ${product.is_hot ? '<span class="hot">热销</span>' : ""}
                ${product.is_sale ? "<span>折扣</span>" : ""}
              </div>
              <div class="info">
                <p class="title">${product.title}</p>
                <p class="price">
                  <span class="curr">¥ ${product.current_price}</span>
                  <span class="old">¥ ${product.price}</span>
                </p>
              </div>
            </li>
          `
						)
						.join("");
					$(".list.container").html(productsDom);
					$(".total").text(`${params.current}/${res.data.total}`);
					totalNum = res.data.total

					if(params.current === 1){
						$(".prev").addClass("disable");
						$(".first").addClass("disable");
						$(".next").removeClass("disable");
						$(".last").removeClass("disable");
					}else if(params.current === totalNum){
					    $(".next").addClass("disable");
						$(".last").addClass("disable");
						$(".first").removeClass("disable");
						$(".prev").removeClass("disable");
					}else{
					    $(".prev").removeClass("disable");
						$(".next").removeClass("disable");
						$(".first").removeClass("disable");
						$(".last").removeClass("disable");
					}
				} else {
					alert(res.data.message);
				}
			})
			.catch(function (error) {
				console.error("Error fetching goods list:", error);
			});
	}

	getList(); // 初始加载商品列表

	// 商品详情点击事件
	$(".list.container").on("click", "li", function () {
		var id = $(this).data("id");
		sessionStorage.setItem("goodsId", id);
		location.href = "./detail.html";
	});
});
