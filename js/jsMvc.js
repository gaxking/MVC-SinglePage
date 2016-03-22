; (function (w, d)
{   
    var _viewElement = null, 
        _viewRoute = null,
        _viewElementBox = null,
        _callback = null,
        _defaultRoute = null,
        _history = [],
        _routeMap = {};


    var jsMvc = function () {
        //添加路由
        this.AddRoute = function (route, controller) {
            _routeMap[route] = new routeObj(route, controller);

            //设置第一个为默认路由
            if(!_defaultRoute){
                _defaultRoute = _routeMap[route];
            }
        };

        this.Initialize = function (id, callback) {
            //装载更新部分的元素
            _viewElementBox = document.getElementById(id); 
            if (!_viewElementBox){
                return;
            }

            //每次回调都会触发的函数
            _callback = callback;

            //触发hash变化调用ajax
            w.onhashchange = toggleView.bind(this);
            toggleView();
        };

    };

    function loadTemplate() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    _viewElement.innerHTML = xmlhttp.responseText;

                    setAnimate(true);
                }
        };

        var url =  _viewRoute.route;
        url += _viewRoute.parm.length ? '/' +  _viewRoute.parm.join('/') : '';

        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }

    var routeObj = function (r, c, p) {
        this.route = r;
        this.controller = c;
        this.parm = p;
    };


    function toggleView()
    {
        var pageHash = w.location.hash.replace('#', ''),
            routeName = null,
            parm = null;
        
        //获取参数，和路由标记
        parm = pageHash.split('/');
        routeName = parm.shift(); 

        if (!routeName){
            _viewRoute = _defaultRoute;
        }else{
            _viewRoute = _routeMap[routeName];
        }
        
        _viewRoute.parm = parm;

        //加入历史队列
        _history.push(new routeObj(_viewRoute.route, _viewRoute.controller, _viewRoute.parm));

        _viewElement = d.querySelector('#view-' + _viewRoute.route);
    
        //创建新的view
        if (!_viewElement){
            var view = document.createElement('div');

            view.className = 'view';
            view.id = 'view-'+_viewRoute.route;

            if(parm.length !== 0){
                view.setAttribute('data-parm', parm.join('/'));
            }

            _viewElementBox.appendChild(view);
            _viewElement = view;
            _viewElement.style.visibility = 'hidden';

            loadTemplate();
		}else{
			setAnimate(false);
		}
    }

    //这里可以设置切换动画，由于android很卡的关系，目前直接display～
    function setAnimate(isFirst){
        var active = d.querySelector('.view.active');
        if(active){
            active.classList.remove('active');
        }

        _viewElement.classList.add('active');
        _viewElement.style.visibility = null;

        var callobj = {
            isFirst:isFirst,
            routeInfo:_viewRoute,
            preRouteInfo: _history.length > 1?_history[_history.length-2]:undefined
        };

        //
        _callback(callobj);
    }

    w.jsMvc = new jsMvc();
})(window, document);
