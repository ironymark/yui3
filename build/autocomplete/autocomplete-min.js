YUI.add("autocomplete-base",function(E){var G=E.Lang,C=G.isFunction,M=G.isNumber,Q="autocomplete",B="allowBrowserAutocomplete",J="dataSource",F="inputNode",S="minQueryLength",R="query",N="queryDelay",A="requestTemplate",H="resultFilters",D="resultHighlighter",L="valueChange",O=R,I="results",K=L;function P(){P.superclass.constructor.apply(this,arguments);}E.AutoComplete=E.extend(P,E.Base,{initializer:function(U){var T=this.get(F);if(!T){E.error("No input node specified.");}if(T.get("nodeName").toLowerCase()==="input"){T.setAttribute(Q,this.get(B)?"on":"off");}this.publish(O,{defaultFn:this._defQueryFn,queueable:true});this.publish(I,{queueable:true});this.publish(K,{preventable:false});this._events=[T.on(L,E.bind(this._onValueChange,this))];},destructor:function(){while(this._events.length){this._events.pop().detach();}},_parseValue:function(T){return T;},_onResponse:function(Z){var X,U,W,T,Y,V=Z&&Z.response&&Z.response.results;if(V){Y=Z.callback.query;if(Y===this.get(R)){X=this.get(H)||[];U=this.get(D);if(U){X=X.concat([U]);}for(W=0,T=X.length;W<T;++W){V=X[W](Y,V);}this.fire(I,{data:Z.data,query:Y,results:V});}}},_onValueChange:function(Y){var T,U,X=Y.newVal,W=this._parseValue(X),V;this.fire(K,{newVal:X,prevVal:Y.prevVal});if(W.length>=this.get(S)){T=this.get(N);V=this;U=function(){V.fire(O,{inputValue:X,query:W});};if(T){clearTimeout(this._delay);this._delay=setTimeout(U,T);}else{U();}}},_defQueryFn:function(U){var V=this.get(J),T=U.query;this._set(R,T);if(V){V.sendRequest({request:this.get(A)(T),callback:{query:T,success:E.bind(this._onResponse,this)}});}}},{NAME:Q,ATTRS:{allowBrowserAutocomplete:{validator:G.isBoolean,value:false,writeOnce:"initOnly"},dataSource:{validator:function(T){return(T&&C(T.sendRequest))||T===null;}},inputNode:{setter:E.one,writeOnce:"initOnly"},minQueryLength:{validator:M,value:1},query:{readOnly:true,value:null},queryDelay:{validator:function(T){return M(T)&&T>=0;},value:150},requestTemplate:{setter:function(T){if(C(T)){return T;}T=T.toString();return function(U){return T.replace(/(^|[^\\])((\\{2})*)\{query\}/,"$1$2"+encodeURIComponent(U)).replace(/(^|[^\\])((\\{2})*)\\(\{query\})/,"$1$2$4");};},value:encodeURIComponent},resultFilters:{validator:function(T){return G.isArray(T);},value:[]},resultHighlighter:{validator:function(T){return C(T)||T===null;}}}});},"@VERSION@",{requires:["base-base","event-valuechange","node-base"]});YUI.add("autocomplete-plugin",function(B){function A(C){C=B.mix({},C,true);C.inputNode=C.host;A.superclass.constructor.apply(this,arguments);}B.namespace("Plugin").AutoComplete=B.extend(A,B.AutoComplete,{},{NAME:"autocompletePlugin",NS:"ac"});},"@VERSION@",{requires:["autocomplete-base","node-pluginhost"]});YUI.add("autocomplete",function(A){},"@VERSION@",{use:["autocomplete-base","autocomplete-plugin"]});