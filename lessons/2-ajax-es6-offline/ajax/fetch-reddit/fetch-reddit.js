// Require modules to run file from Node.js outside of browser
// const fetch = require('node-fetch')

const fetchTopFive = async (subreddit) => {
  const URL = `https://www.reddit.com/r/${subreddit}/top/.json?limit=5`
  try {
    // Fetch data from URL
    const fetchResult = fetch(URL)
    // Store promises and their results as objects
    const json = await (await fetchResult).json()
    // Create a console group to nest results
    console.group('Posts')
    // Print each post to the console with a for...of loop
    console.group('for...of loop')
    for (const post of json.data.children) {
      console.log(`${post.data.title}\n${post.data.url}`)
    }
    console.groupEnd('for...of loop')
    // Print each post to the console with map
    console.group('map')
    const posts = json.data.children.map(post => {
      console.log(`${post.data.title}\n${post.data.url}`)
    })
    console.groupEnd('map')
    console.groupEnd('Posts')
  } catch (e) {
    throw Error(e)
  }
}
// Run the function on a specified subreddit
fetchTopFive('javascript')
