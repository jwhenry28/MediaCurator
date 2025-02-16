// Add toggle to user controls on small screens;
// For larger screens, it's a hover;
// For no-JS devices, it's always displayed

var controls = jQuery('#bw-controls.bw-user');
if (controls.length  == 1) {
	// Change the container ID to create toggle/hover display
	controls.attr('id', 'bw-controls-js');
	var controlsContainer = jQuery('#bw-controls-js #bw-controls-container > div');
	var controlsHead = jQuery('#bw-controls-js h2');
	var controlsLink = jQuery('#bw-controls-js h2 a'); 
	var controlsBody = jQuery('#bw-controls-js ul');
	var controlsToggleShown = false;
	var narrowWidthCue = jQuery('#bw-nav h2'); //Signals whether window is narrow width
	
	/* ***** TOGGLE controls for small viewports ***** */
	function toggleControls() {
		jQuery(controlsBody).toggle('blind', 'fast', function() {
			// flip toggleShown marker
			controlsToggleShown = !controlsToggleShown;
			// highlight toggle link
			if (controlsToggleShown) {
				controlsLink.addClass('bw-is-open');
			} else {
				controlsLink.removeClass('bw-is-open');
			};
		});
	};
	function setControlsToggle() {
		// Use of toggle based on screen width,
		//     which is based on display of nav toggle
		// 		and whether it's a touch screen
		var thisHasTouch = ("ontouchstart" in window);
		if (narrowWidthCue.css('display') != 'none' || thisHasTouch) {
			// Add toggle marker to container
			controlsContainer.addClass('bw-is-toggled');
			// Hide controls initially 
			//jQuery(controlsBody).css('display', 'none');
			// Set controls "head" to toggle
			controlsLink.click(function() {
				toggleControls();
				return false;
			});
		};
	};
	function resetControlsToggle() {
		controlsContainer.removeClass('bw-is-toggled');
		controlsBody.css('display', '');
		controlsLink.unbind('click');
	};
	// Initial test for nav toggle
	setControlsToggle();
	// Test again if window is resized
	jQuery(window).resize(function() {
		resetControlsToggle();
		setControlsToggle();
	});
};


