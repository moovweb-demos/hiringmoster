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
      <style>
        .l0-hidden {
          display: none !important;
        }
      </style>
    `)

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
