function carousel(container, prev, next, screen_size){
  $ = jQuery;
  var rpos = function (n){ return $(n).position().left + $(n).outerWidth(); }

  $(container).each(function(){ // Works only for three or more items
    //$(this).css('width', $(this).width() );
    var LIs = $('>*', this);
    if(!isNaN(screen_size)  && LIs.length < screen_size) return;
    $(this).parents('.block').addClass('t-ygallery');
    var minW = $(this).width();
    var last = $($('>*:last-child', this)[0]);
    var lp0 = last.position().left + last.outerWidth();
    var lp = lp0;
    while(lp < minW*2){
      LIs.each(function(){$(this).clone(true).appendTo($(this).parent() ); })
    lp += lp0;
    }

    var scrl = $(this);
    var animating = false;
    prev.click(function() {
      if (animating) return false;
      $(scrl).stop(true, true);
      //var npos = $('>LI:last-child', scrl).position().left + $('>LI:last-child', scrl).outerWidth() - minW;
      var LIs = $('>*', scrl);
      var fs = 0, i = LIs.length-1;
      var gofirst = [];
      animating  = true;
      while(fs + $(LIs[i]).outerWidth() < minW ){
        fs += $(LIs[i]).outerWidth();
        gofirst.push($(LIs[i]));
        i--;
      }
      $.each(gofirst, function(index, value){value.prependTo(scrl);});
      scrl.scrollLeft(fs);			
      $(scrl).animate({scrollLeft: 0 }, {duration: fs*500/minW,complete:function() {animating = false;}} );
      return false;
    });
    next.click(function() { 
      if (animating) return false;
      $(scrl).stop(true, true);
      var LIs = $('>*', scrl);
      var i=0; for(i=0; rpos(LIs[i]) < minW;i++){}
      var goto = $(LIs[i]).position().left - $(LIs[0]).position().left;
      animating  = true;
      $(scrl).animate({scrollLeft: goto}, {duration: goto*500/minW, complete: function(){
        for(var j=0; j<i;j++){ $(LIs[j]).appendTo(scrl); }
        scrl.scrollLeft(0);
        animating = false;
      }} );
      return false;
    });
  });
}
// Hasta aqui lo nuevo

// Javascript test function
javascript_test = function(){
	console.log('External javascript runing');
	return true;
}
	
// Get a parameter
function gup(name){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// URL Decode & Encode
var Url = {
 
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;

	} 
}



function setCookie(c_name,value,exseconds)
{
	var exdate= new Date((new Date()).getTime() + 1000*exseconds);	
	var c_value=escape(value) + ((exseconds==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
  		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  		x=x.replace(/^\s+|\s+$/g,"");
  		if (x==c_name){
    		return unescape(y);
    	}
  	}
}


function disableClicks(default_disable){
    if((window.location+'').split('?clicks').length==2){
        setCookie('allowclicks','1', 360000);
    }else if((window.location+'').split('?noclicks').length==2){
        setCookie('allowclicks','0', 360000);
    }else if(getCookie('allowclicks') == null){
        setCookie('allowclicks',(typeof default_disable != 'undefined' && default_disable)?'0':'1', 360000);
    }
    //console.log('cosa:' , getCookie('allowclicks'));
    return getCookie('allowclicks') == '0';
}
