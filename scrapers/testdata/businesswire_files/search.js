// Add search and search options toggles

if (document.getElementById('bw-search') != null) {

	// ** CHANGE BW-SEARCH FOR JS
	var searchMain = document.getElementById('bw-search');
	var searchMainContent = document.getElementById('bw-search-container');
	var searchMainForm = document.getElementById('bw-search-form');
	var searchMainInput = document.getElementById('bw-search-input');
	var searchToggleUsed = false;
	var searchToggleShown = false;
	// Change id of search section
	searchMain.id = 'bw-search-js';

	/* ***** SEARCH (for small viewports) ***** */
	var searchMainToggle = jQuery('#bw-search-js h2');
	function toggleSearch(checkNav) {
		if (checkNav == undefined) checkNav = true;
		jQuery(searchMainContent).slideToggle('fast', function() {
			// flip toggleShown marker
			searchToggleShown = !searchToggleShown;
			// Hide toggled nav if it's open and we're opening search
			if (checkNav && document.getElementById('bw-nav') != null && navToggleUsed && navToggleShown && typeof toggleNav == 'function' && searchToggleShown) {
				toggleNav(false);
			};
		});
	}
	function setSearchToggle() {
		if (searchMainToggle.css('display') != 'none') {
			searchToggleUsed = true;
			// Add toggle icon
			searchMainToggle.addClass('bw-is-toggled');
			// Hide search initially 
			jQuery(searchMainContent).css('display', 'none');
			if ("ontouchstart" in window) {
				// Add link to search page
				searchMainToggle.click(function() {
					window.location.href = '/portal/site/home/search/';
				});
			} else {
				// Set search icon "head" to toggle
				searchMainToggle.click(function() {
					toggleSearch();
				});
			};
		} else {
			jQuery(searchMainContent).css('display', 'block');
		};
	};
	function resetSearchToggle() {
		searchToggleUsed = false;
		searchToggleShown = false;
		searchMainToggle.removeClass('bw-is-toggled');
		searchMainToggle.unbind('click'); //applies to touch and click
	};
	// Initial test for search toggle
	setSearchToggle();
	// Test again if window is resized
	jQuery(window).resize(function() {
		resetSearchToggle();
		setSearchToggle();
	});
	
	/* ***** SEARCH OPTIONS ***** */

	// **set search filter types, in the order we want them listed
	var filters = new Array(
		{value: 'all', href: '#?type=all', text: strAll},
		{value: 'news', href: '#?type=news', text: strNews},
		{value: 'site', href: '#?type=site', text: strSite},
		{value: 'adv', href: strAdvLocation, text: strAdv}
	);
	// ** Mark default filter
	var initialFilter = "all";

	// Create search filters link menu
	function createSearchFilter(objFilter) { // Function to create filter links
		var optionLi = document.createElement('li');
		var optionA = document.createElement('a');
		optionA.href = objFilter['href'];
		optionA.id = 'bw-search-filter-' + objFilter['value'];
		optionA.title = objFilter['text'];
		// Check to see if this is highlighted/default search filter
		if (objFilter['value'] == initialFilter) {
			optionA.className = "is-selected";
		}
		var optionText = document.createTextNode(objFilter['text']);
		optionA.appendChild(optionText);
		// Add onclicks to the type selectors to set the form search query, based on href
		if (objFilter['href'].indexOf('?type=') > -1) {
			jQuery(optionA).click(function() {
				jQuery('#bw-search-type').val(objFilter['value']);
				// Change the input placeholder and title
				var newPlaceholder = this.title;
				jQuery(searchMainInput).prop('placeholder', newPlaceholder);
				jQuery(searchMainInput).prop('title', newPlaceholder);
				// Remove highlight from previous selection and highlight this selection
				jQuery('#bw-search-filter-links a').each(function() {
					jQuery(this).removeClass('is-selected');
				});
				jQuery(this).addClass('is-selected');
				// Close the toggle after a delay
				window.setTimeout(function() {
				jQuery('#bw-search-options-head').click();}, 500);
				return false;
			});
		};
		optionLi.appendChild(optionA);
		return optionLi;
	}
	var searchMainOptions = document.createElement('div');
	searchMainOptions.id = 'bw-search-filter-links';
	var searchMainOptionsList = document.createElement('ul');
	for (var i=0; i<filters.length; i++) {
		jQuery(searchMainOptionsList).append(createSearchFilter(filters[i]));
	}
	// Add filter list to container div
	jQuery(searchMainOptions).append(searchMainOptionsList);
	jQuery('#bw-search-options').append(searchMainOptions);
	// Change the non-JS advanced search link to the list heading
	var searchToggler = jQuery('#bw-search-alt');
	searchToggler.wrap('<h3 id="bw-search-options-head"></h3>');
	searchToggler.replaceWith('<span>' + strOptions + '</span>');

	// Set up options toggle
	var searchOptionToggle = new BWToggle("#bw-search-options", "#bw-search-options-head", "#bw-search-filter-links", false);
	searchOptionToggle.set();

};