// *************** Base BWJSAPI classes likely to be called by any page ***************
//prevent iframes from embedding our pages
//if (top != self) top.location.href = location.href;

// *****OBJECT: BWParam*****
// 	For testing for the existence and type of an argument or parameter
function BWParam(param) {
	this.param = param;
}
// Instance methods
BWParam.prototype.exists = function() {
	return (this.param != null && this.param != undefined);
}
BWParam.prototype.isBoolean = function() {
	return (this.exists() && typeof this.param == "boolean")
}
BWParam.prototype.isFunction = function() {
	return (this.exists() && typeof this.param == "function")
}
BWParam.prototype.isNumber = function() {
	return (this.exists() && typeof this.param == "number")
}
BWParam.prototype.isObject = function() {
	return (this.exists() && typeof this.param == "object")
}
BWParam.prototype.isString = function(cannotBeEmpty) {
/* Argument:
	cannotBeEmpty = Boolean: string cannot be empty
*/
	// Set default of true for cannotBeEmpty
	if (cannotBeEmpty == undefined) cannotBeEmpty = true;
	// Test for existence and string
	if (this.exists() && typeof this.param == "string") {
		// Test that it isn't empty if it isn't allowed to be empty (canBeEmpty is false)
		if (cannotBeEmpty && this.param == "") return false;
		return true;
	}
	return false;
}
// Initialize object
new BWParam("");


// *************** Cookie functions ***************

