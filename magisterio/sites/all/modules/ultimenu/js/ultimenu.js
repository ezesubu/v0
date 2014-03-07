/**
 * @file
 * A JavaScript file for the Ultimenu.
 */
(function ($, Drupal, window, document) {
  "use strict";

  Drupal.behaviors.ultimenu = {
    attach: function (context) {
      // Allow highlighting of menu list after hover plus IE helper.
      // The rule for CSS3 animation: Never hide and show!
      $('.ultimenu > li').hover(function () {
        $(this).addClass('hover');
      },
      function() {
        $(this).removeClass('hover');
      });

      // This class targets all IE. Omega 4 supports this by default.
      if ($.browser.msie && !$('html').hasClass('ie')) {
        $('html').addClass('ie');
      }
    }
  };

})(jQuery, Drupal, this, this.document);
