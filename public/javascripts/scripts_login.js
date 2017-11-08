$(document).ready(()=>{

	var password = $('.password').val();
	var passwordConfirm = $('.password-confirm').val();
	var userCount = 0;
	var volCount = 0;
	var timesSubmitIsRun = 0;

	// change color of button when the password input box is focused in

	$('.youth-sign-up-form').focusin(()=>{
		userCount++;
		console.log("Change", userCount);
		if(userCount >= 2){
			$('.submit').removeClass('btn-warning');
			$('.submit').addClass('btn-success');
			console.log("It happened!");
		}
	});

	$('.sign-up-form').focusin(()=>{
		volCount++;
		console.log("Change");
		if(volCount >= 2){
			$('.submit').removeClass('btn-warning');
			$('.submit').addClass('btn-success');
			console.log("It happened!");
		}
	});
	


	// Check input email/password against stored email/password

	$('.sign-up-form').submit((event)=>{
		// event.preventDefault();
		// console.log("volunteer form submitted")
		// var password = $('.password').val();
		// var passwordConfirm = localStorage.getItem('vol-password');
		// if(password != passwordConfirm){
		// 	$('.password-error').html("Incorrect password.");
		// }else{
		// 	window.location.href = "user_home.html"
		// }
		event.preventDefault();
		console.log("volunteer form submitted")
		timesSubmitIsRun++;

		var userObj = {
			userType :  [],
			fullName : [],
			userPhone : [],
			userEmail : [],
			passwd : [],
			signupDate : []
		}

		var numUsers = localStorage.getItem('users-signedup')
		console.log("numUsers", numUsers)
		var enteredEmail = $('.email').val();
		console.log("enteredEmail", enteredEmail)
		var enteredPassword = $('.password').val();
		console.log("enteredPassword", enteredPassword)

		for (i=1; i <= numUsers; i++){

			// userObj.userType = localStorage.getItem('type'+i)
			userObj.passwd = localStorage.getItem('password'+i)
			userObj.userEmail = localStorage.getItem('userEmail'+i)
			// userObj.fullName = localStorage.getItem('fullName'+i)
			// userObj.userPhone = localStorage.getItem('userPhone'+i)
			// userObj.signupDate = localStorage.getItem('signupDate'+i)

			console.log("userObj.userEmail", userObj.userEmail)

			if (enteredEmail == userObj.userEmail){
				if (enteredPassword != userObj.passwd){
					console.log(" != timesSubmitIsRun", timesSubmitIsRun)
					$('.password-error').html("Incorrect password.");
				}else{
					console.log(" == timesSubmitIsRun", timesSubmitIsRun)
					$('.password-error').html("You just logged in to the volunteer page!");
					break;
				}
			}else{

				$('.password-error').html("Unknown or incorrect email address");
			}
		}
	});

	// Check input email/password against stored email/password

	$('.youth-sign-up-form').submit((event)=>{
		event.preventDefault();
		console.log("user form submitted")
		timesSubmitIsRun++;

		var userObj = {
			userType :  [],
			fullName : [],
			userPhone : [],
			userEmail : [],
			passwd : [],
			signupDate : []
		}

		var numUsers = localStorage.getItem('users-signedup')
		var enteredEmail = $('.email').val();
		var enteredPassword = $('.password').val();

		for (i=1; i <= numUsers; i++){

			userObj.passwd = localStorage.getItem('password'+i)
			userObj.userEmail = localStorage.getItem('userEmail'+i)

			if (enteredEmail == userObj.userEmail){

				if (enteredPassword != userObj.passwd){
					$('.password-error').html("Incorrect password.");
				}else{
					window.location.href = "user_home.html"
					break;
				}

			}else{
				$('.password-error').html("Unknown or incorrect email address");
			}
		}
	});
	console.log("timesSubmitIsRun", timesSubmitIsRun)
	

	// if not a current user, button redirects to the signup page

	$(".youth-btn").click(function(){
		window.location.href = "user-signup-page.html"
	});
	$(".vol-btn").click(function(){
		window.location.href = "volunteer_form.html"
	});
});