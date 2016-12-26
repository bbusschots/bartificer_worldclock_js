
/**
 * @overview An Object Oriented JavaScript API for adding live digital clocks in
 * any timezone into web pages. This API is entirely contained within the
 * {@link bartificer.Worldclock} namespace.
 *
 * This API assumes that jQuery ({@link http://jquery.org}) and MomentJS
 * Timezone ({@link http://momentjs.com/timezone/}) have been included into the
 * page before this file is included.
 *
 * @author Bart Busschots
 * @license BSD-2-Clause
 * @requires jQuery
 * @requires moment-timezone
 */

//
// === Add All Needed JSDoc Type definitions
//

/**
* An object created using `{}` or `new Object()`. jQuery's `$.isPlainObject()`
* function is used to validate this datatype.
* @typedef {Object} plainObject
*/

/**
 * A jQuery object representing exactly one element which is a `span`, `div`,
 * `paragraph`, or `heading`.
 * @typedef {Object} jQuerySingleContainer
 */

/**
 * A timezone string from the
 * [IANA Time Zone Database](https://en.wikipedia.org/wiki/Tz_database), or the
 * special string `LOCAL` to indicate that the timezone of the user's browser
 * should be used.
 *
 * A full list of the valid strings can be found in the
 * [third column of this listing}(https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
 * @typedef {string} timezone
 */


/**
 * An opacity value - a number between 0 and 1 inclusive, where 0 represents
 * fully transparent, and 1 fully opaque.
 * @typedef {number} opacity
 */

//
// === Check pre-requisites
//

// make sure jQuery is loaded
if(typeof jQuery !== 'function'){
	throw new Error('jQuery is required but not loaded');
}

// make sure MomentJS is loaded, along with timezone support
if(typeof moment !== 'function'){
	throw new Error('MomentJS is required but not loaded');
}
if(typeof moment.tz !== 'function'){
	throw new Error('MomentJS is loaded, but without Timezone support, which is required');
}

