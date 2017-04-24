/**
 * Created by yj on 2016/12/30.
 */
// 我们在这里写的框架并不是分析jQuery的源码，而是借鉴jQuery的做法，最重要的是自己思考如何实现
// 和jQuery相比比较简单，同时和jQuery非常相似
// 1、为避免污染全局变量，用匿名函数自执行的方式包裹，从而只定义了两个全局变量：mQuery $
// 2、平时使用jQuery的时候直接用$(xxx)，$实际上就是一个函数，即每次$(xxx)一下实际上就是调用了一下$函数，也就是调用了一下mQuery函数
// 3、思考：如果我们自己设计一个框架实现的思路是什么？
// 在jQuery中为$(".div1")传递这样的字符串参数返回了一个对象，这个对象下有很多方法，很容易想到用面向对象来实现
// 首先对传入的参数进行处理，根据参数类型的不同做不同的处理，分析传入的参数类型都有哪些：
// 从js数据类型入手：undefind null boolean number string object
// undefind null boolean number没什么好处理的
// object-function: 异步处理，等页面加载完成再执行该函数，暂时不考虑链式调用的问题，即不考虑返回值的问题，因为涉及到了异步框架，很复杂
// object-domObj: 包装一下，变成jQuery对象 注意这里并不处理getElementsByTagName等生成的类数组对象，可以自己考虑一下为什么
// object-jqueryObj: 直接返回该jQuery对象
// string-"<div>": 创建元素
// string-"<div class='aaa'>": 创建复杂元素
// string-"<div class='aaa'><span class='txt'>ttt</span></div>": 创建嵌套元素
// string-"#div1": 根据id获取元素
// string-".div1 .txt": 其他方式获取元素
// 从domObj类型往后都是对DOM对象的操作，因此我们需要把所有的这些情况都做统一抽象，创建一个类，并在其原型上扩展attr css click append等方法
// 通过$("xxx").css({width: "100px"})这样调用的时候一定是把通过$("xxx")选择到或创建的元素遍历了一遍，然后依次设置css样式
// 那么必然需要一个属性存储选取到的DOM元素
// 例如：this.elements = [div, div, div];
// 行不行，先来试一试就知道了
(function (window) {
    function mQuery() {

    }
    mQuery.prototype.attr = function () {

    };
    mQuery.prototype.css = function () {

    };
    mQuery.prototype.click = function () {

    };
    window.mQuery = window.$ = mQuery;
})(window);
// 由于window.mQuery = window.$ = mQuery;的原因，这里的调用实际上就是调用了匿名函数自执行里面定义的mQuery了
// 在外面直接这样调用实际上就相当于mQuery()
// 但是这样调用是不能调用attr css等方法的
// $()只是普通的函数调用，普通的函数调用返回值如果没有指定的话返回的是undefined


// 只有通过new调用才会返回对象，如果通过new调用的函数中手动通过return返回了别的值，自己下去看一下结果是什么
var $obj = new $();
// 这样一来就可以访问attr css等方法了
$obj.attr();
// 但是不能链式调用
// 原因：js编译器遇到xxx.yyy()的时候就会将xxx当做是一个对象，然后尝试调用xxx对象的yyy方法
// 思考：$obj.attr既然是一个函数，那么在此处$obj.attr()这样调用因为没有用new修饰，因此函数如果没有指定返回值，则返回undefined
// 在这里$obj.attr();返回的必须是一个对象，而且必须是mQuery类实例化的对象才可以
// 但是这里绝对不可以new $obj.attr()，因为mQuery和$obj.attr是两个不一样的函数，因此这样做返回的一定不是mQuery类的实例化对象
// 而是$obj.attr函数的实例化对象，在此只需要返回this就可以，因为只要是通过$obj.attr()来调用，this在这里指向的就是mQuery的实例化对象
// 在此一定要注意必须要通过$obj.attr()来调用attr方法，里面的this才指向mQuery的实例化对象
// 既然是mQuery的实例化对象，mQuery的实例化对象拥有css方法，因此就可以调用css方法了
// 但是这种方式也有一个缺点，那就是每个方法中必须要手动写上return this;而且由于把this return回去了，再想return回去别的值就不方便了
$obj.attr().css();
// 再者，jQuery在使用的时候根本没有通过new这一步，换句话说，我们$(xxx)这样调用的时候其实就返回回来了一个mQuery实例化对象了
// 所以我们才可以在后面接着调用mQuery实例化对象上的方法
$().attr().css()
// 如何做到返回mQuery实例化对象呢？
// 很容易能想到直接return new mQuery()不就完事了，这样肯定不可以，因为形成死递归了
(function (window) {
    function mQuery() {
        return new mQuery();
    }
    window.mQuery = window.$ = mQuery;
})(window);
// 刚才是因为return的时候依然是调用本函数，因此造成死递归
// 如果return回去的时候不调用本函数不就可以了吗，例如调用mQuery的一个成员函数init
(function (window) {
    function mQuery() {
        return new mQuery.prototype.init();
    }
    mQuery.prototype.init = function () {

    };
    window.mQuery = window.$ = mQuery;
})(window);
// 但是这时矛盾的地方又出现了，通过new mQuery.prototype.init()确实可以返回回来一个实例化对象
// 但是mQuery和mQuery.prototype.init依然是两个不一样的函数，因此
// new mQuery.prototype.init()和new mQuery()得到的是两个完全不同的对象
// new mQuery()得到的对象上才有我们想要的attr css append等方法
// 怎么让new mQuery.prototype.init()对象上也有这些方法呢
// 思考：new mQuery()对象上的attr css append这些方法是定义在mQuery的原型对象，即mQuery.prototype上的
// 也就是说我们通过new mQuery().attr()这样调用的时候是访问的mQuery原型对象上的attr方法
// mQuery.prototype.init也是一个函数，这个函数的prototype属性也指向它的原型对象:mQuery.prototype.init.prototype
// 这个函数的原型对象(mQuery.prototype.init.prototype)上是没有attr css append这些方法的
// 因此，我们可以把mQuery.prototype的引用赋值给mQuery.prototype.init.prototype即可
// 这样new mQuery.prototype.init()实例化对象访问attr方法时去原型mQuery.prototype.init.prototype上找
// 此时mQuery.prototype.init.prototype已经被指向mQuery.prototype了
// mQuery.prototype上有attr方法，因此也就可以访问到了
(function (window) {
    function mQuery() {
        return new mQuery.prototype.init();
    }
    mQuery.prototype.init = function () {

    };
    mQuery.prototype.init.prototype = mQuery.prototype;
    window.mQuery = window.$ = mQuery;
})(window);