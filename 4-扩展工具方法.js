/**
 * Created by yj on 2017/4/24.
 */
// 关于上个版本的代码，我们发现里面用到了判断一个东西是否是字符串或者是否是函数即这种判断数据类型的功能
// 这种基础功能必将贯穿整个库，因此非常有必要单独摘出来

// 上个版本中我们仅仅是通过typeof简单判断了一下string和function类型
// 实际上JavaScript中类型判断远没有这么简单，对于判断数据类型经历了很长的演变过程，以判断字符串为例（以下描述引用自https://github.com/lifesinger/blog/issues/175）：
// ======================================================================================
// 判断一个变量是否字符串类型，最简单直接的写法是
// function isString(obj) {
//     return typeof obj == "string"
// }
//
// 绝大部分情况下，以上代码就够用了。然而
// typeof new String("xxx") // => "object"
// 当字符串是通过 new String 生成时，typeof 返回的是 "object"，因为 new String 返回的的确是对象。可以参考这篇总结文：JavaScript's typeof operator 。
//
// 但我们才不管是字符串直接量，还是字符串对象呢，我们希望这两种情况下，isString 都能返回 true 。于是
//
// function isString(obj) {
//     return typeof obj == "string" || obj instanceof String
// }
// 上面的写法，曾出现在各种流行类库的早期代码中，一直工作得好好的。直到有人在 iframe 中，写出以下代码
//
// // 在 iframe 中
// var foo = new String("bar")
//
// if (top.isString(foo)) {
//     // Do some cool things
// }
// 上面的代码，是调用父页面的 isString 方法，来判断 iframe 中的变量是否字符串。由于 iframe 和 top 中的 String 全局对象并不相等，因此 obj instanceof String 会返回 false，于是 top.isString(foo) 华丽丽地挂了。
//
// 做前端真苦逼，但不能因为苦逼就撂挑子不干了。全世界范围内开始为这一「难题」想尽各种办法，后来有神人出山，轻松给出一段代码
//
// function isString(obj) {
//     Object.prototype.toString.call(obj) == "[object String]"
// }
// 此代码一出，天下震惊，引各路类库竞折腰。这代码，可不仅仅解决了 isString 的问题，而是解决了 isXxx 一类问题。
//
// 神码原理很简单。简言之，是因为 ECMAScript 就是这么规定的，而各个浏览器都遵守了这一规定，因此就有了这一统天下的写法。有兴趣的，可以看这篇文章：instanceof considered harmful (or how to write a robust isArray) 。
// ======================================================================================
// 因此我们采取判断类型的方法自然是Object.prototype.toString.call，于是：
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

    $.isFunction = function (o) {
        return Object.prototype.toString.call(obj) == "[object Function]";
    };
    $.isString = function (o) {
        return Object.prototype.toString.call(obj) == "[object String]";
    };

    window.mQuery = window.$ = mQuery;
})(window);