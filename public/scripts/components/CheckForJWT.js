if (typeof(Storage) !== 'undefined') {
	// TODO read about HttpOnly Cookie
	if (!localStorage.getItem('jwt')) window.location.replace('/login');
} else {
	// TODO document.write isn't good
	document.write('<p style="font-size: 30px; color: #000;">No local storage detected 😬, use a different browser</p>');
}