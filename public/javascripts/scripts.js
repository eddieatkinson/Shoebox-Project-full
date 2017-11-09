$(document).ready(()=>{
	$('#myModal').on('shown.bs.modal', function () {
		$('#myInput').focus()
	});
	console.log("Connected!");
	$('.family-login').click(()=>{
		window.location.href='/users/login';
	});
	$('.volunteer-login').click(()=>{
		window.location.href='/volunteers/login';
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
	
	// ------------------------------------
	// -------Volunteer sign-up form-------
	// ------------------------------------
	$('.vol-sign-up-form').change(()=>{
		count++;
		var password = $('.password').val();
		var passwordConfirm = $('.password-confirm').val();

		$('.agree').change(()=>{
			if(count >= 5){
				$('.submit').removeClass('btn-warning');
				$('.submit').addClass('btn-success');
				$('.submit').attr('value', "I'm ready!")
			}	
		});
	});

	$('.vol-sign-up-form').submit((event)=>{
		var password = $('.password').val();
		var passwordConfirm = $('.password-confirm').val();

		if(password != passwordConfirm){
			event.preventDefault();
			$('.password-error').html("Your passwords do not match.");
		}
	});
});