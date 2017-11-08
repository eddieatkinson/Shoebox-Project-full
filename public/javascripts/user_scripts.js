$(document).ready(()=>{

	// store input data from user signup screen
	
		var userObj = {
			userType :  [],
			fullName : [],
			userPhone : [],
			userEmail : [],
			passwd : [],
			signupDate : []
		}
		userObj.signupDate = new Date();

		$('.user-sign-up-form').submit((event)=>{
			event.preventDefault();

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
					console.log("numUsers is null",numUsers)
				}else{
					numUsers++;
				}
				console.log("numUsers ",numUsers)
				localStorage.setItem('users-signedup',numUsers)

				userObj.userType= 'Family';
				userObj.fullName = $('.full-name').val();
				userObj.userPhone = $('.phone').val();
				userObj.userEmail = $('.email').val();
				userObj.passwd = $('.password').val();

				localStorage.setItem("userType"+numUsers, userObj.userType);
				localStorage.setItem("password"+numUsers, userObj.passwd);
				localStorage.setItem("fullName"+numUsers, userObj.fullName);
				localStorage.setItem("userEmail"+numUsers, userObj.userEmail);
				localStorage.setItem("userPhone"+numUsers, userObj.userPhone);
				localStorage.setItem("signupDate"+numUsers, userObj.signupDate);

				window.location.href = "user_home.html"
				
			}
		});
		
	});
