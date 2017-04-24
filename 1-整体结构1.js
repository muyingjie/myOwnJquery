/**
 * Created by yj on 2017/4/24.
 */
// 在封装库和框架之前先思考一个问题：为什么要封装库或者框架？
// 答案很简单，就是因为浏览器提供的API不太好用，因此我们封装框架的本质就是在原生API的基础上自己创建一系列操作模型
// 例如：浏览器提供了DOM操作的很多API，比如获取DOM元素、对DOM元素进行增删改查等等
// 我们封装了库之后必然也少不了这些操作，因此我们封装库实际上就是自己建立一套DOM操作模型，开辟出更加人性化的接口去进行DOM操作
// 以此类推，当我们发现浏览器提供的另外一些API不太好用时，就会封装其他模块，比如事件模块 动画模块 选择器模块 数据缓存模块 样式操作模块 数据交互模块等等

// 注意：我们在这里写的框架并不是分析jQuery的源码，而是借鉴jQuery的做法，最重要的是自己思考如何实现

// 大概思路：
// 1、对于框架或库而言，不可避免的会污染全局变量，我们要做到尽可能少的污染全局变量，因此在这里我们用匿名函数自执行的方式包裹，只往全局扩展一个变量：$，再将这个变量初始化为对象，剩下的功能都往这个对象上扩展，在外部通过$.xxx或$().xxx这种方式访问，在内部我们使用mQuery这个变量作为构造函数，静态方法和实例化方法都扩展到它身上，最后将它赋给$，这样外界就可以访问到我们库里面定义的各个方法了
// 2、平时使用jQuery的时候直接用$(xxx)，$实际上就是一个函数，即每次$(xxx)一下实际上就是调用了一下$函数，也就是调用了一下mQuery函数

// 在jQuery中为$(".div1")传递这样的字符串参数返回了一个对象，这个对象下有很多方法，很容易想到用面向对象来实现
// 首先对传入的参数进行处理，根据参数类型的不同做不同的处理，自然会分析传入的参数类型都有哪些，那么怎么分析呢？
// 我们可以从js数据类型入手，js有6中数据类型：undefind null boolean number string object
// 1、undefind null boolean number没什么好处理的
// 2、object类型之function: 异步处理，等页面加载完成再执行该函数，暂时不考虑链式调用的问题，即不考虑返回值的问题，因为涉及到了异步框架，很复杂
// 3、object类型之domObj: 包装一下，变成jQuery对象 注意这里并不处理getElementsByTagName等生成的类数组对象，可以自己考虑一下为什么
// 4、object类型之jqueryObj: 直接返回该jQuery对象
// 5、string类型之"<div>": 创建元素
// 6、string类型之"<div class='aaa'>": 创建复杂元素
// 7、string类型之"<div class='aaa'><span class='txt'>ttt</span></div>": 创建嵌套元素
// 8、string类型之"#div1": 根据id获取元素
// 9、string类型之".div1 .txt": 其他方式获取元素
// 可以看到从第3种往后都是对DOM对象的操作，因此我们需要把所有的这些情况都做统一抽象，创建一个类，该类实例化之后就是我们自己抽象出来的一个DOM模型，然后我们就可以在该模型上扩展attr css click append等方法来实现原生API需要很多代码才能实现的功能

// 再思考：
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
