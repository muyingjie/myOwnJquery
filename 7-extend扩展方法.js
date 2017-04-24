/**
 * Created by yj on 2017/4/24.
 */
// 封装对象扩展方法
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
    mQuery.extend = function (isDeep, dst, src){
        var args = mQuery.toArray(arguments);
        var len = args.length;
        // 没传参的情况
        if (!len){
            return;
        }

        // 只传一个参数的情况：mQuery.extend({a: xxx}); 给myj本身扩展
        if (len == 1 && mQuery.isGenericObj(isDeep)) {
            src = isDeep;
            dst = this;
            isDeep = false;
        } else {
            _paramError ();
        }

        // 传了两个参数的情况
        if (len == 2) {
            if (!mQuery.isBoolean(isDeep) && mQuery.isGenericObj(isDeep)) {
                isDeep = false;
                src = dst;
                dst = isDeep;
            } else if (mQuery.isGenericObj(dst)) { // 该分支保证了isDeep是布尔类型，可以专注判断第二个参数
                // 依然是给myj本身添加
                src = dst;
                dst = this;
            } else {
                _paramError ();
            }
        }

        // 传了三个参数的情况
        if (len == 3 && (!mQuery.isBoolean(isDeep) || !mQuery.isGenericObj(dst) || !mQuery.isGenericObj(src))) {
            _paramError();
        }

        // 开始遍历
        var v;
        for(var k in src) {
            v = src[k];

            if (dst[k]) { // 目标中有对应的key
                // 目标和源中如果存在相同的项，如果是基本类型没必要复制，如果是引用类型，会引起死递归
                if(dst[k] === v) {
                    return false;
                }

                if (mQuery.isGenericObj(v)) { // 如果源和目标都是对象类型，则递归
                    mQuery.extend(isDeep, dst[k], v);
                } else { // 如果源和目标有任何一项是基础类型，直接覆盖
                    dst[k] = v;
                }
            } else { // 目标中没有对应的key
                dst[k] = v;
            }
        }

        function _paramError () {
            mQuery.error("参数" + JSON.stringify(args) + "错误");
        }
    };

    window.mQuery = window.$ = mQuery;
})(window);