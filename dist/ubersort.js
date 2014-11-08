(function (arrProto) {
    'use strict';

    //jQuery.fn.type function
    var class2type = {},
        toString = class2type.toString;
    // Populate the class2type map
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });
    var type = function( obj ) {
        if ( obj === null ) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call(obj) ] || "object" :
            typeof obj;
    };

    //from http://stackoverflow.com/a/8052100/2039219
    function getDescendantProp(obj, desc) {
        var arr = desc.split('.');
        while(arr.length) {
            obj = obj[arr.shift()];
        }
        return obj;
    }

    var getComparatorFunc = function(config) {
        var comparator = config.comparator;

        if (!config.comparator) {
            throw new Error('Insufficient data for sorting, require comparison function');
        }

        if(type(comparator) === 'string') {
            if(ubersort.comparators[comparator]) {
                comparator = ubersort.comparators[comparator];
            } else {
                throw new Error('Unknown comparator: ' + comparator);
            }
        }

        if (type(comparator) !== 'function') {
            throw new Error('Comparator is not a function: ' + comparator);
        }

        return comparator;
    };

    /**
     *   [{property, comparator, reverse}]
     */
    var ubersort = function (configs) {
        if (type(configs) !== 'array') {
            configs = [configs];
        }
        if (arguments.length === 0 || configs.length === 0) {
            throw new Error('Config not supplied');
        }

        configs.forEach(function(config) {
            if (!config.property) {
                throw new Error('Insufficient data for sorting, require property');
            }
            config.comparator = getComparatorFunc(config);
        });

        var wrapper = function (configIndex) {
            var config = configs[configIndex];

            var arr = this,
                comparator = config.comparator,
                property = config.property,
                order = (config.reverse) ? -1 : 1;

            return function(a, b) {
                var result = comparator.call(arr, getDescendantProp(a, property), getDescendantProp(b, property)) * order;

                if (result === 0 && configs[configIndex + 1]) {
                    result = wrapper.call(this, configIndex + 1)(a, b);
                }

                return result;
            };
        };

        return this.sort(wrapper.call(this, 0));
    };

    ubersort.comparators = {
        text: function(a, b) {
            if (a === b) {
                return 0;
            }
            return ((a > b) ? 1 : -1);
        },
        numeric: function(a, b) {
            return a - b;
        }
    };

    ubersort.addComparator = function (name, func) {
        ubersort.comparators[name] = func;
    };

    if (Object.defineProperty) {
        Object.defineProperty(arrProto, 'ubersort', {
            enumerable: false,
            writable: true,
            value: ubersort
        });
    } else {
        arrProto.ubersort = ubersort;
    }
} (Array.prototype));