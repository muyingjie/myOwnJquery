/**
 * Created by yj on 2017/4/24.
 */
// 上次代码的问题：
// 由于window.mQuery = window.$ = mQuery;的原因，诸如$(xxx)这样的调用实际上就是调用了匿名函数自执行里面定义的mQuery了
// 但是这样调用是调不到attr css等方法的
// $()只是普通的函数调用，普通的函数调用返回值如果没有指定的话返回的是undefined

// 只有通过new调用才会返回对象：
// var $obj = new $();
// 这样一来就可以访问attr css等方法了
// $obj.attr();

// 但是不能链式调用
// 原因：js编译器遇到xxx.yyy()的时候就会将xxx当做是一个对象，然后尝试调用xxx对象的yyy方法
// 思考：$obj.attr也可以看成一个函数，那么在此处$obj.attr()这样调用的话我们并没有用new修饰$obj.attr，因此函数如果没有指定返回值，则返回undefined
// 如果我们想要链式调用的话，这里的$obj.attr();返回的必须是一个对象，而且必须是mQuery类实例化的对象才可以
// 而只要是通过$obj.attr()来调用，this在这里指向的就是mQuery的实例化对象，因此只需要在$obj.attr里面返回this就可以
// mQuery.prototype.attr = function () {
//     return this;
// };
// 但是这种方式也有一个缺点，那就是每个方法中必须要手动写上return this;而且由于把this return回去了，再想return回去别的值就不方便了
// 再者，jQuery在使用的时候根本没有通过new这一步，但依然可以直接调用attr实例化方法，换句话说，当我们使用jQuery执行$(xxx)的时候其实就已经返回来了一个jQuery实例化对象了，那么jQuery是如何做到不通过new还能返回一个实例化对象呢？
// 可能会有人想到，这还不简单，直接return new mQuery()不就完事了，这样肯定不可以，因为形成死递归了：
// (function (window) {
//     function mQuery() {
//         return new mQuery();
//     }
//     window.mQuery = window.$ = mQuery;
// })(window);

// 注意：刚才是因为return的时候依然是调用本函数，因此造成死递归
// 如果return回去的时候不调用本函数不就可以了吗，例如调用mQuery的一个成员函数init
// (function (window) {
//     function mQuery() {
//         return new mQuery.prototype.init();
//     }
//     mQuery.prototype.init = function () {
//
//     };
//     window.mQuery = window.$ = mQuery;
// })(window);

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
// 最终代码：
(function (window) {
    function mQuery() {
        return new mQuery.prototype.init();
    }
    mQuery.prototype.init = function () {

    };
    mQuery.prototype.init.prototype = mQuery.prototype;
    window.mQuery = window.$ = mQuery;
})(window);