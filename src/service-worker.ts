import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@layer0/prefetch/sw'
import DeepFetchPlugin, { DeepFetchCallbackParam } from '@layer0/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'img.product-main-image',
        maxMatches: 1,
        attribute: 'src',
        as: 'image',
      },
      {
        selector: '.l0-hero',
        maxMatches: 2,
        attribute: 'src',
        as: 'image',
        callback: deepFetchHero,
      },
      {
        selector: '.image-wrapper img',
        maxMatches: 1,
        attribute: 'src',
        as: 'image',
        callback: deepFetchArticleImages,
      },
    ]),
  ],
})
  .route()
  .cache(/^https:\/\/hiring\.monster\.com\/.*/)
  // ENTER REGULAR EXPRESSION SELECTOR FOR IMAGES YOU WANT TO PREFETCH //
  // (usualy as CDN base domain name followed by ".*" as general selecor) //

///////////////////////////////////////////////
// Callback function for PDP image selector //
function deepFetchHero({ $el, el, $ }: DeepFetchCallbackParam) {

    const url = $el.attr('src')
    console.log("[][]][][[][]][][][][][[]][[][][]\nPrefetching Hero: "+url+"\n")
    prefetch(url, 'image')

}

///////////////////////////////////////////////
// Callback function for PLP image selector //
function deepFetchArticleImages({ $el, el, $ }: DeepFetchCallbackParam) {

  const url = $el.attr('src')
  console.log("[][]][][[][]][][][][][[]][[][][]\nPrefetching Article image: "+url+"\n")
  prefetch(url, 'image')

}

// function logPrefetchedContent({$el}) { // for testing
//   // console.log("[][]][][[][]][][][][][[]][[][][]")
//   console.log("content '"+$el.attr('src')+"' has been prefetched...")
// }