//
// === Initialise the bartificer namespace etc ===
//
var bartificer = bartificer ? bartificer : {};
(function(bartificer, $, undefined){
    //
    // === Define any needed validaiton functions
    //

    /**
     * Test if a given value is a plain object.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {*} obj The value to test.
     * @return {boolean} `true` if the value is a reference to a plain object,
     * `false` otherwise.
     * @see plainObject
     */
    function isPlainObject(obj){
        return $.isPlainObject(obj) ? true : false;
    }

    /**
     * Validation function to check if a given value is a reference to a jQuery
     * object representing exactly one valid container.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {*} obj The value to test.
     * @return {boolean} `true` of the value is valid, `false` otherwise.
     * @see jQuerySingleContainer
     */
    function isJQuerySingleContainer(obj){
        if(typeof obj !== 'object'){
            return false;
        }
        if(!(obj instanceof $)){
            return false;
        }
        if(obj.length !== 1){
            return false;
        }
        return obj.is('span, div, p, h1, h2, h3, h4, h5, h6') ? true : false;
    }


    /**
     * A lookup table of all valid timezones
     * @memberof bartificer
     * @inner
     * @private
     * @type {Object.<string, boolean>}
     */
    var timezoneLookup = {};
    moment.tz.names().forEach(function(tzName){
        timezoneLookup[tzName] = true;
    });

    /**
     * Test if a given value is a valid timezone.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {*} str The value to test.
     * @return {boolean} `true` if the test value is a valid timezone, `false`
     * otherwise.
     * @see timezone
     */
    function isTimezone(str){
        if(typeof str !== 'string'){
            return false;
        }
        return timezoneLookup[str] ? true : false;
    }

    /**
     * Test if a given value is a boolean.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {*} b The value to test.
     * @return {boolean} `true` if the value is a boolean, `false` otherwise.
     */
    funciton isBoolean(b){
        return typeof b === 'boolean' ? true : false;
    }

    /**
     * Test if a given valu is a valid opacity (number between 0 and 1
     * inclusive).
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {type} o The value to test
     * @return {boolean} `true` if the value is a valid opacity, `false`
     * otherwise
     * @see opacity
     */
    function isOpacity(o){
        if(typeof o !== 'number'){
            return false;
        }
        return o >= 0 && o <= 1 ? true : false;
    }

    //
    // === Define the bartificer.Worldclock Prototype
    //

    /**
     * A function to coerce any value to a Boolean. If the value is undefined
     * the default value is returned (forced to a boolean), otherwise, the
     * 'truthiness' of the value is returned.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {*} val The value to be coerced.
     * @param  {type} default The default value.
     * @return {boolean}
     */
    function coerceToBoolean(val, default){
        if(typeof val === 'undefined'){
            return default ? true : false;
        }
        return val ? true : false;
    }

    /**
     * An object containing metadata about each of the valid options a clock
     * can accept.
     *
     * The keys of the object are the names of the options, and each points to
     * another plain object indexed by the following values:
     *
     * * `description` - a string containing a description of the data expected
     *   for the option which will be used in error messages.
     * * `default` - the default value for the option.
     * * `validator` - a reference to a function that accepts one argument,
     *   and returns a boolean. The function will be used to test if values are
     *   valid for the option
     * * coerce - (OPTIONAL) a reference to a fucntion that will transform any
     *   value to a valid value for the option. Options that define a coercion
     *   will not trigger errors when an invalid value is passed. The function
     *   will be called with two arguments - the value to be coerced, and the
     *   default value for the option.
     * * `onChange` - (OPTIONAL) a reference to a function that will be called
     *   each time the option's value is set. When the function is called, the
     *   special this variable will be set to a reference to the clock object to
     *   which the option belongs, and the new value for the option will be
     *   passed as the first argument.
     *
     * A reference to the object representing the clock will be added to the
     * container as a the data attribute `data-bartificer-worldclock` (or
     * `bartificerWorldclock` from JavaScript's point of view).
     *
     * @memberof bartificer
     * @inner
     * @private
     * @type {plainObject}
     */
    var optionDetails = {
        animationTime: {
            description: 'the time animations should happen over in milliseconds - must be a number between 0 and 1,000 inclusive',
            default: 250,
            validator: function(aniTime){
                // make sure the animation time is a number
                if(typeof aniTime !== 'number'){
                    return false;
                }

                // make sure the animation time is an integer
                if(parseInt(aniTime) != aniTime){
                    return false;
                }

                // make sure the animation time is in the right range
                return aniTime >= 0 && aniTime <= 1000 ? true : false;
            }
        },
        blinkSeparators: {
            description: "a boolean indicating whether or not to blink the separator(s)",
            default: true,
            validator: isBoolean,
            coercion: coerceToBoolean
        },
        separatorOnOpacity: {
            description: "the opacity to use for a separator when it is 'on' as a number between 0 and 1 inclusive",
            default: 0.8,
            validator: isOpacity,
            onChange: function(newVal){
                if(!this._options.blinkSeparators){
                    this._$separatorHM.fadeTo(this._options.animationTime, newVal);
                    this._$separatorMS.fadeTo(this._options.animationTime, newVal);
                }
            }
        },
        separatorOffOpacity: {
            description: "the opacity to use for a separator when it is 'off' as a number between 0 and 1 inclusive",
            default: 0.2,
            validator: isOpacity
        },
        showSeconds: {
            description: "a boolean indicating whether or not to show the seconds",
            default: false,
            validator: isBoolean,
            coercion: coerceToBoolean,
            onChange: fuction(newVal){
                if(newVal){
                    this._$separatorMS.hide(this._options.animationTime);
                    this._$seconds.hide(this._options.animationTime);
                }else{
                    this._$separatorMS.show(this._options.animationTime);
                    this._$seconds.show(this._options.animationTime);
                }
            }
        },
        timezone: {
            description: "the timezone for the clock as an IANA string, or, the special value 'LOCAL'",
            default: 'LOCAL',
            validator: isTimezone
        }
    };

    //
    // -- the constructor --
    //

    /**
     * Transform an HTML element into a clock and build an object to represent
     * it.
     *
     * The container for the clock will have the CSS class
     * `bartificer-worldclock` added to it.
     *
     * The following elements will be added into the container:
     *
     * ```
     * <span class="bartificer-worldclock-hours"></span>
     * <span class="bartificer-worldclock-separator bartificer-worldclock-separator-hm"></span>
     * <span class="bartificer-worldclock-minutes">:</span>
     * <span class="bartificer-worldclock-separator bartificer-worldclock-separator-ms">:</span>
     * <span class="bartificer-worldclock-seconds"></span>
     * ```
     *
     * @constructor
     * @param  {jQuerySingleContainer} $container - A jQuery object representing
     * the element on the page that will be converted into the clock. Note that
     * this element will be emptied.
     * @param  {plainObject} [options={}] An optional plain object containing
     * configuration options.
     * @param {number} [options.animationTime=250] The time animations take
     * place over in milliseconds. Must be a whole number between 0 and 1,000
     * inclusive.
     * @param {boolean} [options.blinkSeparators=true] Whether or not to blink
     * the separator(s) every second.
     * @param {opacity} [options.separatorOnOpacity=0.8] The opacity for
     * separators that are 'on'.
     * @param {opacity} [options.separatorOffOpacity=0.2] The opacity for
     * separators that are 'off'.
     * @param {timezone} [options.timezone='LOCAL'] The timezone for the clock.
     * @param {boolean} [options.showSeconds=false] Whether or not to show seconds.
     * @throws {TypeError}
     */
    bartificer.Worldclock = function($container, options){
        // validate the arguments
        if(isJQuerySingleContainer($container)){

            /**
             * A reference to a jQuery boject representing the clock's container
             * @private
             * @type {jQuerySingleContainer}
             */
            this._$container = $container;
        }else{
            throw new TypeError('the first argument must be a reference to a jQuery object representing exactly one valid element which must be a span, div, paragraph, or heading');
        }
        if(typeof options === 'undefined'){
            options = {};
        }
        if(!isPlainObject(options)){
            throw new TypeError('if present, the second argument must be a plain object');
        }

        /**
         * The ID of the interval controlling the clock. When the clock is
         * stopped, the value will be set to 0.
         */
        this._intervalID = 0;

        // create a reference to this for use in callbacks
        var self = this;

        // initialise all the options

        /**
         * A plain object holding the values for all the clock's options.
         * @private
         * @type {plainObject}
         */
        this._options = {};
        Object.keys(optionDetails).forEach(function(optName){
            // if a valid value was passed for the option, use it
            if(typeof options[optName] !== 'undefined'){
                if(optionDetails[optName].validator(options[optName])){
                    self._options[optName] = options[optName];
                }else{
                    // if there is a coercion defined, use it, otherwise,
                    // whine and leave blank so it can be filled in later
                    if(typeof optionDetails[optName].coercion === 'function'){
                        self._options[optName] = optionDetails[optName].coercion(options[optName], optionDetails[optName].default);
                    }else{
                        console.warn("received invalid value for option '" + optName + "' (should be " + optionDetails[optName] + ") - using default value instead");
                    }
                }
            }

            // if no value is stored for the option yet, use the default
            if(typeof self._options[optName] === 'undefined'){
                self._options[optName] = optionDetails[optName].default;
            }
        });

        // initialise the container
        this._$container.empty().addClass('bartificer-worldclock');

        /**
         * A reference to a jQuery object representing the `span` for the hours.
         * @private
         * @type {jQuery}
         */
        this._$hours = $('<span />').addClass('bartificer-worldclock-hours');
        this._$container.append(this._$hours);

        /**
         * A reference to a jQuery object representing the `span` for the
         * separator between the hours and the minutes.
         * @private
         * @type {jQuery}
         */
        this._$separatorHM = $('<span />').addClass('bartificer-worldclock-separator bartificer-worldclock-separator-hm');
        this._$separatorHM.text(':');
        this._$container.append(this._$separatorHM);

        /**
         * A reference to a jQuery object representing the `span` for the
         * minutes.
         * @private
         * @type {jQuery}
         */
        this._$minutes = $('<span />').addClass('bartificer-worldclock-minutes');
        this._$container.append(this._$minutes);

        /**
         * A reference to a jQuery object representing the `span` for the
         * separator between the minutes and the seconds.
         * @private
         * @type {jQuery}
         */
        this._$separatorMS = $('<span />').addClass('bartificer-worldclock-separator bartificer-worldclock-separator-ms');
        this._$separatorMS.text(':');
        this._$container.append(this._$separatorMS);

        /**
         * A reference to a jQuery object representing the `span` for the
         * seconds.
         * @private
         * @type {jQuery}
         */
        this._$seconds = $('<span />').addClass('bartificer-worldclock-seconds');
        this._$container.append(this._$seconds);

        // save a reference to the newly constructed object into the container
        this._$container.data('bartificerWorldclock', this);

        // call the onchange function on all options that have one
        Object.keys(optionDetails).forEach(function(optName){
            // if there is an onChange handler, call it
            if(typeof options[optName].onChange === 'function'){
                options[optName].onChange.call(self, self._options[optName]);
            }
        });

        // start the clock
        this.start();
    };

    //
    // -- Accessor methods --
    //

    /**
     * Get a reference to a jQuery object representing the clock's container.
     *
     * @return {jQuerySingleContainer}
     */
    bartificer.Worldclock.prototype.$container = function(){
        return this._$container;
    };

    /**
     * An accessor method for getting and setting the value of any option.
     *
     * @param  {string} optName  The name of the option for which the value
     * should be fetched or updated.
     * @param  {*} [optValue] An optional new value for the option.
     * @return {*|bartificer.Worldclock} If a single argument is passed, the
     * value for the specified option will be returned. If two arguments are
     * passed a reference to the calling object will be returned to facilitate
     * function chaining.
     * @throws {Error} If the first argument is not a valid option name as a
     * string, an error will be thrown. For details of all supported options,
     * see the documentation for the constructor.
     * @throws {TypeError} If two arguments are passed, and the second argument
     * is not a valid value for the option specified by the first argument an
     * error will be thrown.
     * @see bartificer.Worldclock
     */
    bartificer.Worldclock.prototype.option = function(optName, optValue){
        // make sure we got a valid option name
        if(typeof optName !== 'string'){
            throw new TypeError('the first argument must be a string');
        }
        if(typeof optionDetails[optName] !== 'object'){
            throw new Error("unknown option '" + optName + "'");
        }

        // if there is a second argument - deal with it
        if(arguments.length > 1){
            if(optionDetails[optName].validator(optValue)){
                this._options[optName] = optValue;
                if(typeof optionDetails[optName].onChange === 'function'){
                    optionDetails[optName].onChange.call(this, optValue);
                }
                return this;
            }else{
                // if there is a coercion, use it, otherwise, throw an error
                if(typeof optionDetails[optName].coercion === 'function'){
                    this._options[optName] = optionDetails[optName].coercion(optValue, optionDetails[optName].default);
                }else{
                    throw new TypeError("Invalid value for option '" + optName + "'");
                }
            }
        }

        // if we got here, we are a getter, so return the value for the option
        return this._options[optName];
    };

    //
    // -- Control Methods --
    //

    /**
     * A function to render the current time into a given clock.
     *
     * @memberof bartificer
     * @inner
     * @private
     * @param  {bartificer.Worldclock} clock The clock to render the time into.
     */
    function renderClock(clock){
        // build a moment object to represent the current time
        var now = moment();
        if(clock._options.timezone !== 'LOCAL'){
            now = now.tz(clock._options.timezone);
        }

        // render the various parts of the time
        clock._$hours.text(now.format('HH'));
        clock._$minutes.text(now.format('mm'));
        clock._$seconds.text(now.format('ss'));

        // deal with the separators as needed
        if(clock._options.blinkSeparators){
            if(parseInt(now.format('ss')) % 2 == 0){
                clock._$separatorHM.fadeTo(clock._options.animationTime, clock._options.separatorOnOpacity);
                clock._$separatorMS.fadeTo(clock._options.animationTime, clock._options.separatorOnOpacity);
            }else{
                clock._$separatorHM.fadeTo(clock._options.animationTime, clock._options.separatorOffOpacity);
                clock._$separatorMS.fadeTo(clock._options.animationTime, clock._options.separatorOffOpacity);
            }
        }
    }


    /**
     * Start the clock running.
     *
     * @return {bartificer.Worldclock} A reference to the clock the function
     * was called on to facilitate function chaining.
     */
    bartificer.Worldclock.prototype.start = function(){
        // if the clock is already running, return immediately
        if(this._intervalID){
            return this;
        }

        // create a reference to this for use in callbacks
        var self = this;

        // start the clock running
        this._intervalID = setInterval(
            function(){
                renderClock(self);
            },
            1000
        );

        return this;
    };
})(bartificer, jQuery);
