
var appearance = {
	indicator: null,
	prefs: null,

    prefChanged: function(name, value) {

        switch (name) {
            case 'position':
            case 'verticalOffset':
            case 'horizontalOffset':
                this.setPosition();
                break;
            case 'fontSize':
            case 'fontWeight':
            case 'color':
            case 'opacity':
            // case 'backgroundColor':
            // case 'padding':
            // case 'borderStyle':
            // case 'borderColor':
            // case 'borderWidth':
            // case 'borderRadius':
            // case 'transitionDuration':
            	this.indicator.style[name] = this.getValue(name, value);
            	break;
            case 'textShadowWidth':
            case 'textShadowColor':
            	this.setTextShadow();
            	break;
			case 'zIndex':
				this.indicator.style.zIndex = 9999999; // Hotfix
                break;
			case 'fontFamily':
				this.indicator.style.fontFamily = "Arial, Helvetica, sans-serif"; // Hotfix
                break;
            default:
                break;
        }
    },
    

	getValue: function(name, value) {
        switch (name) {
        	// case 'padding':
        	// case 'borderWidth':
        	// case 'borderRadius':
	        case 'fontSize':
        		return value + "px";
	        // case 'opacity':
	        // case 'transitionDuration':
	        default:
	            return value;
	    }
    },


	setTextShadow: function() {
    	let textShadow = '';
    	let width = this.prefs.textShadowWidth;

    	if(width > 0) {
    	  	let posWidth = width + "px ";
        	let negWidth = -width + "px ";
        	let color = this.prefs.textShadowColor;
    		
        	textShadow += negWidth + negWidth + "0 " + color + ", ";
        	textShadow += posWidth + negWidth + "0 " + color + ", ";
        	textShadow += negWidth + posWidth + "0 " + color + ", ";
        	textShadow += posWidth + posWidth + "0 " + color;
    	}
    		
    	this.indicator.style.textShadow = textShadow;
    },
    
	setPosition: function() {

		this.indicator.style.top = '';
		this.indicator.style.right = '';
		this.indicator.style.bottom = '';
		this.indicator.style.left = '';

		let vertical = /bottom/.test(this.prefs.position) ? 'bottom' : 'top';
		let horizontal = /left/.test(this.prefs.position) ? 'left' : 'right';

		this.indicator.style[vertical] = this.prefs.verticalOffset + "px";
		this.indicator.style[horizontal] = this.prefs.horizontalOffset + "px";

		this.indicator.style.position = "fixed";
    },

	loadPreferences: function(options) {
		this.prefs = options;

        let prefs = [ 'position',
                     'fontSize',
                     'fontWeight',
                     'textShadowWidth',
                     'color',
                     'opacity',
					'zIndex',
					'fontFamily'];
                     // 'padding',
                     // 'backgroundColor',
                     // 'borderColor',
                     // 'borderStyle',
                     // 'borderWidth',
                     // 'borderRadius',
                     // 'transitionDuration'];

        for(let pref of prefs) {
            this.prefChanged(pref, options[pref]);
        }

    },
	

	setup: async function(indicator) {

		this.indicator = indicator;
		let {optionsSave} = await browser.storage.local.get("optionsSave");

		this.loadPreferences(optionsSave);

		return this.indicator;
	}

}

