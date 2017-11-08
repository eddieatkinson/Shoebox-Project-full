$(document).ready(()=>{
	localStorage.setItem('user-password', 'myPassword');
	console.log(typeof(localStorage.getItem('user-password')));
	localStorage.setItem('vol-password', 'myPassword');

	$('#myModal').on('shown.bs.modal', function () {
		$('#myInput').focus()
	});
	console.log("Connected!");
	$('.family-login').click(()=>{
		window.location.href='youth-login-form.html';
	});
	$('.volunteer-login').click(()=>{
		window.location.href='volunteer-login-form.html';
	});
	$('.link-to-map').click(()=>{
		event.preventDefault();
		window.open("/map", "_blank", "toolbar=yes,scrollbar=yes,resizeable=yes,top=55,left=75,width=700,height=700");
	});
	$(function() {
		$('#ChangeToggle').click(function() {
			$('#navbar-hamburger').toggleClass('hidden');
			$('#navbar-close').toggleClass('hidden');  
		});
	});

	// Scrollspy attempt
	// $('body').scrollspy({target: ".navbar", offset: 50});

	// $('#bs-example-navbar-collapse-1 a').on('click', function(event) {
	// 	console.log("Didoen!")
	// 	if(this.hash !== ""){
	// 		event.preventDefault();

	// 		var hash = this.hash;

	// 		$('html, body').animate({
	// 			scrollTop: $(hash).offset().top
	// 		}, 800, function(){
	// 			window.location.hash = hash;
	// 		});
	// 	}
	// });
	
});