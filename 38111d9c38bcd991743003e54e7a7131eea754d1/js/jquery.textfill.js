;(function($){$.fn.textfill=function(options){var defaults={debug:false,maxFontPixels:40,minFontPixels:4,innerTag:'span',widthOnly:false,success:null,fail:null,complete:null,explicitWidth:null,explicitHeight:null,changeLineHeight:false,truncateOnFail:false,allowOverflow:false};var Opts=$.extend(defaults,options);function _debug(){if(!Opts.debug||typeof console=='undefined'||typeof console.debug=='undefined'){return;}
console.debug.apply(console,arguments);}
function _warn(){if(typeof console=='undefined'||typeof console.warn=='undefined'){return;}
console.warn.apply(console,arguments);}
function _debug_sizing(prefix,ourText,maxHeight,maxWidth,minFontPixels,maxFontPixels){function _m(v1,v2){var marker=' / ';if(v1>v2){marker=' > ';}
else if(v1==v2){marker=' = ';}
return marker;}
_debug('[TextFill] '+prefix+' { '+
'font-size: '+ourText.css('font-size')+','+
'Height: '+ourText.height()+'px '+_m(ourText.height(),maxHeight)+maxHeight+'px,'+
'Width: '+ourText.width()+_m(ourText.width(),maxWidth)+maxWidth+','+
'minFontPixels: '+minFontPixels+'px, '+
'maxFontPixels: '+maxFontPixels+'px }');}
function _sizing(prefix,ourText,func,max,maxHeight,maxWidth,minFontPixels,maxFontPixels){_debug_sizing(prefix,ourText,maxHeight,maxWidth,minFontPixels,maxFontPixels);while(minFontPixels<(Math.floor(maxFontPixels)-1)){var fontSize=Math.floor((minFontPixels+maxFontPixels)/2);ourText.css('font-size',fontSize);var curSize=func.call(ourText);if(curSize<=max){minFontPixels=fontSize;if(curSize==max){break;}}
else{maxFontPixels=fontSize;}
_debug_sizing(prefix,ourText,maxHeight,maxWidth,minFontPixels,maxFontPixels);}
ourText.css('font-size',maxFontPixels);if(func.call(ourText)<=max){minFontPixels=maxFontPixels;_debug_sizing(prefix+'* ',ourText,maxHeight,maxWidth,minFontPixels,maxFontPixels);}
return minFontPixels;}
_debug('[TextFill] Start Debug');this.each(function(){var ourText=$(Opts.innerTag+':first',this);_debug('[TextFill] Inner text: '+ourText.text());_debug('[TextFill] All options: ',Opts);_debug('[TextFill] Maximum sizes: { '+
'Height: '+maxHeight+'px, '+
'Width: '+maxWidth+'px'+' }');if(!ourText.is(':visible')){if(Opts.fail)
Opts.fail(this);_debug('[TextFill] Failure { '+
'Current Width: '+ourText.width()+', '+
'Maximum Width: '+maxWidth+', '+
'Current Height: '+ourText.height()+', '+
'Maximum Height: '+maxHeight+' }');return;}
var maxHeight=Opts.explicitHeight||$(this).height();var maxWidth=Opts.explicitWidth||$(this).width();var oldFontSize=ourText.css('font-size');var lineHeight=parseFloat(ourText.css('line-height'))/parseFloat(oldFontSize);var minFontPixels=Opts.minFontPixels;var maxFontPixels=(Opts.maxFontPixels<=0?maxHeight:Opts.maxFontPixels);var fontSizeHeight=undefined;if(Opts.widthOnly){ourText.css('white-space','nowrap');}else{fontSizeHeight=_sizing('Height',ourText,$.fn.height,maxHeight,maxHeight,maxWidth,minFontPixels,maxFontPixels);}
var fontSizeWidth=undefined;fontSizeWidth=_sizing('Width',ourText,$.fn.width,maxWidth,maxHeight,maxWidth,minFontPixels,maxFontPixels);if(Opts.widthOnly){ourText.css({'font-size':fontSizeWidth});if(Opts.changeLineHeight){ourText.parent().css('line-height',(lineHeight*fontSizeWidth+'px'));}}
else{var fontSizeFinal=Math.min(fontSizeHeight,fontSizeWidth);ourText.css('font-size',fontSizeFinal);if(Opts.changeLineHeight){ourText.parent().css('line-height',(lineHeight*fontSizeFinal)+'px');}}
_debug('[TextFill] Finished { '+
'Old font-size: '+oldFontSize+', '+
'New font-size: '+ourText.css('font-size')+' }');if((ourText.width()>maxWidth&&!Opts.allowOverflow)||(ourText.height()>maxHeight&&!Opts.widthOnly&&!Opts.allowOverflow)){ourText.css('font-size',oldFontSize);if(Opts.fail){Opts.fail(this);}
_debug('[TextFill] Failure { '+
'Current Width: '+ourText.width()+', '+
'Maximum Width: '+maxWidth+', '+
'Current Height: '+ourText.height()+', '+
'Maximum Height: '+maxHeight+' }');}
else if(Opts.success){Opts.success(this);}});if(Opts.complete){Opts.complete(this);}
_debug('[TextFill] End Debug');return this;};})(function(){if(typeof module!=='undefined'&&module.exports){return require('jquery');}
return window.jQuery;}());