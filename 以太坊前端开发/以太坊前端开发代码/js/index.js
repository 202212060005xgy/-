$(function () {
	function getUserInfoFromStorage() {
		const { nickname, id } = JSON.parse(sessionStorage.getItem("user"));
		const token = sessionStorage.getItem("token");
		return {
			id,
			nickname,
			token,
		};
	}
	var userInfo = getUserInfoFromStorage();

	var activeClass = userInfo.nickname ? ".on" : ".off";
	$(activeClass).addClass("active").siblings().removeClass("active");
	if (userInfo.nickname) {
		$(".nickname").text(userInfo.nickname);
	}

	// 获取轮播图数据
	axios
		.get("http://localhost:9000/carousel/list")
		.then(function (res) {
			if (res.data.code === 1) {
				const imagesHtml = res.data.list.reduce((acc, item) => {
					return (
						acc + `<div><img src="http://localhost:9000/${item.name}" /></div>`
					);
				}, "");

				const html = `<div carousel-item>${imagesHtml}</div>`;

				// 将拼接好的HTML设置到id为carousel的元素中
				document.getElementById("carousel").innerHTML = html;

				layui.carousel.render({
					elem: "#carousel", // 选择器
					width: "1200px", //设置容器宽度
					height: "600px",
					arrow: "hover",
					anim: "fade", //切换动画方式
				});
			}
		})
		.catch(function (error) {
			console.error("Error fetching carousel data:", error);
		});

	// 个人中心点击事件
	$(".self").on("click", function () {
		window.location.href = "./self.html";
	});

	// 注销点击事件
	$(".logout").on("click", function () {
		var id = userInfo.id; // 假设用户信息中包含id
		axios
			.get(`http://localhost:9000/users/logout?id=${id}`, {
				headers: {
					Authorization: userInfo.token, // 假设用户信息中包含token
				},
			})
			.then(function (res) {
				if (res.data.code === 1) {
					sessionStorage.clear();
					window.location.href = "./index.html";
				}
			})
			.catch(function (error) {
				console.error("Error during logout:", error);
			});
	});
});
