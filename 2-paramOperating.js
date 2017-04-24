/**
 * Created by yj on 2016/12/31.
 */
// 为了书写方便，将mQuery.prototype存到另外一个属性fn中
// 参数selector最终会传入init成员方法中
// 接下来我们分析一下传入的selector的各种情况
// undefind null boolean number没什么好处理的
// object-function: 异步处理，等页面加载完成再执行该函数，暂时不考虑链式调用的问题，即不考虑返回值的问题，因为涉及到了异步框架，很复杂
// object-domObj: 包装一下，变成jQuery对象 注意这里并不处理getElementsByTagName等生成的类数组对象，可以自己考虑一下为什么
// object-jqueryObj: 直接返回该jQuery对象
// string-"<div>": 创建元素
// string-"<div class='aaa'>": 创建复杂元素
// string-"<div class='aaa'><span class='txt'>ttt</span></div>": 创建嵌套元素
// string-"#div1": 根据id获取元素
// string-".div1 .txt": 其他方式获取元素
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype;
    mQuery.fn.jQuery = "2.0";
    mQuery.fn.init = function (selector) {
        //对于一切为假的东西，同一返回一个jQuery实例化对象
        //js中为假的值有哪些：0 NaN "" false undefined null
        if(!selector){
            return this;
        } else if(typeof selector == "function") {

        } else if(selector.nodeType) {

        } else if(selector.jQuery) {
            //识别jQuery对象，可以自己赋一个jQuery属性上去，判断是否有该属性，为了避免和其他对象冲突，可以设计一个随机数属性，在此说明问题即可
            //jQuery内部不是这样做的，有兴趣可以自己研究下
        } else if(typeof selector == "string") {

        }
    };
    mQuery.fn.init.prototype = mQuery.fn;

    window.mQuery = window.$ = mQuery;
})(window);

