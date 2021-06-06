import cheerio from 'cheerio'
import Response from '@layer0/core/router/Response'
import Request from '@layer0/core/router/Request'
import { injectBrowserScript } from '@layer0/starter'

export default function transform(response: Response, request: Request) {
  // inject browser.ts into the document returned from the origin
  injectBrowserScript(response)

  if (response.body) {
    const $ = cheerio.load(response.body)
    // console.log("Transform script running on '"+response.req.originalUrl+"'") // for testing

    // Those 2 scripts are added using server side transformation just for Proof of Concept purposes.
    // For production those 2 scripts should be included in original website base code.
    $('head').append(`
      <script src="/__layer0__/cache-manifest.js" defer="defer"></script>
      <script src="/main.js" defer="defer"></script>
    `)

    $('head').append(`
      <!-- Start of Async Drift Code -->
      <script>
      "use strict";

      !function() {
        var t = window.driftt = window.drift = window.driftt || [];
        if (!t.init) {
          if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
          t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
          t.factory = function(e) {
            return function() {
              var n = Array.prototype.slice.call(arguments);
              return n.unshift(e), t.push(n), t;
            };
          }, t.methods.forEach(function(e) {
            t[e] = t.factory(e);
          }), t.load = function(t) {
            var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
            o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(o, i);
          };
        }
      }();
      drift.SNIPPET_VERSION = '0.3.1';
      drift.load('xzp9pdf4acb2');
      </script>
      <!-- End of Async Drift Code -->
    `)


    $('head').append(`
      <style>
        .l0-hidden {
          display: none !important;
        }
      </style>
    `)

    $('*').attr('layer0', 'layer0')

    // Relativise links
    $('a[href^="https://hiring.monster.com"]').map((i, el) => {
      var link = $(el).attr('href') || '';
      $(el).attr('href', link.replace('https://hiring.monster.com/', '/'));
    })
    $('a[href^="http://hiring.monster.com"]').map((i, el) => {
      var link = $(el).attr('href') || '';
      $(el).attr('href', link.replace('http://hiring.monster.com', '/'));
    })

    // Hero image
    $('.content-hero.track header[data-mobilebackground]').map((i, el) => {
      var url = $(el).attr('data-mobilebackground') || '';
      $(el).attr('style', `background-image: url("${url}");`)
      $(el).append(`<img class="l0-hero l0-hidden" src="${url}" />`)
    })

    response.body = $.html()
  }
}
