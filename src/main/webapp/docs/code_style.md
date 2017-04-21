# 代码规范

### 文件命名

* HTML文件   
`index.html` `goods_info.html`

* CSS文件   
`index.css` `goods_info.css`

* JS文件   
`index.js` `goods_info.js`

### HTML

* 嵌套的节点应该缩进
* 在属性上，使用双引号，不要使用单引号
* 标签ID驼峰式命名
* 类名全小写，用中划线做分隔符     
 
```
<!DOCTYPE html>
<html>
    <head>
        <title>Page title</title>
    </head>
    <body>
        <h1 id="mianHeader" class="hello-world">Hello, world!</h1>
    </body>
</html>
```

### CSS

* 每个属性声明末尾都要加分号
* 尽量少用'*'选择器
* 注释统一用'/**/'
* 颜色16进制用小写字母,且尽量简写；

```
/*
 * 这里是注释
 */
.declaration-order {
    display: block;
    float: right;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;

    border: 1px solid #e5e5e5;
    border-radius: 3px;
    width: 100px;
    height: 100px;

    font: normal 13px "Helvetica Neue", sans-serif;
    line-height: 1.5;
    text-align: center;

    color: #333;
    background-color: #f5f5f5;

    opacity: 1;
}
```

### JavaScript

* 分号不可省略,如变量声明 表达式 return break
* 单行注释 使用// 双斜线后，必须跟一个空格
* 多行注释

```
/* 
 * 这里是注释
 */
```

* 最外层统一使用单引号   

```
var y = 'foo',
    z = '<div id="test"></div>';
```

* 变量采用驼峰式命名  
`var mainData = [];`

* 函数采用驼峰式命名    

```
function doSomething() {
    console.log('test');
}
```

* 常量全大写, 用下划线连接   
`var MAX_COUNT = 0;`

* 一个函数作用域中所有的变量声明尽量提到函数首部，用一个var声明，不允许出现两个连续的var声明

```
function doSomethingWithItems(items) {
    // use one var
    var value = 10,
        result = value + 10,
        i,
        len;

    for (i = 0, len = items.length; i < len; i++) {
        result += 10;
    }
}
```

* 对象属性名不需要加引号,数组、对象最后不要有逗号

```
var a = {
    b: 1,
    c: 2
};
```


### 初始化HTML

```
<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="description" content="">
        <title>膳品</title>   
        
        <link rel="icon" href="img/apple-touch-icon.png">   
        
        <link rel="stylesheet" href="css/default.css">
    </head>
    <body>   
    
        <p>Hello world!</p>   
        
        <script src="js/vendor/jquery-3.1.1.js"></script>
        <script src="js/default.js"></script>
        <script>
            function pageInit() {
                console.log('Hello world!');
            }
        </script>
    </body>
</html>


------------- 2017.03.16 by xx ----------------

* 新增或修改default.js 或 其他公用类(方法) 内的方法或参数等内容必须写注释
* 注释内容必须包含方法用途,参数用途
* 核心代码及复杂业务逻辑的代码在关键处必须写注释
...
/**
 * 这里是注释示例
 * 方法用途
 * @param type1:参数1用途
 * @param type2:参数2用途
 */
function func1(type1, type2) {
    //业务实现
}
...


* 调用异步接口返回参数使用result(数据返回常用data,避免使用data与之重复混淆), 数据定义使用params
* 所有返回的result必须校验ans, 预防后期default.js方法修改
* result首层数据使用'.',即result.data || result.ans ...
* 内层使用[],即result.data['...']
...
<script>
    var params = [];
    params['action'] = 'this is a action';
    params[''] = ...;
    epm.ajax(params, function(result){
        if ('ok' == result.ans) {
            /*
            * 业务实现
            */
        }
    })
</script>
...

* 参数定义
* !!!!!!!!!!!!!!!!!!! 非特殊情况,不允许在循环体内定义参数  !!!!!!!!!!!!!!!!!!
* !!!!!!!!!!!!!!!!!!! 非特殊情况,不允许在循环体内定义参数  !!!!!!!!!!!!!!!!!!
* !!!!!!!!!!!!!!!!!!! 非特殊情况,不允许在循环体内定义参数  !!!!!!!!!!!!!!!!!!
...
<script>
//正确写法
var list = [];
var parameter1,
    parameter2;
$.each(list, function(key, value) {
    parameter1 = value['parameter1'];
    parameter2 = value['parameter2'];
})

//错误写法
var list = [];
$.each(list, function(key, value) {
    var parameter1 = value['parameter1'];
    var parameter2 = value['parameter2'];
})
</script>
...


* 方法内返回参数的定义为ret, 一个入口一个出口
...
<script>
    function func1(parameter) {
        //返回参数定义
        var ret;

        switch(parameter) {
            case 1:
                ret = 1;
                break;
            case 2:
                ret = 2;
                break;
        }
        //或
        if (parameter == 1) {
            ret = 1;
        } else if (parameter == 2) {
            ret = 2;
        }

        //返回内容
        return ret;
    }
</script>
...

* 不允许在重复调用的方法中动态定义事件方法(如以下情况)
* 避免事件方法被重复绑定重复执行
...
<html>
    <head>...<head>
    <body>
        <input id='button1' type='button' value='this is a button1' onclick='clickFunc()' />
        <input id='button2' type='button' value='this is a button2' />
    </body>
<html>
<script>
    function clickFunc() {
        //button1业务实现begin
        ....
        //button1业务实现end

        $('#button2').on('click', function(){
            //button2业务实现begin
            ....
            //button2业务实现end
        })
    }
</script>
...

* 不实现跳转的a标签使用javascript:void(0),不使用'#'或''
...
<a href='javascript:void(0)'>跳转</a>
...


* 需要修改default.css中的样式时,尽量新增class重新定义css样式
* 避免影响其他页面的效果展示
...
...


* 不允许使用关键字定义为参数名或方法名,如下
* length, width, size等