; (function (w, d, undefined)
{   
    var _viewElement = null, //element that will be used to render the view    
        _viewElementBox = null,
        _callback = null,
        _defaultRoute = null,
        _history = [],
        _routeDic = {};


    var jsMvc = function () {
        //mapping object for the routes
        this._routeMap = {};
    };

    jsMvc.prototype.AddRoute = function (controller, route, parm) {
        var url = GLOBAL.baseUrl+route;
		if(parm){
			url += '?'+parm;
		}

        this._routeMap[route] = new routeObj(controller, route, url);
        
        if(!_defaultRoute){
            _defaultRoute = this._routeMap[route];
        }
    };
    //Initialize the Mvc manager object to start functioning
    jsMvc.prototype.Initialize = function (callback) {
        var startMvcDelegate = startMvc.bind(this);

        _viewElementBox = d.querySelector('#view-box'); //get the html element that will be used to render the view        
        if (!_viewElementBox){
            return;
        }

        if(callback)_callback = callback;

        //start the Mvc manager
        w.onhashchange = startMvcDelegate;
        startMvcDelegate();
        /*
        d.addEventListener('webkitTransitionEnd',function(e){            
            var classList = e.target.classList;
            if(classList.contains('outcut')&&classList.contains('active')){
                classList.remove('active');
                classList.remove('outcut');
                bindInput('input,select');
            }
 
            if(classList.contains('view')){
                e.target.style.webkitTransform = null;
                e.target.style.webkitTransition = null;
                e.target.style.zIndex = null;
                e.target.parentElement.classList.remove('overflow');
                isTouchHash = false;

                var nowBox = e.target.querySelector('.now-box');
                if(nowBox){
                    nowBox.style.top = null;
                    nowBox.style.position = null;
                }

                var indexBox = e.target.querySelector('.btn-index');
                if(indexBox){
                    indexBox.style.top = null;
                    indexBox.style.position = null;
                }

            }
        });*/
        //this.Start();
    };

    //Start the Mvc manager object to start functioning
    jsMvc.prototype.Start = function () {
        var startMvcDelegate = startMvc.bind(this);
        startMvcDelegate();
        w.onhashchange = startMvcDelegate;
    };

    //Function to load external html data
    function loadTemplate(routeObject, view , pageHash, callfun) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {
                    loadView(routeObject, view, xmlhttp.responseText , callfun);
                }
            };


            xmlhttp.open('GET', routeObject.template, true);
            xmlhttp.send();
    }

    //Function to load the view with the template
    function loadView(routeObject, viewElement, viewHtml, callfun) {
        var model = {};        
        viewHtml = replaceToken(viewHtml, model); //bind the model with the view
        
        viewElement.innerHTML = viewHtml+viewElement.innerHTML; //load the view into the view element

       // routeObject.controller(model,routeObject.arg); //get the resultant model from the controller of the current route

       if(_callback){
		   setAnimate(routeObject,true);
	   }
    }

    function replaceToken(viewHtml, model) {
        var modelProps = Object.getOwnPropertyNames(model);
            
        modelProps.forEach(function (element, index, array)
        {
            if(model[element] instanceof Array){
            }else{
                viewHtml = viewHtml.replace('{{' + element + '}}', model[element]);
            }
        });

        //templateEngine(model);

        return viewHtml;
    }
/*
    function templateEngine(model){
        if(model instanceof Object){
            var modelProps = Object.getOwnPropertyNames(model);
                
            modelProps.forEach(function (element, index, array)
            {
                if(model[element] instanceof Array || model[element] instanceof Object){
                    templateEngine(model[element],element);
                }else if(model[element] instanceof String){
                    viewHtml = viewHtml.replace('{{' + element + '}}', model[element]);
                }
            });
        }else if(model instanceof Array){
            for(var x in model){
               if(model[x] instanceof Array || model[x] instanceof Object){
                    var prevStr = '[][]';
                    templateEngine(model[x]);
                }else if(model[x] instanceof String){
                    viewHtml = viewHtml.replace('{{' + element + '}}', model[element]);
                }
            }
        }
    }
*/
    var routeObj = function (c, r, t) {
        this.controller = c;
        this.route = r;
        this.template = t;
        this.arg = null;
    };

    //attach the mvc object to the window
    w.jsMvc = new jsMvc();

    //function to start the mvc support
    function startMvc()
    {
        var pageHash = w.location.hash.replace('#', ''),
            routeName = null,
            arg = null,
            routeObj = null;                
        
        routeName = pageHash.replace('/', ''); //get the name of the route from the hash     
        arg = routeName.split('-');
        var firstArg = arg.shift();

        if (!firstArg){
            routeObj = _defaultRoute;
        }else{
            routeObj = this._routeMap[firstArg]; //get the route object        
        }
        
        routeObj.arg = arg;
        _history.push(routeObj);


        _viewElement = d.querySelector('#view-'+routeObj.route); //get the html element that will be used to render the view        

        
        this.routeState = routeObj;
        if (!_viewElement){
            var view = document.createElement('div');

            view.className = 'view';
            view.id = 'view-'+routeObj.route;

            _viewElementBox.appendChild(view);

            _viewElement = view;


            loadTemplate(routeObj, _viewElement, pageHash); //fetch and set the view of the route
		}else{
			setAnimate(routeObj,false);
		}
    }

    function setAnimate(routeObj,isFirst){
        var active = d.querySelector('.view.active');
        if(active){
            active.classList.remove('active');
        }

        _viewElement.classList.add('active');
		_viewElement.style.visibility = 'hidden';

       var callobj = {
                        route:routeObj.route,
                        history:_history.length > 1?_history[_history.length-2]:undefined,
                        isFirst:isFirst,
                        obj:routeObj,
                      };
        if(_callback)_callback(callobj);
    }
})(window, document);
