
document.addEventListener('DOMContentLoaded', function() {
	const btnUser = document.querySelector('#user');
	const profileMenu = document.querySelector('.profile-settings-container');
    const btnCancel = document.querySelector('.prof-toggle-cancel');
	if (btnUser && profileMenu) {
		btnUser.addEventListener('click', function(e) {
			profileMenu.classList.toggle('active');
		});
		// Cierra el menú si se hace click fuera
		document.addEventListener('click', function(e) {
			if (!profileMenu.contains(e.target) && !btnUser.contains(e.target) 
                || btnCancel.contains(e.target)) {
				profileMenu.classList.remove('active');
			}
		});
	}
});