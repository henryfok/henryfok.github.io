var allowSubmit = false;

function capchaFilled() {
	allowSubmit = true;
}

function checkCaptcha() {
	console.log('check!');
	console.log(allowSubmit);
	if (allowSubmit) {
		return true;
	} else {
		alert("Fill in capcha!");
		return false;
	}
}