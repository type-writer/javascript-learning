//可以用数字作为索引
var person = [];
person[0] = "John";
person[1] = "Doe";
person[2] = 46;
var x = person.length;
var y = person[0];
console.log("数组长度：" + x + "; 第一个人是：" + y);

//用名字作为索引之后
//数组会被重新定义为标准的对象
//数组的属性和方法都不能再使用，否则会产生错误
//比如下面的变量y被赋值为undefined
var profile = [];
profile["firstName"] = "Jeson";
profile["lastName"] = "Born";
profile["age"] = 43;
var x = profile.length;
var y = profile[0];
console.log(y + "的年龄：" + x);