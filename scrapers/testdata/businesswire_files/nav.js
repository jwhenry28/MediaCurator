/*
jQuery(document).ready(function(){
	var selectedMenu = jQuery('#bw-nav > ul > li.bw-has-submenu');
        selectedMenu.hover(function(){
	    	jQuery(this).children('ul').slideToggle(200);
        })
});
*/

if (document.getElementById('bw-nav') != null) {
	var navMainContent = jQuery('#bw-nav > ul');
	var navMainToggle = jQuery('#bw-nav h2');
	var navToggleUsed = false;
	var navToggleShown = false;
	
	/* ***** TOGGLE nav for small viewports ***** */
	function toggleNav(checkSearch) {
		if (checkSearch == undefined) checkSearch = true;
		jQuery(navMainContent).slideToggle('fast', function() {
			// flip toggleShown marker
			navToggleShown = !navToggleShown;
			// Hide toggled search if it's open and we're opening nav
			if (checkSearch && document.getElementById('bw-search-js') != null && searchToggleUsed && searchToggleShown && typeof toggleSearch == 'function' && navToggleShown) {
				toggleSearch(false);
			};
		});
	};
	function setNavToggle() {
		if (navMainToggle.css('display') != 'none') {
			navToggleUsed = true;
			// Add toggle icon and move main nav
			navMainToggle.addClass('bw-is-toggled');
			navMainContent.addClass('bw-is-toggled');
			// Hide nav initially 
			navMainContent.css('display', 'none');
			// Set nav icon "head" to toggle
			navMainToggle.click(function() {
				toggleNav();
			})
		} else {
			jQuery(navMainContent).css('display', 'block');
		}
	};
	function resetNavToggle() {
		navToggleUsed = false;
		navToggleShown = false;
		navMainToggle.removeClass('bw-is-toggled');
		navMainContent.removeClass('bw-is-toggled');
		navMainToggle.unbind('click');
	}
	// Initial test for nav toggle
	setNavToggle();
	// Test again if window is resized
	jQuery(window).resize(function() {
		resetNavToggle();
		setNavToggle();
	});
}