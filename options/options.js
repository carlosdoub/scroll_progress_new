/*
 * Default options
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

function setPosition() {
	var elem;
	elem = document.querySelector("#top_right");
	if (elem.checked)
		return elem.id;
	elem = document.querySelector("#top_left")
	if (elem.checked)
		return elem.id;
	elem = document.querySelector("#bottom_right")
	if (elem.checked)
		return elem.id;
	elem = document.querySelector("#bottom_left")
	if (elem.checked)
		return elem.id;
}

function assign_options(options) {
	var font_size = document.querySelector("#font_size");
	font_size.value = options.fontSize;
	var font_weight = document.querySelector("#font_weight");
	font_weight.value = options.fontWeight;
	var vertical_offset = document.querySelector("#vertical_offset");
	vertical_offset.value = options.verticalOffset;
	var horizontal_offset = document.querySelector("#horizontal_offset");
	horizontal_offset.value = options.horizontalOffset;
	var transition_duration = document.querySelector("#transition_duration");
	transition_duration.value = options.transition_duration;
	var opacity = document.querySelector("#opacity");
	opacity.value = options.opacity;
	var color = document.querySelector("#color");
	color.value = options.color;
	var text_shadow_width = document.querySelector("#text_shadow_width");
	text_shadow_width.value = options.textShadowWidth;
	var text_shadow_color = document.querySelector("#text_shadow_color");
	text_shadow_color.value = options.textShadowColor;
	var disable_img = document.querySelector("#disable_img");
	disable_img.checked = options.disable_img;
	var position = document.querySelector("#" + options.position);
	position.checked = true;
}

function saveOptions() {

	var position_option = setPosition();
	
    var optionsSave = {
        fontSize: document.querySelector("#font_size").value,
        fontWeight: document.querySelector("#font_weight").value,
        verticalOffset: document.querySelector("#vertical_offset").value,
        horizontalOffset: document.querySelector("#horizontal_offset").value,
        transition_duration: document.querySelector("#transition_duration").value,
        opacity: document.querySelector("#opacity").value,
        color: document.querySelector("#color").value,
        textShadowWidth: document.querySelector("#text_shadow_width").value,
        textShadowColor: document.querySelector("#text_shadow_color").value,
        disable_img: document.querySelector("#disable_img").checked,
		position: position_option
    };

	var {validate, errors} = validateOptions(optionsSave);
	if (validate) {
		var savingOptions = browser.storage.local.set({optionsSave});
		savingOptions.then(function() {
			showSuccessMessage("Options saved");
		});
	} else {
		showFailureMessage("Options not saved - Validation errors in: ", errors);
	}
}

function restoreOptions() {

	var position_option = setPosition();
	var optionsSave = default_options;

	var savingOptions = browser.storage.local.set({optionsSave});
	savingOptions.then(function() {
		assign_options(default_options);
		showSuccessMessage("Options restored to default");
		});
	savingOptions.catch(function() {
		console.log("CATCH");
	});
}


function populateOptions() {

    var loadingOptionsSave = browser.storage.local.get("optionsSave");

    loadingOptionsSave.then(function(res) {
        if (typeof res.optionsSave === "undefined") {
            var optionsSave = default_options;
            var settingOptions = browser.storage.local.set({optionsSave});
            settingOptions.then(populateOptions);
		} else {
			assign_options(res.optionsSave);
		}
	});
}

function showSuccessMessage(message) {
	var save_message = document.querySelector("#save_message");
	save_message.style.color = "green";
	save_message.innerText = message;
	save_message.style.display = "block";

	setTimeout(function() {
		save_message.style.display = "none";
			}, 2000);
}

function showFailureMessage(message, errors) {
	var save_message = document.querySelector("#save_message");
	save_message.style.color = "red";
	save_message.innerText = message + errors.join(", ");
	save_message.style.display = "block";
}

function validateOptions(optionsSave) {

	var validate = true;
	var errors = [];

	// Position

	// Offset
	if (!optionsSave.verticalOffset || isNaN(optionsSave.verticalOffset)) {
		validate = false;
		errors.push("vertical offset");
	}
	if (!optionsSave.horizontalOffset || isNaN(optionsSave.horizontalOffset)) {
		validate = false;
		errors.push("horizontal offset");
	}

	// Transition duration
	if (!optionsSave.transition_duration || isNaN(optionsSave.transition_duration)) {
		validate = false;
		errors.push("transition duration");
	}
	
	// Font size	
	if (!optionsSave.fontSize || isNaN(optionsSave.fontSize)) {
		validate = false;
		errors.push("font size");
	}
	// Font weight
	if (!optionsSave.fontWeight) {
		validate = false;
		errors.push("font weight");
	} 
	
	// Opacity
	if (!optionsSave.opacity || isNaN(optionsSave.opacity)) {
		validate = false;
		errors.push("opacity");
	} else if (Math.ceil(optionsSave.opacity*10) != Math.floor(optionsSave.opacity*10)) {
		validate = false;
		errors.push("opacity decimal digit");
	} else if (optionsSave.opacity < 0 || optionsSave.opacity > 1.0) {
		validate = false;
		errors.push("opacity number range");
	}
	// Color
	
	// Text shadow width
	if (!optionsSave.textShadowWidth || isNaN(optionsSave.textShadowWidth)) {
		validate = false;
		errors.push("text shadow width");
	}
	// Text shadow color

	return {
		validate,
		errors
	}
}
document.querySelector("#version").innerText = browser.runtime.getManifest().version;

populateOptions();
document.querySelector("#save_options").addEventListener("click", saveOptions);
document.querySelector("#restore_options").addEventListener("click", restoreOptions);


