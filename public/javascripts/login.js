(function() {

	function runScript(){
		$(document).ready(function() {
			$("body")
				.on('click', '#loginButton', onLoginButtonClick)
				.on('click', '#logoutButton', onLogoutButtonClick);
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
		};

		function onLoginButtonClick(event) {
			$(c.sel.passwordHash).val(md5($(c.sel.email).val() + c.solt + $(c.sel.password).val()));
			var m = $(c.sel.loginForm).serialize();
			$.ajax({
		        'type': 'POST',
		        'url': c.url.login,
		        'contentType': 'application/json',
		        'data': JSON.stringify(m),
		        'dataType': 'json',
		        'success': function(data) {
		        	window.location.reload();
		        }
	    	});
		}

		function onLogoutButtonClick(event) {
			$.ajax({
		        'type': 'POST',
		        'url': c.url.logout,
		        'contentType': 'application/json',
		        'data': JSON.stringify({}),
		        'dataType': 'json',
		        'success': function(data) {
		        	window.location.href = c.sel.root;
		        }
	    	});
		}
	}

	runScript();
})();