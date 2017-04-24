/**
 * Created by yj on 2017/4/24.
 */
// 类型判断的问题似乎解决了，但问题的关键是这么多数据类型都需要判断，都这样写一遍，代码就太臃肿了，我们急需一个工具函数来专门为我们的库做扩展
// 这里我们添加了一个each方法，each方法实际上用了所谓的迭代器模式
// each的代码实在太简单了，没什么好说的
// 我们通过each为mQuery扩展了所有判断类型的方法
// 还有两个方法
// isGeneric 用来判断是否是Object或数组类型
// toArray 用来转数组
// 后期我们会用到
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        elements: [],
        init: function (selector) {
            if(!selector){
                return this;
            } else if($.isFunction(selector)) {

            } else if(selector.nodeType) {

            } else if(selector.jQuery) {

            } else if($.isString(selector)) {

            }
        }
    };
    mQuery.fn.init.prototype = mQuery.fn;

    mQuery.each = function (o, fn) {
        if (typeof o == "object") {
            if (o.length != undefined && o.length > 0) {
                // 数组
                for (var i = 0, len = o.length; i < len; i++) {
                    // 如果写成直接用!一转，没有写返回值的话默认返回return直接就结束循环了
                    // if (!fn.call(o[i], i, o[i])) {
                    if (fn.call(o[i], i, o[i]) === false) {
                        break;
                    }
                }
            } else {
                // 对象
                for (var attr in o) {
                    // if (!fn.call(o[attr], attr, o[attr])) {
                    if (fn.call(o[attr], attr, o[attr]) === false) {
                        break;
                    }
                }
            }
        } else {
            mQuery.error("参数o非法");
        }
    };
    mQuery.error = function (eInfo) {
        throw new Error(eInfo);
    };

    // 扩展判断类型的方法
    // 判断类型很常用，所以拿出来，对于工具方法我们放在一个公共的对象中
    var _type2string = [
        "Number",
        "Boolean",
        "String",
        "Function",
        "Object",
        "Array",
        "RegExp",
        "Null",
        "Undefined",
        "Window"
    ];
    function _getToString(o) {
        return Object.prototype.toString.call(o);
    }
    mQuery.each(_type2string, function (i, s) {
        mQuery["is" + s] = function(o){
            return _getToString(o) === "[object "  + s + "]";
        };
    });
    mQuery.isGenericObj = function (o) {
        return mQuery.isArray(o) || mQuery.isObject(o);
    };


    mQuery.toArray = function (oArrayLike) {
        if (mQuery.isNumber(oArrayLike["length"])) {
            return Array.prototype.slice.call(oArrayLike);
        } else {
            mQuery.error("不能转为类数组");
        }
    };
    
    window.mQuery = window.$ = mQuery;
})(window);