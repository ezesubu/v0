(function($){ 

  closureInlineScript = function(){
    $('<span></span>').appendTo('.block-menu > h2');
    $('#block-uc-cart-cart > *').wrapAll($('.cart-block-view-cart a').clone().html(''));
    $('.block-views.contextual-links-region, .block-nodeblock.contextual-links-region').each(function(){
      if(!$('>h2', this).length){
        $(this).addClass('t-contextualborder');
      }
    });
    $('.view-display-id-productsuggestions').parents('.block-views').addClass('t-color-1');
    $('.view-display-id-commingevents').parents('.block-views').addClass('t-color-2');
    $('.block-webform label').overlapped();
  }


  
  $(function(){
    $('.t-carrousel').each(function(){
      var prev = $('<span class="t-prev"></span>').appendTo(this);
      var next = $('<span class="t-next"></span>').appendTo(this);
      carousel($('.view-content',this), prev, next, 2);
    });

  }); 

  $(function(){    
        $(".li_editorial").mouseover(function() {
            $( this ).parent().find( ".menu" ).css( "z-index", "10" );
            console.log
        }).mouseout(function() {
            $( this ).find( ".menu" ).css( "z-index", "0" );
        })
         $(".li_libreria").mouseover(function() {
            $( this ).parent().find( ".menu" ).css( "z-index", "10" );
            console.log
        }).mouseout(function() {
            $( this ).find( ".menu" ).css( "z-index", "0" );
        }) 
        $(".li_revista").mouseover(function() {
            $( this ).parent().find( ".menu" ).css( "z-index", "10" );
            console.log
        }).mouseout(function() {
            $( this ).find( ".menu" ).css( "z-index", "0" );
        })
        $(".li_formacion").mouseover(function() {
            $( this ).parent().find( ".menu" ).css( "z-index", "10" );
            console.log
        }).mouseout(function() {
            $( this ).find( ".menu" ).css( "z-index", "0" );
        })

        // menu_active = $('#block-system-main-menu').find('.active').parent();
        // menu_active.find(".menu").css('display','block');
        if($('#block-system-main-menu').find('.active').length !== 9){  
             menu_active = $('#block-system-main-menu').find('.active').parent();
             menu_active.find(".menu").css('display','block');
            $('#block-system-main-menu').css("height","60");
          }
        $( ".li_editorial" ).parent().find( "ul" ).css( "background-color", "#0070ba" );        
        var libreria= $( ".li_libreria" ).parent().find( "ul" );
        var revista= $( ".li_revista" ).parent().find( "ul" ); 
        var formacion= $( ".li_formacion" ).parent().find( "ul" ); 
        libreria.css( "background-color", "#ed1941");
        libreria.css("left", "0px");
        revista.css("background-color", "#6f9a34")
        revista.css("left", "0px");
        formacion.css("background-color", "#f68b1f")
        formacion.css("left", "0px");
        // $( ".li_libreria" ).parent().find( ".ul" ).css(  "margin", "100px" );    
     });
  
})(jQuery);


