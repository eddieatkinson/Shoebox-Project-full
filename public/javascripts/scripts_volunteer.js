$(document).ready(()=>{
	var fieldsFull = false;
	var count = 0;
	$('.vol-sign-up-form').change(()=>{
		count++;
		// console.log("Count!!!")
		// $('form-wrapper input').each(function(){
		// 	var userInput = $(this).val();

		// 	if(userInput == 'j'){
		// 		fieldsFull = true;
		// 		console.log("True!")
		// 	}
		// });

		// if(fieldsFull){
		// 	$('.submit').removeClass('btn-warning');
		// }else{
		// 	$('.submit').addClass('btn-success');
		// }
		// $('.agree').change(()=>{
		// 	console.log("Ready!")
			var password = $('.password').val();
			var passwordConfirm = $('.password-confirm').val();

			$('.agree').change(()=>{
				if(count >= 5){
					$('.submit').removeClass('btn-warning');
					$('.submit').addClass('btn-success');
					$('.submit').attr('value', "I'm ready!")
				}	
			});
			
			// $('.password-confirm').change(()=>{
			// 	if(password != passwordConfirm){
			// 		console.log(password);
			// 		console.log(passwordConfirm);
			// 		$('.password-error').html("Your passwords do not match.");
			// 	}


			// });

			// $('.vol-sign-up-form').submit((event)=>{
			// 	event.preventDefault();
			// 	var password = $('.password').val();
			// 	var passwordConfirm = $('.password-confirm').val();
			// 	if(password != passwordConfirm){
			// 		// console.log(password);
			// 		// console.log($('.password-confirm').val());
			// 		$('.password-error').html("Your passwords do not match.");
			// 	}else{
			// 		localStorage.setItem('vol-password', password);
			// 	}
			// 	// console.log(passwordConfirm);
			// });
			// store input data from user signup screen

	});
	
	var userObj = {
		userType :  [],
		fullName : [],
		userPhone : [],
		userEmail : [],
		passwd : [],
		signupDate : []
	}
	userObj.signupDate = new Date();

	$('.vol-sign-up-form').submit((event)=>{
		// event.preventDefault();

		var password = $('.password').val();
		var passwordConfirm = $('.password-confirm').val();

		var numUsers = localStorage.getItem('users-signedup')
		
		if(password != passwordConfirm){
			console.log(password);
			console.log($('.password-confirm').val());
			$('.password-error').html("Your passwords do not match.");
		}else{
			console.log("passwords match")
			
			if(numUsers == null){
				numUsers = 1;
				console.log("numUsers is zero",numUsers)
			}else{
				numUsers++;
			}
			console.log("numUsers ",numUsers)
			localStorage.setItem('users-signedup',numUsers)


			userObj.userType= 'Volunteer';
			userObj.fullName = $('.full-name').val();
			userObj.userPhone = $('.phone').val();
			userObj.userEmail = $('.email').val();
			userObj.passwd = $('.password').val();
			

			console.log("fullName ", userObj.fullName)
			console.log("userPhone ", userObj.userPhone);
			console.log("userEmail ", userObj.userEmail);
			console.log("password ", userObj.passwd);


			localStorage.setItem("userType"+numUsers, userObj.userType);
			localStorage.setItem("password"+numUsers, userObj.passwd);
			localStorage.setItem("fullName"+numUsers, userObj.fullName);
			localStorage.setItem("userEmail"+numUsers, userObj.userEmail);
			localStorage.setItem("userPhone"+numUsers, userObj.userPhone);
			localStorage.setItem("signupDate"+numUsers, userObj.signupDate);

			// window.location.href = "user_home.html"
			$('.password-error').html("You just logged in to the volunteer page!");

			
		}

	});
	

});