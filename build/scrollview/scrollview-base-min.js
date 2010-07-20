YUI.add("scrollview-base",function(A){var F=A.ClassNameManager.getClassName,O="scrollview",N={scrollbar:F(O,"scrollbar"),vertical:F(O,"vertical"),horizontal:F(O,"horizontal"),child:F(O,"child"),top:F(O,"top"),bottom:F(O,"bottom"),middle:F(O,"middle"),showing:F(O,"showing")},B="scrollStart",C="scrollChange",R="scrollEnd",H="flick",G="ui",J="scrollY",K="scrollX",D="bounce",M="x",L="y",P="boundingBox",I="contentBox",E=A.TransitionNative.supported;A.Node.DOM_EVENTS.DOMSubtreeModified=true;function Q(){Q.superclass.constructor.apply(this,arguments);}A.ScrollView=A.extend(Q,A.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(B);this.publish(C);this.publish(R);this.publish(H);},_uiSizeCB:function(){},_transitionEnded:function(){this.fire(R);},bindUI:function(){this.get(P).on("gesturemovestart",A.bind(this._onGestureMoveStart,this));var S=this.get(I);S.on("transitionend",A.bind(this._transitionEnded,this),false);if(E){S.on("DOMSubtreeModified",A.bind(this._uiDimensionsChange,this));}S.on("flick",A.bind(this._flick,this),{minDistance:0});this.after({"scrollYChange":this._afterScrollYChange,"scrollXChange":this._afterScrollXChange,"heightChange":this._afterHeightChange,"widthChange":this._afterWidthChange,"renderedChange":function(){A.later(0,this,"_uiDimensionsChange");}});},syncUI:function(){this.scrollTo(this.get(K),this.get(J));},scrollTo:function(T,Z,V,Y){var S=this.get(I),U=T*-1,X=Z*-1,W;V=V||0;Y=Y||Q.EASING;if(T!==this.get(K)){this.set(K,T,{src:G});}if(Z!==this.get(J)){this.set(J,Z,{src:G});}W={easing:Y,duration:V/1000};if(E){W.transform="translate("+U+"px,"+X+"px)";}else{W.left=U+"px";W.top=X+"px";}S.transition(W);},_onGestureMoveStart:function(S){this._killTimer();var T=this.get(P);this._moveEvt=T.on("gesturemove",A.bind(this._onGestureMove,this));this._moveEndEvt=T.on("gesturemoveend",A.bind(this._onGestureMoveEnd,this));this._moveStartY=S.clientY+this.get(J);this._moveStartX=S.clientX+this.get(K);this._moveStartTime=(new Date()).getTime();this._moveStartClientY=S.clientY;this._moveStartClientX=S.clientX;this._isDragging=false;this._snapToEdge=false;},_onGestureMove:function(S){this._isDragging=true;this._moveEndClientY=S.clientY;this._moveEndClientX=S.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set(J,-(S.clientY-this._moveStartY));}if(this._scrollsHorizontal){this.set(K,-(S.clientX-this._moveStartX));}},_onGestureMoveEnd:function(X){var Z=this._minScrollY,V=this._maxScrollY,S=this._minScrollX,W=this._maxScrollX,U=this._scrollsVertical?this._moveStartClientY:this._moveStartClientX,T=this._scrollsVertical?this._moveEndClientY:this._moveEndClientX,Y=U-T;this._moveEvt.detach();this._moveEndEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(Y)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=Y>0;}if(this._scrollsVertical&&Math.abs(Y)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=Y>0;}if(this._scrollsVertical&&this.get(J)<Z){this._snapToEdge=true;this.set(J,Z);}if(this._scrollsHorizontal&&this.get(K)<S){this._snapToEdge=true;this.set(K,S);}if(this.get(J)>V){this._snapToEdge=true;this.set(J,V);}if(this.get(K)>W){this._snapToEdge=true;this.set(K,W);}if(this._snapToEdge){return;}if(+(new Date())-this._moveStartTime>100){this.fire(R,{staleScroll:true});return;}},_afterScrollYChange:function(S){if(S.src!==G){this._uiScrollY(S.newVal,S.duration,S.easing);}},_uiScrollY:function(T,S,U){S=S||this._snapToEdge?400:0;U=U||this._snapToEdge?Q.SNAP_EASING:null;this.scrollTo(this.get(K),T,S,U);},_afterScrollXChange:function(S){if(S.src!==G){this._uiScrollX(S.newVal,S.duration,S.easing);}},_uiScrollX:function(T,S,U){S=S||this._snapToEdge?400:0;U=U||this._snapToEdge?Q.SNAP_EASING:null;this.scrollTo(T,this.get(J),S,U);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var W=this.get(P),S=this.get("height"),V=this.get("width"),U=W.get("scrollHeight"),T=W.get("scrollWidth");if(S&&U>S){this._scrollsVertical=true;this._maxScrollY=U-S;this._minScrollY=0;this._scrollHeight=U;W.addClass(F("scroll-v"));}if(V&&T>V){this._scrollsHorizontal=true;this._maxScrollX=T-V;this._minScrollX=0;this._scrollWidth=T;W.addClass(this.getClassName("scroll-h"));}},_flick:function(T){var S=T.flick;this._currentVelocity=S.velocity*S.direction;this._flicking=true;this._flickFrame();this.fire(H);},_flickFrame:function(){var W=this.get(J),U=this._maxScrollY,Y=this._minScrollY,X=this.get(K),V=this._maxScrollX,S=this._minScrollX,T=Q.FRAME_STEP;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){W=this.get(J)-(this._currentVelocity*T);}if(this._scrollsHorizontal){X=this.get(K)-(this._currentVelocity*T);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(W<Y){this._snapToEdge=true;this.set(J,Y);}else{if(W>U){this._snapToEdge=true;this.set(J,U);}}}if(this._scrollsHorizontal){if(X<S){this._snapToEdge=true;this.set(K,S);}else{if(X>V){this._snapToEdge=true;this.set(K,V);}}}return;}if(this._scrollsVertical&&(W<Y||W>U)){this._exceededYBoundary=true;this._currentVelocity*=this.get(D);}if(this._scrollsHorizontal&&(X<S||X>V)){this._exceededXBoundary=true;this._currentVelocity*=this.get(D);}if(this._scrollsVertical){this.set(J,W);}if(this._scrollsHorizontal){this.set(K,X);}this._flickTimer=A.later(Q.FRAME_STEP,this,"_flickFrame");},_killTimer:function(S){if(this._flickTimer){this._flickTimer.cancel();}if(S){this.fire(R);}},_setScroll:function(Y,X){var U=this.get(D),T=Q.BOUNCE_RANGE,W=(X==M)?this._maxScrollX:this._maxScrollY,V=U?-T:0,S=U?W+T:W;if(!U||!this._isDragging){if(Y<V){Y=V;}else{if(Y>S){Y=S;}}}return Y;},_setScrollX:function(S){return this._setScroll(S,M);},_setScrollY:function(S){return this._setScroll(S,L);
}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7}},CLASS_NAMES:N,UI_SRC:G,BOUNCE_RANGE:150,FRAME_STEP:10,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out"});},"@VERSION@",{skinnable:true,requires:["widget","event-gestures","transition"]});