(function() {

	function runScript(){
		$(document).ready(function() {
			$("body")
				.on('click', '#loginButton', onLoginButtonClick)
				.on('click', '#logoutButton', onLogoutButtonClick)

		});

		var c = {
			sel: {
				email: '#email',
				password: '#password',
				passwordHash: '#passwordHash',
				loginForm: '#loginForm'
			},
			url: {
				login: '/login',
				logout: '/logout',
				root: '/'
			},
			solt: '0a0f6f99-c94c-46d4-aa32-a0de2341ee53'
		}

		function onLoginButtonClick(event) {
			$(c.sel.passwordHash).val(md5($(c.sel.email).val() + c.solt + $(c.sel.password).val()));
			var data = $(c.sel.loginForm).serialize();
				$.post(
					c.url.login,
					data,
					function(data) {
						window.location.reload();
					}
				);
		}

		function onLogoutButtonClick(event) {
			$.post(
				c.url.logout,
				null,
				function(data) {
					window.location.href = c.sel.root;
				}
			);
		}
	}

	runScript();
})();