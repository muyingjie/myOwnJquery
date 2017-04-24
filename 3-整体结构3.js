/**
 * Created by yj on 2017/4/24.
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