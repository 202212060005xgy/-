$(function () {
	var form = $("form");
	var username = $('input[name="username"]');
	var password = $('input[name="password"]');
	var errorDisplay = $(".error");

	form.on("submit", function (e) {
		e.preventDefault();
		var usernameValue = username.val();
		var passwordValue = password.val();

		// 清空先前的错误信息
		errorDisplay.text("");

		// 验证用户名和密码是否为空
		if (!usernameValue) {
			errorDisplay.html("用户名不能为空。").show();
			return;
		}
		if (!passwordValue) {
			errorDisplay.html("密码不能为空。").show();
			return;
		}

		// 如果表单验证通过，则发送登录请求
		axios
			.post(
				"http://localhost:9000/users/login",
				{
					username: usernameValue,
					password: passwordValue,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then(function (response) {
				// 处理响应数据
				if (response.data.code === 1) {
          sessionStorage.setItem('user',JSON.stringify(response.data.user))
		  // 保存用户信息到本地存储,请求需要携带token，否则没有权限
					sessionStorage.setItem("token", response.data.token);
					window.location.href = "index.html";
				} else {
					errorDisplay.html(response.data.message).show();
				}
			})
			.catch(function (error) {
				alert("请求出错，请稍后重试。");
			});
	});
});
