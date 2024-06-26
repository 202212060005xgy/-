$(function () {
	var userInfo = {
		id: JSON.parse(sessionStorage.getItem("user")).id,
		token: sessionStorage.getItem("token"),
	};

	// 检查用户信息是否存在
	if (!userInfo.id || !userInfo.token) {
		console.error("用户不存在");
		return;
	}
	// 构建带有用户ID的请求URL
	var url = `http://localhost:9000/users/info?id=${userInfo.id}`;

	// 发送GET请求获取用户详情
	// 获取用户原本的信息
	axios
		.get(url, {
			headers: {
				Authorization: userInfo.token,
			},
		})
		.then(function (res) {
			if (res.data.code === 1) {
				// 使用原生JS设置表单输入值，放在表单里
				document.querySelector(".username").value = res.data.user.username;
				document.querySelector(".age").value = res.data.user.age || '';
				document.querySelector(".gender").value = res.data.user.gender;
				document.querySelector(".nickname").value = res.data.user.nickname;
			}
		});
	document.querySelector("form").addEventListener("submit", function (event) {
		event.preventDefault(); // 阻止表单默认提交行为

		// 使用原生JS把从get请求获取在表单的值拿出来
		var age = document.querySelector(".age").value;
		var gender = document.querySelector(".gender").value;
		var nickname = document.querySelector(".nickname").value;

		axios
			.post(
				"http://localhost:9000/users/update",
				{
					//将获取的表单值发送给服务器
					id: userInfo.id,
					age: age,
					gender: gender,
					nickname: nickname,
				},
				{
					headers: {
						Authorization: userInfo.token,
					},
				}
			)
			.then(function (response) {
				if (response.data.code === 1) {
					alert(response.data.message);
					// 获取成功，在服务器填入更新的用户信息
					sessionStorage.setItem(
						"user",
						JSON.stringify({ id: userInfo.id, nickname: nickname })
					);
				}
			})
			.catch(function (error) {
				alert("Error updating user info: " + error.message);
			});
	});
});
