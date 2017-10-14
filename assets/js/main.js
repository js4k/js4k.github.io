(function($, undefined) {
    $.extend({
        toUTF8     : function(text) {
            text = text.replace(/\r\n/g,"\n");

            var output = [];

            for (var n = 0 ; n < text.length ; n++) {
                var c = text.charCodeAt(n);

                if (c < 128) {
                    output.push(String.fromCharCode(c));
                } else if ((c > 127) && (c < 2048)) {
                    output.push(String.fromCharCode((c >> 6) | 192));
                    output.push(String.fromCharCode((c & 63) | 128));
                } else {
                    output.push(String.fromCharCode((c >> 12) | 224));
                    output.push(String.fromCharCode(((c >> 6) & 63) | 128));
                    output.push(String.fromCharCode((c & 63) | 128));
                }
            }

            return output.join('');
        },
        fromUTF8   : function(text) {
            var output = [],
                i = c = c1 = c2 = 0;

            while (i < text.length) {
                c = text.charCodeAt(i);

                if (c < 128) {
                    output.push(String.fromCharCode(c));
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = text.charCodeAt(i + 1);
                    output.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63)));
                    i += 2;
                } else {
                    c2 = text.charCodeAt(i + 1);
                    c3 = text.charCodeAt(i + 2);
                    output.push(String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)));
                    i += 3;
                }
            }

            return output.join('');
        }
    });
})(jQuery);

var sectionHeight = function() {
  var total    = $(window).height(),
      $section = $('section').css('height','auto');

  if ($section.outerHeight(true) < total) {
    var margin = $section.outerHeight(true) - $section.height();
    $section.height(total - margin - 20);
  } else {
    $section.css('height','auto');
  }
}

$(window).resize(sectionHeight);

$(document).ready(function(){
  $("section h1, section h2").each(function(){
    $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a></li>");
    $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    $("nav ul li:first-child a").parent().addClass("active");
  });

  $("nav ul li").on("click", "a", function(event) {
    var position = $($(this).attr("href")).offset().top - 190;
    $("html, body").animate({scrollTop: position}, 400);
    $("nav ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();
  });

  sectionHeight();

  $('img').load(sectionHeight);
});

fixScale = function(doc) {

  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }

  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [.25, 1.6];
    doc[addEvent](type, fix, true);
  }
};
