# MVC-SinglePage
这是我在公司做一个Wap版手机单页面提炼的一个单页面MVC框架
当然电脑端也可以用

##适用场景
对各页面间切换有极高速度要求的应用

##tips
1.建议每一个view直接在view里面写css，可减少http请求  
2.禁止在view里面使用id，避免污染全局

##next
增加一些辅助的function  at  js/common.js

最近发现 history.pushState/history.replaceState 可取代hash的方法,but微信的jsAPI可能有问题，先继续观察一段时间
