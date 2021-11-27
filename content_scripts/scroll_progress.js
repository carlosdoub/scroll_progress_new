/*
 * Default css values
 *
 * */
var default_options = {
	fontSize: 52,
	fontWeight: 900,
	verticalOffset: 20,
	horizontalOffset: 1,
	transition_duration: 700,
	opacity: 0.8,
	color: "#5a5a5a",
	textShadowWidth: 2,
	textShadowColor: "#ffffff",
	disable_img: false,
	position: "top_right"
}

/*
 * Add scroll progress element
 *
 * */
async function addScrollProgress() {
	var scroll_progress = document.getElementById("scroll_progress_asdf");

	if (scroll_progress == null) {

		var indicator = document.createElement("span");

		indicator.innerText = "";
		indicator.setAttribute("id", "scroll_progress_asdf");
		// indicator.setAttribute("style", "position: fixed; right: 1px; top: 20px; font-size: 52px; font-weight: 900; text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white; color: rgb(90, 90, 90); opacity: 0.8; z-index:1000001; font-family: Arial, Helvetica, sans-serif;");
		indicator = await appearance.setup(indicator);

		document.body.prepend(indicator);
	}
}

/*
 * Scroll progress functions
 * 
 * */

var scrollId = null;
var SCROLL_TIME = 700;
var lastShowTime = null;
var displayPercentage = 0;

function scroll() {
	var timeSinceShow = Date.now() - lastShowTime;

	if (timeSinceShow < SCROLL_TIME) {
		window.clearTimeout(scrollId);
	} 

	setIndicator();
	show();
	scrollId = window.setTimeout(function() { hide(); }, SCROLL_TIME);
}

function show() {
	var elem = document.getElementById("scroll_progress_asdf");
	elem.innerText = displayPercentage + "%"; 

	lastShowTime = Date.now(); 
	elem.style.display = "block";
}

function hide() {
	var elem = document.getElementById("scroll_progress_asdf");
	elem.style.display = "none"; 
}

function setIndicator() {
	let scrollY = window.top.scrollY;
	let scrollMaxY = window.top.scrollMaxY;

	let percentage = Math.min(((scrollY / scrollMaxY) * 100).toFixed(), 100);
	displayPercentage = percentage;
};


/*
 * Checks if the URL is an image
 *
 * */
function is_image() {
	var temp = window.location.pathname;
	temp = temp.split("/");
	temp = temp[temp.length-1];
	temp = temp.split(".");
	temp = temp[temp.length-1];

	if (temp == "bmp" ||
		temp == "gif" ||
		temp == "jpeg" ||
		temp == "jpg" ||
		temp == "jpe" ||
		temp == "png" ||
		temp == "tiff" ||
		temp == "tif") {
		
		return true;
	} else {
		return false;
	}
}


/*
 * Load options and indicator element
 *
 * */
function loadOptions() {
    var gettingOptionsSave = browser.storage.local.get("optionsSave");
    gettingOptionsSave.then(function(res) {
        if (typeof res.optionsSave === "undefined") {
            var optionsSave = default_options;
            var settingOptions = browser.storage.local.set({optionsSave});
            settingOptions.then(loadOptions);
		} else {
			if (res.optionsSave.disable_img && is_image()) {
				// Don't add scroll progress
			} else {
				SCROLL_TIME = res.optionsSave.transition_duration;
				addScrollProgress();
			}
		}
	});
}

loadOptions();

document.addEventListener("scroll", function (e) {scroll();});


