/**
 * Created by yj on 2017/4/24.
 */
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
                //等到异步模块再讲解
            } else if(selector.nodeType) {
                return this.elements.push(selector);
            } else if(selector.jQuery) {
                return selector;
            } else if($.isString(selector)) {
                //创建元素的情况
                if(selector[0] == '<' && selector[selector.length - 1] == '>' && selector.length > 3) {
                    var oDiv = document.createElement("div");
                    oDiv.innerHTML = selector;
                    this.elements = oDiv.children;
                    return this;
                }
                //获取元素的情况：事实上通过选择器获取元素非常复杂，需要我们学习很多预备知识：编译原理 正则等等
                //在此我们先用html5提供的一个方法来暂时代替
                else {
                    var aEle = document.querySelectorAll(selector);
                    this.elements = aEle;
                    return this;
                }
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