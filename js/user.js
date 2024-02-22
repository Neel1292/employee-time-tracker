const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

const navLinks = document.querySelectorAll('nav a');
const contentDivs = document.querySelectorAll('.content div');

var logout = document.querySelector('.logout-btn');

logout.addEventListener('click', () => {
    sessionStorage.clear();
})

navLinks.forEach(link => {
	link.addEventListener('click', () => {
		// Remove active class from all nav links
		navLinks.forEach(link => link.classList.remove('active'));

		// Add active class to clicked nav link
		link.classList.add('active');

		// Hide all content divs
		contentDivs.forEach(div => div.classList.remove('active'));

		// Show content div with matching ID
		const target = link.dataset.target;
		document.getElementById(target).classList.add('active');
	});
});

$(document).ready(function(){
	$('.anim').show(1000)
})