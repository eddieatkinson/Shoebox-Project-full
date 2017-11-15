$(document).ready(()=>{
	$('#myModal').on('shown.bs.modal', function () {
		$('#myInput').focus()
	});
	// console.log("Connected!");
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
	var count = 0;
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

	// ------------------------------------
	// ------------Login forms-------------
	// ------------------------------------
	var userCount = 0;
	var volCount = 0;
	// change color of button when the password input box is focused in
	$('.youth-sign-up-form').focusin(()=>{
		userCount++;
		if(userCount >= 2){
			$('.submit').removeClass('btn-warning');
			$('.submit').addClass('btn-success');
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
		window.location.href = "/#contact"
	});
	$(".vol-btn").click(function(){
		window.location.href = "/volunteers";
	});

	// ------------------------------------
	// ------------User home-------------
	// ------------------------------------

	/* activate the carousel */
	$("#modal-carousel").carousel({interval:false});

	/* change modal title when slide changes */
	$("#modal-carousel").on("slid.bs.carousel",       function () {
		$(".modal-title")
		.html($(this)
		.find(".active img")
		.attr("title"));
	});

	/* when clicking a thumbnail */
	$(".row .thumbnail").click(function(){
		var content = $(".carousel-inner");
		var title = $(".modal-title");
	  
		content.empty();  
		title.empty();
	  
		var id = this.id;  
		var repo = $("#img-repo .item");
		var repoCopy = repo.filter("#" + id).clone();
		var active = repoCopy.first();
	  
		active.addClass("active");
		title.html(active.find("img").attr("title"));
		content.append(repoCopy);

		// show the modal
		$("#modal-gallery").modal("show");
	});

	// ------------------------------------
	// ------------User home-------------
	// ------------------------------------
	// $('#uploadVolPic').click(()=>{
	// 	event.preventDefault();
	// 	window.open("/volunteers/uploadPic", "_blank", "toolbar=yes,scrollbar=yes,resizeable=yes,top=55,left=75,width=700,height=700");
	// });
});


var signedIn = ""; 
function checkSigned(){
var signed = signedIn;
const mq = window.matchMedia( "(max-width: 1100px)" );
if (signed !== 'yes'){
	$(".calen").html('<h3>Please Sign in to Google to View the Calender<h3>');
		}else if (mq.matches){
		$(".calen").html('<iframe src="https://calendar.google.com/calendar/embed?src=khio5gi4mdbvipjohb8mb3hc60%40group.calendar.google.com&ctz=America/New_York" style="border: 0" width="800" height="1200" frameborder="0" scrolling="no"></iframe>');
		}else{
			$(".calen").html('<iframe src="https://calendar.google.com/calendar/embed?src=khio5gi4mdbvipjohb8mb3hc60%40group.calendar.google.com&ctz=America/New_York" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');

		}
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#your-pic')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

