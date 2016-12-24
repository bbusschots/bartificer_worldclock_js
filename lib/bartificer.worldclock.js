
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
     * Test if a given value is a plain object (@{link plainObject}).
     *
     * @memberof bartificer.Worldclock
     * @inner
     * @private
     * @param  {*} obj The value to test.
     * @return {boolean} `true` if the value is a reference to a plain object,
     * `false` otherwise.
     */
    function isPlainObject(obj){
        return $.isPlainObject(obj) ? true : false;
    }

    /**
     * Validation function to check if a given value is a reference to a jQuery
     * object representing exactly one valid container
     * (@{link jQuerySingleContainer}).
     *
     * @memberof bartificer.Worldclock
     * @inner
     * @private
     * @param  {*} obj The value to test.
     * @return {boolean} `true` of the value is valid, `false` otherwise.
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
     * @memberof bartificer.Worldclock
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
     * @memberof bartificer.Worldclock
     * @inner
     * @private
     * @param  {type} str The value to test.
     * @return {boolean} `true` if the test value is a valid timezone, `false`
     * otherwise.
     */
    function isTimezone(str){
        if(typeof str !== 'string'){
            return false;
        }
        return timezoneLookup[str] ? true : false;
    }

    //
    // === Define the bartificer.Worldclock Prototype
    //

    //
    // -- the constructor --
    //

    /**
     * Transform an HTML element into a clock and build an object to represent
     * it.
     *
     * @constructor
     * @param  {jQuerySingleContainer} $container - A jQuery object representing
     * the element on the page that will be converted into the clock. Note that
     * this element will be emptied.
     * @param  {plainObject} [options={}] An optional plain object containing
     * configuration options.
     * @throws {TypeError}
     */
    bartificer.Worldclock = function($container, options){
        // validate the arguments
        if(!isJQuerySingleContainer($container)){
            throw new TypeError('the first argument must be a reference to a jQuery object representing exactly one valid element which must be a span, div, paragraph, or heading');
        }
        if(typeof options === 'undefined'){
            options = {};
        }
        if(!isPlainObject(options)){
            throw new TypeError('if present, the second argument must be a plain object');
        }

        // initialise all the options
        // TO DO

        // initialise the container
        // TO DO

        // start the clock
        // TO DO
    };
})(bartificer, jQuery);
