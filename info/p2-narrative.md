# Computational narrative

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 2. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
- [Data](#data)
  - [Server](#server)
  - [Use IndexedDB to cache JSON responses](#use-indexeddb-to-cache-json-responses)
- [Performance](#performance)
  - [Lighthouse](#lighthouse)
  - [Building and bundling](#building-and-bundling)

## Getting started

- As usual, I copied the project documentation and rubric HTML from the Udacity classroom, pasted it into [Turndown](https://domchristie.github.io/turndown/), and saved it in Markdown files.
- We don't need to add the project 2 repo to our project. The project 2 repo is just a server that we use to fetch data.
- I deleted my old `dev` branch, and created a new `dev` branch. Previously, you can see that I jumped over the "Submit project 1" commit back onto the old `dev` branch. This is why GitHub prompts users to delete branches after merging.

## Data

### Server

#### Server setup

- The first step is to set up the development server for the restaurant data.
- The project uses [Sails](https://sailsjs.com/), a Node.js MVC framework. The way that Udacity implemented this is extremely confusing. My understanding is that the Sails server doesn't actually have any data on it. It just reads the data you already have stored in *data/restaurants.json*, and serves up a JSON API for it. We also don't move our image files to the server, they are still coming from the same place.
- I got the development server up and running:

  ```sh
  cd udacity-google-mws-p2
  npm i
  npm i sails -g
  node server
  ```

- The server runs on port 1337 (haha).
- I could now `curl` data from the server

  ```sh
  curl "http://localhost:1337/restaurants"
  curl "http://localhost:1337/restaurants/3"
  ```

#### Server usage

- The next step is to reconfigure the app to fetch data from the server's API.
- I changed the port in *dbhelper.js* to `1337` to work with the server.

  ```js
  static get DATABASE_URL () {
    const port = 1337
    return `http://localhost:${port}/restaurants`
  }
  ```

- I can now see JSON at [http://localhost:1337/restaurants](http://localhost:1337/restaurants).
- I then fetched data from the Sails server with Async/Await.

  ```js
  // Static method to fetch restaurant data
  static async fetchRestaurants (callback) {
    try {
      const query = fetch(DBHelper.DATABASE_URL)
      const restaurants = await (await query).json()
      callback(null, restaurants)
    } catch (e) {
      throw Error(e)
    }
  }
  ```

- I tried refactoring the rest of the functions in *dbhelper.js* with try/catch error handling and strict equality, but couldn't get it to work. Really all the JavaScript needs to be refactored because it's incredibly confusing.

### Use IndexedDB to cache JSON responses

- Now that I am fetching JSON data from the Sails server API, I need to store the JSON data in IndexedDB. IndexedDB is a NoSQL database. I used [IndexedDB Promised](https://github.com/jakearchibald/idb) (IDB) from Jake Archibald.
  - Jake Archibald [IDB lesson](https://github.com/br3ndonland/udacity-google-mws/blob/master/lessons/2-ajax-es6-offline/offline-web-apps/offline-3-indexeddb.md).
  - Doug Brown [Project 2 walkthrough](https://www.youtube.com/watch?v=Q2CJYf_XA58) starting at 0.19.45. As Doug says, React can handle this type of database caching in a much easier way than we are doing here.
- As Google [explains](https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker), JSON should be stored in IDB, while HTML, CSS, and JS should be stored in the cache.
- IDB can be handled either from within the Service Worker or within *dbhelper.js*.
  - Either way, the first step is to remove *restaurants.json* from `filesToCache` in *sw.js*. We'll be storing the restaurant JSON in IDB.
  - Handling IDB from within *sw.js*, like [Doug Brown does](https://github.com/thefinitemonkey/udacity-restaurant-reviews), requires a bundler. Imports won't work without a bundler, because *sw.js* is not being loaded with a script tag in the HTML.
  - Handling IDB from within *dbhelper.js* is a simpler option. I chose this.
- IDB functions added to *dbhelper.js*:
  - `createDatabase()` needs to set up IDB.
    - I used the wonderful Async/Await API to avoid dealing with complicated promise chaining. I first learned Async/Await during my [Boston's Best Beans](https://github.com/br3ndonland/udacity-fsnd-p5-map/blob/master/info/map-methods.md#async-await) project, and [this post](https://medium.com/@filipvitas/indexeddb-with-promises-and-async-await-3d047dddd313) was also helpful.
    - I kept `fetchRestaurants()` the same at this point, so I could keep the app working until I verified that `createDatabase()` was establishing the database.
    - To test this out, I added a `DBHelper.createDatabase()` call to *index.js*.

    ```js
    static async createDatabase () {
      try {
        // Create IndexedDB
        const db = await idb.open('udacity-google-mws-idb', 1, upgradeDb => {
          upgradeDb.createObjectStore('restaurants', {
            autoIncrement: true,
            keyPath: 'id'
          })
        })
        // Store JSON in IndexedDB
        const query = fetch(DBHelper.DATABASE_URL)
        const restaurants = await (await query).json()
        const tx = db.transaction('restaurants', 'readwrite')
        const store = tx.objectStore('restaurants')
        await store.put(restaurants)
      } catch (e) {
        throw Error(e)
      }
    }

    // Static method to fetch restaurant data
    // Not changed yet
    static async fetchRestaurants (callback) {
      try {
        const query = fetch(DBHelper.DATABASE_URL)
        const restaurants = await (await query).json()
        callback(null, restaurants)
      } catch (e) {
        throw Error(e)
      }
    }

    // In index.js:
    // Fetch neighborhoods and cuisines as soon as the page is loaded
    document.addEventListener('DOMContentLoaded', () => {
      initMap()
      fetchNeighborhoods()
      fetchCuisines()
      DBHelper.createDatabase()
    })
    ```

    **Alright!**

    ![Successful IDB setup in Chrome developer tools](img/udacity-google-mws-20180906-idb-setup.png)

  - Next, `fetchRestaurants()` needs to be updated to fetch from IDB if present.
    - I started by writing a test to show the contents of IDB:

      ```js
      // Try to get some data from IDB
      static async readDatabase () {
        let db = await idb.open('udacity-google-mws-idb', 1)
        let tx = db.transaction('restaurants', 'readonly')
        let store = tx.objectStore('restaurants')
        let data = await store.getAll()
        console.log(data)
      }
      ```

    - The console correctly returns an array of ten restaurants.
    - Next, I wrote a function that reads from the database as above, or fetches from the server API if the database isn't available. The IDB duplicates each time with a new key. I may be able to avoid this in the future with a `switch` statement.

      ```js
      // Static method to fetch data from IDB if present, else fetch from server API
      static async fetchRestaurants (callback) {
        try {
          const db = await idb.open('udacity-google-mws-idb', 1)
          const tx = db.transaction('restaurants', 'readonly')
          const store = tx.objectStore('restaurants')
          const data = await store.getAll()
          if (data.length > 0) {
            let restaurants = data[0]
            console.log('Reading data from IndexedDB.')
            callback(null, restaurants)
          } else {
            const query = fetch(DBHelper.DATABASE_URL)
            let restaurants = await (await query).json()
            console.log('Reading data from server API.')
            callback(null, restaurants)
          }
        } catch (e) {
          throw Error(e)
        }
      }
      ```

## Performance

### Lighthouse

#### Criteria

- **Performance** ≥70
- **Progressive Web App** ≥90
- **Accessibility** ≥90

#### Testing

##### First round

- **Performance** 88
  - *Defer render-blocking resources*
    - The Mapbox JS is supposed to be in the `head`, but it was slowing down page render. I simply added `defer`.
- **PWA** 73
  - *Add manifest*
    - Created a *manifest.json* file.
    - Added `<meta name="theme-color" content="#BFBFBF">` to HTML to match `theme_color` specified in manifest.
  - Add app icons
- **Accessibility** 83
  - *Increase color contrast*
    - Used the [color picker tool](https://dequeuniversity.com/rules/axe/2.2/color-contrast?application=lighthouse) linked from the Lighthouse audit to adjust colors to a contrast ratio ≥8:1.
    - Added a new `leaflet-container` class to the CSS to override the Mapbox CSS for links.
  - *Add labels to form elements*
    - Added `aria-label="neighborhoods"` to `select` elements.

##### Second round

- **Performance** 94
- **PWA** 92
- **Accessibility** 100

#### Resources

- Doug Brown [Project 2 walkthrough](https://www.youtube.com/watch?v=Q2CJYf_XA58) starting at 0.28.45.

### Building and bundling

I tried working with modules and bundlers, but realized I didn't need them for this project.

#### ES6 modules

- I tried to refactor the JavaScript to use [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and [imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
  - Change `class DBHelper` to `export class DBHelper`
  - Import DBHelper with `import { DBHelper } from './dbhelper.js'`
  - Delete *dbhelper.js* script tags from *index.html* and *restaurant.html*.
  - Change script tag type from `application/javascript` to `module`.

    ```html
    <script type="module" charset="utf-8" src="assets/js/index.js"></script>
    ```

  - Also see
    - [freeCodeCamp](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
    - [Jake Archibald's blog](https://jakearchibald.com/2017/es-modules-in-browsers/)
    - [Auth0 blog](https://auth0.com/blog/javascript-module-systems-showdown/)
    - [Stack Overflow](https://stackoverflow.com/questions/42237388/syntaxerror-import-declarations-may-only-appear-at-top-level-of-a-module)
  - Unfortunately, conversion to modules broke the `onchange="updateRestaurants()"` function in index.html. I think that the HTML can't recognize the function when it's within a module.

#### npm modules

- Mapbox
  - [Install](https://www.mapbox.com/mapbox-gl-js/api/): `npm i --save mapbox-gl`
  - Import:
- Leaflet
  - [Install](https://leafletjs.com/download.html):`npm i leaflet`
  - Import: `import 'leaflet'` in the JS files
  - In the browser I get: `TypeError: Error resolving module specifier: leaflet`
  - Do I need to build before using leaflet?
- [IndexedDB Promised](https://github.com/jakearchibald/idb) from Jake Archibald

#### Build tools

- I use [Parcel](https://parceljs.org/) instead of [Webpack](https://webpack.js.org/) and [Gulp](https://gulpjs.com/).
- I used the [getting started docs](https://parceljs.org/getting_started.html) to, well, get started.

  ```sh
  npm i -g parcel-bundler
  ```

- I created the *package.json* file with

  ```sh
  npm init -y
  ```

- [Parcel Babel instructions](https://parceljs.org/transforms.html#babel)