// 对于判断一个东西是否是字符串或者是否是函数这种功能很常见，因此我们可以封装一个函数
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype;
    mQuery.fn.jQuery = "2.0";
    mQuery.fn.init = function (selector) {
        if(!selector){
            return this;
        } else if(isFunction(selector)) {

        } else if(selector.nodeType) {

        } else if(selector.jQuery) {

        } else if(isString(selector)) {

        }
    };
    mQuery.fn.init.prototype = mQuery.fn;

    function isFunction (o) {
        return typeof o == "function";
    }
    function isString (o) {
        return typeof o == "string";
    }

    window.mQuery = window.$ = mQuery;
})(window);
// 工具方法在慢慢增加，零散在下面的方法就会增多
// 而且像isFunction isString这些方法对于日常开发也比较常用，因此可以公开出去
// 但是我们的库公开出去的只有mQuery和$两个变量，该怎么办呢？
// 注意：js中一切皆对象，对象就会有属性和方法，我们自己也可以给对象扩展一些属性和方法
// 函数也是对象，mQuery是一个函数，因此我们可以把isFunction isString这些工具方法扩展到mQuery这个函数对象上，即
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype;
    mQuery.fn.jQuery = "2.0";
    mQuery.fn.init = function (selector) {
        if(!selector){
            return this;
        } else if($.isFunction(selector)) {

        } else if(selector.nodeType) {

        } else if(selector.jQuery) {

        } else if($.isString(selector)) {

        }
    };
    mQuery.fn.init.prototype = mQuery.fn;

    $.isFunction = function (o) {
        return typeof o == "function";
    };
    $.isString = function (o) {
        return typeof o == "string";
    };

    window.mQuery = window.$ = mQuery;
})(window);
//将上面的代码整合一下
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
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

    $.isFunction = function (o) {
        return typeof o == "function";
    };
    $.isString = function (o) {
        return typeof o == "string";
    };

    window.mQuery = window.$ = mQuery;
})(window);
// 分别处理传进来的各种类型参数
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
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

    mQuery.isFunction = function (o) {
        return typeof o == "function";
    };
    mQuery.isString = function (o) {
        return typeof o == "string";
    };

    window.mQuery = window.$ = mQuery;
})(window);
// 上面在扩展isFunction isString的时候每次都要写一个mQuery，比较繁琐，因此我们要改进一下
// 封装一个函数用来对mQuery属性及方法扩展：extend(dst, src)
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
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

    mQuery.isFunction = function (o) {
        return typeof o == "function";
    };
    mQuery.isString = function (o) {
        return typeof o == "string";
    };
    mQuery.isArray = function (o) {
        //ECMA5新方法：Array.isArray
        return Object.prototype.toString.call(o) === "[object Array]";
    };
    mQuery.extend = extend;
    function extend(dst, src){
        for(var attr in src){
            //数组和json
            if((typeof src[attr] == "object") && (src[attr] != null)){
                extend(dst[attr] ? dst[attr] : dst[attr] = {}, src[attr]);
            } else {
                dst[attr] = src[attr];
            }
        }
    }

    window.mQuery = window.$ = mQuery;
})(window);
//extend内对于数组和json需要分别处理
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
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

    mQuery.isFunction = function (o) {
        return typeof o == "function";
    };
    mQuery.isString = function (o) {
        return typeof o == "string";
    };
    mQuery.isArray = function (o) {
        //ECMA5新方法：Array.isArray
        return Object.prototype.toString.call(o) === "[object Array]";
    };
    mQuery.extend = extend;
    function extend(dst, src){
        //如果只传了一个参数，可以认定是往this上扩展，需要对参数进行修正
        if(arguments.length == 1){
            src = dst;
            dst = this;
        }
        for(var attr in src){
            //数组和json
            if((typeof src[attr] == "object") && (src[attr] != null)){
                if(mQuery.isArray(src[attr])){
                    extend(dst[attr] ? dst[attr] : dst[attr] = [], src[attr]);
                }else{
                    extend(dst[attr] ? dst[attr] : dst[attr] = {}, src[attr]);
                }
            } else {
                dst[attr] = src[attr];
            }
        }
    }

    window.mQuery = window.$ = mQuery;
})(window);
//用extend优化
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
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

    mQuery.extend = extend;
    function extend(dst, src){
        //如果只传了一个参数，可以认定是往this上扩展，需要对参数进行修正
        if(arguments.length == 1){
            src = dst;
            dst = this;
        }
        for(var attr in src){
            //数组和json
            if((typeof src[attr] == "object") && (src[attr] != null)){
                if(mQuery.isArray(src[attr])){
                    extend(dst[attr] ? dst[attr] : dst[attr] = [], src[attr]);
                }else{
                    extend(dst[attr] ? dst[attr] : dst[attr] = {}, src[attr]);
                }
            } else {
                dst[attr] = src[attr];
            }
        }
    }
    mQuery.extend({
        isFunction: function (o) {
            return typeof o == "function";
        },
        isString: function (o) {
            return typeof o == "string";
        },
        isArray: function (o) {
            //ECMA5新方法：Array.isArray
            return Object.prototype.toString.call(o) === "[object Array]";
        }
    });

    window.mQuery = window.$ = mQuery;
})(window);
//PubSub模型
//接下来解决传入函数时的情况
(function (window) {
    function mQuery(selector) {
        return new mQuery.fn.init(selector);
    }
    mQuery.fn = mQuery.prototype = {
        constructor: mQuery,
        jQuery: "2.0",
        elements: [],
        init: function (selector) {
            if(!selector){
                return this;
            } else if($.isFunction(selector)) {
                readyPubSub.subscribe(selector);
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

    mQuery.extend = extend;
    function extend(dst, src){
        //如果只传了一个参数，可以认定是往this上扩展，需要对参数进行修正
        if(arguments.length == 1){
            src = dst;
            dst = this;
        }
        for(var attr in src){
            //数组和json
            if((typeof src[attr] == "object") && (src[attr] != null)){
                if(mQuery.isArray(src[attr])){
                    extend(dst[attr] ? dst[attr] : dst[attr] = [], src[attr]);
                }else{
                    extend(dst[attr] ? dst[attr] : dst[attr] = {}, src[attr]);
                }
            } else {
                dst[attr] = src[attr];
            }
        }
    }
    mQuery.extend({
        isFunction: function (o) {
            return typeof o == "function";
        },
        isString: function (o) {
            return typeof o == "string";
        },
        isArray: function (o) {
            //ECMA5新方法：Array.isArray
            return Object.prototype.toString.call(o) === "[object Array]";
        }
    });

    //PubSub模块
    var readyPubSub = mQuery.PubSub();

    mQuery.PubSub = function () {
        return {
            published: false,
            subscribeList: [],
            subscribe: function (fn) {
                this.subscribeList.push(fn);
				// 如果已经触发过发布了，在订阅上的时候就应该立即发布
                if(this.published){
                    this.publish();
                }
            },
            publish: function () {
                for(var i= 0;i<this.subscribeList.length;i++){
                    this.subscribeList[i]();
                    this.subscribeList.shift();
                    i--;
                }
                this.published = true;
            }
        };
    };

    window.mQuery = window.$ = mQuery;
})(window);


// 上面代码中所说的已经触发过发布订阅上内容的案例：
$(function(){
	var a = 1;
	$(function(){
		//...
	});
});
























