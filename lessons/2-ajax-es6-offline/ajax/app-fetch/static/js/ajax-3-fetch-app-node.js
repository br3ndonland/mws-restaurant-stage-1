// Require modules to run file from Node.js outside of browser
const fetch = require('node-fetch')

const fetchUnsplashNYT = async (query) => {
  // Fetch data from Unsplash API
  try {
    const fetchResult = fetch(`https://api.unsplash.com/search/photos?page=1&query=${query}`, {
      method: 'GET',
      headers: {
        Authorization: 'Client-ID paste_access_key_here'
      }
    })
    const json = await (await fetchResult).json()
    console.group('Unsplash')
    console.log(`Results returned: ${json.results.length}\nInfo for first three images:`)
    const imageData = json.results.slice(0, 3).map(image => {
      console.log(`Image info:`,
        `\nID: ${image.id}`,
        `\nDescription: ${image.description}`,
        `\nUser: ${image.user.username}`,
        `\nURL: ${image.urls.regular}`
      )
    })
    console.groupEnd('Unsplash')
  } catch (e) {
    throw Error(e)
  }
  // Fetch data from NYT API
  try {
    const fetchResult = fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=paste_api_key`)
    const json = await (await fetchResult).json()
    console.group('The New York Times')
    const articles = json.response.docs.map(article => {
      console.log(`${article.web_url}\n${article.headline.main}\n${article.snippet}`)
    })
    console.groupEnd('The New York Times')
  } catch (e) {
    throw Error(e)
  }
}
fetchUnsplashNYT('android')