function setCookie(name, value, expires, path, domain, secure) {
  document.cookie= name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  } else {
      begin += 2;
  }
  var end = document.cookie.indexOf(";", begin);
  if (end == -1) {
      end = dc.length;
  }
  return unescape(dc.substring(begin + prefix.length, end));
}
function deleteCookie(name, path, domain) {
  if (getCookie(name)) {
      document.cookie = name + "=" +
          ((path) ? "; path=" + path : "") +
          ((domain) ? "; domain=" + domain : "") +
          "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

// *************** Misc. functions ***************

// Function to extend any page onload function to add a new function
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != "function") {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

// Function to copy value of one select/input/textarea element to another
function dupeValue(strSource, strTarget) {
	var source = document.getElementById(strSource);
	var target = document.getElementById(strTarget);
	if (source && target) {
		// If it's a select element
		if (source.tagName == "SELECT" && target.tagName == "SELECT") {
			target.selectedIndex = source.selectedIndex;
		// If it's a select element
		} else if (source.tagName == "TEXTAREA" && target.tagName == "TEXTAREA") {
			target.value = source.value;
		// If it's an input element
		} else if (source.tagName == "INPUT" && target.tagName == "INPUT") {
			target.value = source.value;
		}
	}
}
// 		supporting deprecated non-standard capitalization of function name
var DupeValue = dupeValue;


// Function to highlight an action button
function highlightActionButton(objButton, boHighlight) {
	if (boHighlight) {
		objButton.className = "epi-button buttonPrime";
		objButton.disabled = null;
	} else {
		objButton.className = "epi-button";
		objButton.disabled = "disabled";
	}
}
// 		supporting deprecated non-standard capitalization of function name
var HighlightActionButton = highlightActionButton;

// Function to highlight the parent or grandparent of a checkbox or radio button,
// 		given the tag name of the ancestor node you want to highlight
function highlightParent(node, strTag) {
	if (node.parentNode.tagName == strTag) {
		if (node.checked) {
			node.parentNode.className = 'highlight';
		} else {
			node.parentNode.className = '';
		}
	} else if (node.parentNode.parentNode.tagName == strTag) {
		if (node.checked) {
			node.parentNode.parentNode.className = 'highlight';
		} else {
			node.parentNode.parentNode.className = '';
		}
	}
}
// 		supporting deprecated non-standard capitalization of function name
var HighlightParent = highlightParent;

// Function to highlight row for each selected item (radio or checkbox) in a data table
function showCheckedRows(arrRows) {
	var boChecked = false; // initializing flag that will tell us whether anything is checked
	if (arrRows != null) {
		for (var i=0; i<arrRows.length; i++) {
			var objRow = arrRows[i];
			// Check to see row has input of a single checkbox
			var objRowInput = objRow.getElementsByTagName("input");
			if ((objRowInput.length == 1) && (objRowInput[0].type == "checkbox" || objRowInput[0].type == "radio")) {
				// Take action based on whether checkbox is checked
				if (objRowInput[0].checked) {
					// If a row is checked, add "highlight" to the className (if it isn't already highlighted)
					if (objRow.className == "") {
						objRow.className = "highlight";
					} else {
						if (objRow.className.indexOf("highlight") == -1) {
							objRow.className += " highlight";
						}
					}
					boChecked = true; // set the flag to true, we'll return this at the end of the function
				} else {
					// Remove highlight from a previously selected row
					var strTemp = objRow.className;
					strTemp = strTemp.replace("highlight","");
					// Trip stray space at end of ClassName string if any
					if (strTemp.lastIndexOf(" ") == strTemp.length - 1) {
						strTemp = strTemp.slice(0, -1);
					}
					objRow.className = strTemp;
				}
			}
		}
	}
	return boChecked;
}
// 		supporting deprecated non-standard capitalization of function name
var ShowCheckedRows = showCheckedRows;

// Function to pop up a new window with a given URL
function testLink(url, strErrMsg) {
	if (url.indexOf("http") != 0) {
		url = "http://" + url;
	}
	if (url.length > 7) {
		window.open(url);
	} else {
		alert(strErrMsg);
	}
}
// 		supporting deprecated non-standard capitalization of function name
var TestLink = testLink;

// 		Function to add test link to a field
function addTestLink(strField, strInput, strLinkText, strErrMsg) {
	// strField = id of the container element for input and tool link
	//		tool link is appened to this; if it has to be inserted specifically after the input field,
	//		strField should be empty
	// strInput = id of the input element we're testing
	// strLinkText = the text of the test link
	// strErrMsg = message displayed if test link is used but input field has nothing to test
	var field = document.getElementById(strField);
	var fieldinput = document.getElementById(strInput);
	if (fieldinput) {
		var fieldSpan = document.createElement("span");
		fieldSpan.className = "inputExtra";
		var fieldLink = document.createElement("a");
		fieldLink.className = "epi-fontSm";
		fieldLink.href = "#";
		fieldLink.onclick = function() {TestLink(fieldinput.value, strErrMsg);return false;};
		// icon
		var fieldIcon = document.createElement("img");
		var site = "";
		if ( window.location.href.indexOf("site/eon") > 0 ) {
			site="/sites/eon";
		}
		fieldIcon.src = site + "/images/icons/icon_popup_action.gif";
		fieldIcon.title = strLinkText;
		fieldIcon.alt = strLinkText;
		fieldLink.appendChild(fieldIcon);
		fieldLink.appendChild(document.createTextNode(strLinkText));
		fieldSpan.appendChild(fieldLink);
		if (strField == "" || field == null) {
			// If given no container element, insert the tool link after the input field
			fieldinput.parentNode.insertBefore(fieldSpan,fieldinput.nextSibling);
		} else {
			// Otherwise, put the test link at the end of the container element
			field.appendChild(fieldSpan);
		}
	}
}
// 			supporting deprecated non-standard capitalization of function name
var AddTestLink = addTestLink;


// ************** FUNCTIONS BELOW THIS LINE ARE DEPRECATED **************

// This function adds openPopup onclicks to every <a> tag
// 		with a class of "openPopup" or openPopupSm" within the passed object
function addOnclickOpenPopup(objScope) {
	// Private function checks for class name, adds onclick
	function CheckHref(objLink) {
		if (objLink.className.indexOf("openPopupSm") > -1) {
			// Pass arguments for small window to the openPopup function
			objLink.onclick = function() {openPopup(this.href,500,400);return false;};
		} else if (objLink.className.indexOf("openPopup") > -1) {
			// Use openPopup function with default width and height
			objLink.onclick = function() {openPopup(this.href);return false;};
		}
	}
	if (objScope != null) {
		// Run CheckHref if the passed object is a link, otherwise get and loop through links within it
		if (objScope.tagName == "A") {
			CheckHref(objScope);
		} else {
			var arrHrefs = objScope.getElementsByTagName("a");
			for (var i=0; i<arrHrefs.length; i++) {
				CheckHref(arrHrefs[i]);
			}
		}
	}
}
var AddOnclickOpenPopup = addOnclickOpenPopup;

// Function to toggle a link to hide/show content
function toggle(nodeToggle, nodeBlock, boToggle, strHide, strShow) {
	if (boToggle) {
		nodeToggle.className = "shown";
		nodeToggle.title = strHide;
		nodeToggle.onclick = function() {Toggle(this, nodeBlock, false, strHide, strShow);return false;};
		nodeToggle.style.fontWeight = "bold";
		nodeBlock.style.display = "block";
	} else {
		nodeToggle.className = "hidden";
		nodeToggle.title = strShow;
		nodeToggle.onclick = function() {Toggle(this, nodeBlock, true, strHide, strShow);return false;};
		nodeToggle.style.fontWeight = "normal";
		nodeBlock.style.display = "none";
	}
}
var Toggle = toggle;

// Function to turn the text of a heading into a toggle for its content
function replaceHeadWithToggle(strHead, strContent, boToggle, strHide, strShow) {
	var nodeHead = document.getElementById(strHead);
	var nodeBlock = document.getElementById(strContent);
	if (nodeHead && nodeBlock) {
		// Get the text of the head
		var strHeadText = "";
		if (nodeHead.firstChild.nodeName == "#text") {
			strHeadText = nodeHead.firstChild.nodeValue;
			// Create a new toggle link
			var nodeToggle = document.createElement("a");
			nodeToggle.href = "";
			nodeToggle.appendChild(document.createTextNode(strHeadText));
			// Determine whether the content is hidden or shown and toggle accordingly
			Toggle(nodeToggle, nodeBlock, boToggle, strHide, strShow);
			// Replace the h2 text with the link
			nodeHead.replaceChild(nodeToggle, nodeHead.firstChild);
		}
	}
}
var ReplaceHeadWithToggle = replaceHeadWithToggle;

// Function to toggle a section
function toggleSection(strToggle,strObj) {
	var objToggler = document.getElementById(strToggle);
	var objToggled = document.getElementById(strObj);
	if (objToggler != null && objToggled != null) {
		if (objToggled.style.display == "none") {
			objToggled.style.display = "block";
			objToggler.className = "shown";
		} else {
			objToggled.style.display = "none";
			objToggler.className = "hidden";
		}
	}
}
var ToggleSection = toggleSection;

// Function to turn a heading into a toggle link
function buildToggleHead(strSection, strHead, strHeadLink) {
	// Hide the section
	document.getElementById(strSection).style.display = "none";
	// Change the section heading to a toggling link
	var sectionHead = document.getElementById(strHead);
	var sectionHeadText = sectionHead.firstChild;
		// Build the link
	var sectionHeadLink = document.createElement("a");
	sectionHeadLink.href = "#";
	sectionHeadLink.id = strHeadLink;
	sectionHeadLink.className = "hidden";
		// Replace the header text with the link, add the text to the link
	sectionHead.replaceChild(sectionHeadLink,sectionHeadText);
	sectionHeadLink.appendChild(sectionHeadText);
}
var BuildToggleHead = buildToggleHead;

// Function to remove span tags from around strings, needed when i18n'ing strings for JavaScript
function scrubSpans(str) {
	var scrubbedStr = str;
	if (str.toLowerCase().indexOf("<span") == 0 || str.toLowerCase().indexOf("&lt;span") == 0) {
		// Find the end of the opening span tag, either ">" or "&gt;"
		var intStart = 0;
		var intEnd = str.length;
		intCloseBracket = str.indexOf(">");
		intCloseEntity = str.indexOf("&gt;");
		if ( (intCloseBracket < intCloseEntity || intCloseEntity == -1) && intCloseBracket != -1 ) {
			intStart = intCloseBracket + 1;
		} else {
			intStart = intCloseEntity + 4;
		}
		// Find the start of the closing span tag, either "<" or "&lt;"
		intOpenBracket = str.indexOf("</");
		intOpenEntity = str.indexOf("&lt;/");
		if ( (intOpenBracket < intOpenEntity || intOpenEntity == -1) && intOpenBracket != -1 ) {
			intEnd = intOpenBracket;
		} else {
			intEnd = intOpenEntity;
		}
		// Now excise the string from between the opening and closing span tags, if they existed
		scrubbedStr = str.substring(intStart, intEnd);
	}
	return scrubbedStr;
}
var ScrubSpans = scrubSpans;

function checkCapsLock(){	
	//initiate capslockstate plugin
	if(jQuery(":password").length > 0) {
		jQuery(window).capslockstate();
		jQuery(window).bind("capsOn", function(event) {		
	        if (jQuery(":Password:focus").length > 0 ) {
	            jQuery("#capsWarning").show();        
	        }
	    });
	 	jQuery(window).bind("capsOff capsUnknown", function(event) {
	 		jQuery("#capsWarning").hide();
	    });
	 	jQuery(":Password").focusout(function() {
	 		jQuery("#capsWarning").hide();
	    });
	 	jQuery(":Password").focusin(function() {
	        if (jQuery(window).capslockstate("state") === true) {
	        	jQuery("#capsWarning").show();
	        }
	    });
	}
}
