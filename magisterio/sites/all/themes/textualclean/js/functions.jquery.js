(function ($) {	
	(function() {
		// Remove layerX and layerY
		var all = $.event.props,
			len = all.length,
			res = [];
		while (len--) {
		  var el = all[len];
		  if (el != 'layerX' && el != 'layerY') res.push(el);
		}
		$.event.props = res;
	}());
	
	// jQuery Test
	jquery_test = function(){
		// console.log('External jQuery runing');
		$("body").append('See? It works.');
		return true;
	}
	
	function detach(node){
		$(node).parent()[0].removeChild(node);
		return $(node);
	}

	function rm_white_spaces_ie(node){
		var ns = node.contents().filter(function() { return (node.nodeType != 3 || /\S/.test(node.nodeValue)); });
		var fns = [];
		for(var i=0; i< ns.length; i++){
			var cns = $(ns[i]).contents();
			for(var j=0; j< cns.length; j++)
			   detach(cns[j]);
			var s = $.trim(ns[i].outerHTML);
			$(ns[i]).remove();
			var n = $(s);
			for(var j=0; j< cns.length; j++) if(cns[j]!=null){
				$(cns[j]).appendTo(n);
			}
			fns.push(n);
		}
		node.empty();
		for(var i=0; i< fns.length; i++){
			try{
				fns[i].appendTo(node);
			}catch(e){}
		}
	}
	
	jQuery.fn.cleanWhitespace = function() {	
		if($.browser.msie && parseInt($.browser.version, 10) <= 8 ){
			$(this).each(function(){rm_white_spaces_ie($(this));});
		} else {
			textNodes = this.contents().filter(
				function() {return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
				.remove();
		}		
	}
	
	
	// SIMPLE GALLERY
	jQuery.fn.buildSimpleGallery = function(){
		// // console.log($(this).html());		
			
		// If multiple images on gallery
		if($('.views-row IMG', this).length > 1){			

			var hgprev = $('<a href="#" class="t-hgprev"></a>').appendTo(this);
			var hgnext = $('<a href="#" class="t-hgnext"></a>').appendTo(this);			
			
			// Add control gallery
			$('<div class="t-control-gallery"></div>').appendTo(this);			
			
			// Add pager control			
			$('<ul class="t-hgpicker"></ul>').appendTo($('.t-control-gallery', this));
			
			// Add behavior to each html button on click
			 $('.t-hgpicker .t-div').click(function(){								
				return false; 
			});		
			 
			// Click on prev button
			$('.t-hgprev', this).click(function(){						
				return false;
			});
			
			// Click on next button
			$('.t-hgnext', this).click(function(){						
				return false;
			});							
		}	
	}		
})(jQuery);

function galeria_int(contexto, cosamovil,menu,indice,btnizq,btnder,elem,tanim,tauto,numerado) {
  var $ = jQuery;
  var t_gal_ocupado = false;
  var t_contexto = (contexto!=null && contexto!=undefined)?$(contexto):undefined;
  var t_galeria = $(cosamovil,t_contexto);
  var t_gal_contador = 0;
  //console.log(t_contexto, t_galeria);
  var t_gal_max = $(elem,t_galeria).length;
  var primero = $(elem,t_galeria).slice(0,1);
  primero.clone().appendTo(primero.parent());
  if (menu!=undefined && menu!=null) {
    var t_menu = $(menu,t_contexto);
    for (var i=0;i<t_gal_max;i++) {
      var conte = '';
      var clases = indice + " " + indice + "-" + (i+1);
      if (numerado) conte = i+1;
      t_menu.append('<div class="'+clases+'">'+conte+'</div>');
    }
    $('.'+indice,t_menu).click(function() {
      //if (t_gal_ocupado) return false;
      t_gal_contador = $('.'+indice,t_menu).index(this);
      t_galh_update(t_gal_contador);
      return false;
    });
  }
  t_galeria.scrollLeft(0);
  function t_galh_update() {
    var original = t_gal_contador;
    if (original==-1)
      t_galeria.scrollLeft(t_galeria.width()*t_gal_max);
    t_gal_contador = (t_gal_max+t_gal_contador)%t_gal_max;
    t_gal_ocupado = true;
    var newScroll = t_galeria.width()*(original==t_gal_max?t_gal_max:t_gal_contador);
    var diff = Math.abs(newScroll-t_galeria.scrollLeft());
    t_galeria.stop().animate({scrollLeft: newScroll} , parseInt(tanim*diff/1000), function(){
      t_gal_ocupado = false;
      if (original==t_gal_max)
      t_galeria.scrollLeft(t_galeria.width()*0);
    });
    $('.'+indice,t_menu).removeClass(indice+'_act');
    $('.'+indice,t_menu).slice(t_gal_contador,t_gal_contador+1).addClass(indice+'_act');
    if (t_contexto!=undefined) {
      t_contexto.removeClass('t-gal-last').removeClass('t-gal-first');
      if (t_gal_contador==0) t_contexto.addClass('t-gal-first');
      if (t_gal_contador==t_gal_max-1) t_contexto.addClass('t-gal-last');
    }
  }
  function t_galh_cambio(delta) {
    if (t_gal_ocupado) return false;
    t_gal_contador = t_gal_contador+delta;
    t_galh_update();
    return false;
  }
  if (btnder!=null) $(btnder,t_contexto).click(function(){t_galh_cambio(+1);});
  if (btnizq!=null) $(btnizq,t_contexto).click(function(){t_galh_cambio(-1);});
  if (tauto!=null && tauto!=undefined) {
    function autonexthome(){
      t_galh_cambio(+1);
      window.setTimeout(autonexthome,tauto);
    }
    window.setTimeout(autonexthome, 3000);
  }
  t_galh_update();
}

function galeria(cosamovil,elem,opciones) {
  var btnizq = ('btnizq' in opciones)?opciones.btnizq:null;
  var btnder = ('btnder' in opciones)?opciones.btnder:null;
  var tanim = ('tanim' in opciones)?opciones.tanim:1000;
  var tauto = ('tauto' in opciones)?opciones.tauto:null;
  var menu = ('menu' in opciones)?opciones.menu:'.t_gal_menu';
  var indice = ('indice' in opciones)?opciones.indice:'t_gal_ind';
  var context = ('context' in opciones)?opciones.context:null;
  var numerado = ('numerado' in opciones)?opciones.numerado:false;
  galeria_int(context, cosamovil,menu,indice,btnizq,btnder,elem,tanim,tauto,numerado);
}

jQuery.fn.overlapped = function() {
  var $ = jQuery;
  $(this).each(function() {
    var label = $(this);
    var ninput = $(this).attr('for');
    var input = $('#'+ninput);
    input.focus(function(){label.hide();});
    input.blur(function(){if (input.val()=="") label.show();});
    if(input.val()!="") label.hide();
  });
  return this;
}
