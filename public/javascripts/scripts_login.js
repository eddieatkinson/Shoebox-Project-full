$(document).ready(()=>{

	var password = $('.password').val();
	var passwordConfirm = $('.password-confirm').val();
	var userCount = 0;
	var volCount = 0;

	// change color of button when the password input box is focused in
	$('.youth-sign-up-form').focusin(()=>{
		userCount++;
		if(userCount >= 2){
			$('.submit').removeClass('btn-warning');
			$('.submit').addClass('btn-success');
			console.log("It happened!");
		}
	});
	$('.sign-up-form').focusin(()=>{
		volCount++;
		if(volCount >= 2){
			$('.submit').removeClass('btn-warning');
			$('.submit').addClass('btn-success');
		}
	});
	$(".youth-btn").click(function(){
		window.location.href = "user-signup-page.html"
	});
	$(".vol-btn").click(function(){
		window.location.href = "/volunteers";
	});
});