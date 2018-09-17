# Computational narrative

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 3. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
- [Favorites](#favorites)
  - [Favorite button](#favorite-button)
  - [Favorite toggle](#favorite-toggle)
  - [Favorite submission](#favorite-submission)
- [Reviews](#reviews)
  - [Fetch reviews from updated server API](#fetch-reviews-from-updated-server-api)
  - [Fetch reviews from IndexedDB](#fetch-reviews-from-indexeddb)
  - [User interface for adding reviews](#user-interface-for-adding-reviews)
  - [Review submission](#review-submission)
- [Performance](#performance)

## Getting started

- Same strategy for the data server as in project 2, but it comes from a new repo.
- Cloned the [project 3 server repo](https://github.com/udacity/mws-restaurant-stage-3) into a separate directory.
- I watched the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok). Note Doug's use of [ternary conditional operators](https://en.wikipedia.org/wiki/%3F:) `?:`.

## Favorites

### Favorite button

- I created a favorite button with *index.js* in the `createRestaurantHTML()` function.
  - I used the HTML unicode character [white star `&#9734;`](https://unicode-table.com/en/2606/).
  - I included an if/then statement, in *dbhelper.js*, *index.js*, and *restaurant.js*, to change to the [black star `&#9733`](https://unicode-table.com/en/2605/) when the restaurant is favorited.

### Favorite toggle

- Now that I have a favorite button, I need to use it to change the `is_favorite` value in the restaurant data. The project 3 data server provides a `PUT` endpoint at `http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true`.
- I started by creating a `toggleFavorite()` function in *dbhelper.js*, and getting it working over the network.
  - I set up a `fetch` query using the data server `PUT` endpoint. The `PUT` method updates the JSON data on the server. I used the [ternary conditional operators](https://en.wikipedia.org/wiki/%3F:) `?:`, as shown in the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok). The `?:` works like if/then, so if the restaurant JSON has `"is_favorite": "true",` the query will change it to `"is_favorite": "false",`.
  - Boolean vs. string: `true` and `false` can either be interpreted as Boolean (without quotes) or string (with quotes). See the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok) 0.15.00. I kept them as strings.
  - I included the same if/then statement from *index.js* and *restaurant.js* to change to the [black star `&#9733`](https://unicode-table.com/en/2605/) when the restaurant is favorited. I need it in all three files because I need to create the star when the page is rendered, and also change the star when the favorite status changes.
  - Here's how the online-only function looked initially:

    ```js
    static async toggleFavorite (restaurant) {
      try {
        const query = fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?${restaurant.is_favorite === 'true' ? 'is_favorite=false' : 'is_favorite=true'}`, {method: 'PUT'})
        const response = await (await query).json()
        restaurant.is_favorite = response.is_favorite
        const favoriteButton = document.getElementById(`restaurant-${restaurant.id}`)
        console.log(`This is restaurant ID ${restaurant.id}`)
        if (restaurant.is_favorite === 'true') {
          favoriteButton.innerHTML = '&#9733'
          favoriteButton.setAttribute('aria-label', `Remove ${restaurant.name} from favorites`)
        } else {
          favoriteButton.innerHTML = '&#9734'
          favoriteButton.setAttribute('aria-label', `Add ${restaurant.name} to favorites`)
        }
        console.log(`Favorite status for ${restaurant.name}: ${restaurant.is_favorite}`)
      } catch (e) {
        throw Error(e)
      }
    }
    ```

### Favorite submission

#### Updating IndexedDB with new favorite status after toggle

- I started by continuing the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok) starting at 0.23.30. His code was very difficult to follow, and I wasn't able to implement it successfully.
- I came up with my own simpler, human-readable solution instead.
- When creating HTML in `index.createRestaurantHTML()` and `restaurant.fillRestaurantHTML()`:
  - I show either an unfilled or filled star based on the current favorite state.
  - I give each favorite button the restaurant's id with

    ```js
    favoriteButton.id = `restaurant-${restaurant.id}`
    ```

  - A click listener on each page runs `DBHelper.toggleFavorite(restaurant)` when the star is clicked.
- Next, I worked on the `DBHelper.toggleFavorite(restaurant)` function. This was the challenging part.
  - I started by grabbing the appropriate element with `document.getElementById(`restaurant-${restaurant.id}`)`.
  - Next, I had to read the info from IDB. I was having two issues, shown in the image below:
    ![Problems with overwriting and duplicating IndexedDB object stores](img/udacity-google-mws-p3-20180916-01.png)
      1. *Overwriting the JSON array in IndexedDB:* At first, I was reading the database with `store.getAll()`. The problem with this was that submitting a change in favorite status (like "true" or "false") was just overwriting the entire JSON object store. Rather than calling `store.getAll()`, I had to call `store.openCursor(0[restaurant.id])` to iterate through the JSON and read the object for this specific restaurant. There's just one JSON array for all the restaurants, so I use `0`, and I want to change the favorite status for this specific restaurant, so I use `restaurant.id` to find its object in the JSON array. Also note my use of Async/Await to read the data returned from IndexedDB.
      2. *Duplicating the JSON array in IndexedDB:* The second problem you can see in the image above is that I was duplicating the JSON array every time I loaded the page. I had to change the object store key path in `DBHelper.createDatabase()` from `{autoincrement: true}` to `{keyPath: 'id'}`. This was throwing some errors at first. Each time I open the object store, I have to reference the specific key path. I only have one JSON array, and keys start at 1. Each time I act on the object store, I need to add the `keyPath`, like `await restaurantsStore.put(restaurants, 1)`.
  - IndexedDB is now updated properly:
    ![Corrected problems with overwriting and duplicating IndexedDB object stores](img/udacity-google-mws-p3-20180916-02.png)
  - I also included an `else {}` condition to attempt to send changes directly to server API if IndexedDB is not present, basically functioning like a normal online web app in that case.
- Here's the `DBHelper.toggleFavorite(restaurant)` function at this point for reference:

  ```js
  // Static method to toggle favorite status of a restaurant by clicking the star button
  static async toggleFavorite (restaurant) {
    try {
      const favoriteButton = document.getElementById(`restaurant-${restaurant.id}`)
      // Look for IndexedDB and open JSON object with cursor
      const db = await idb.open('udacity-google-mws-idb', 1)
      const tx = db.transaction('restaurants', 'readwrite')
      const store = tx.objectStore('restaurants')
      const data = await store.openCursor(0[restaurant.id])
      if (data.length > 0) {
        // If IndexedDB is present, send data there
        restaurant.is_favorite = data.is_favorite === 'true' ? 'false' : 'true'
        console.log(`New favorite status for ${restaurant.name} ID ${restaurant.id} to send to IndexedDB: ${restaurant.is_favorite}`)
        await store.put(restaurant.is_favorite, 1)
        // TODO: POST to IDB restaurants-offline object store
      } else {
        // If IndexedDB is not present, attempt to send changes directly to server API
        const query = fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?${restaurant.is_favorite === 'true' ? 'is_favorite=false' : 'is_favorite=true'}`, {method: 'PUT'})
        const response = await (await query).json()
        restaurant.is_favorite = response.is_favorite
        console.log(`New favorite status for ${restaurant.name} ID ${restaurant.id} to send to server: ${restaurant.is_favorite}`)
      }
      // Change icon
      if (restaurant.is_favorite === 'true') {
        favoriteButton.innerHTML = '&#9733'
        favoriteButton.setAttribute('aria-label', `Remove ${restaurant.name} from favorites`)
      } else {
        favoriteButton.innerHTML = '&#9734'
        favoriteButton.setAttribute('aria-label', `Add ${restaurant.name} to favorites`)
      }
    } catch (e) {
      throw Error(e)
    }
  }
  ```

#### Syncing offline favorites with server

- There are a couple of things I need to sync here. First, when I toggle a favorite on the homepage, it does change, but if I then navigate to the restaurant page, the favorite doesn't show up. I have to refresh the page to show the update. This may be a Service Worker issue.
- Next, I need to create a queue for changes made when offline, and propagate the queue to the server when connectivity is re-established.
- *TODO*

## Reviews

### Fetch reviews from updated server API

- When I revisited *restaurant.html*, I refactored some of *restaurant.html* to look closer to *index.html* by moving more of the HTML generation to *restaurant.js*. I updated the CSS accordingly.
- In project 2, the reviews were appended to the restaurant JSON. In project 3, the reviews are in a separate JSON API.
  - I set up a reviews variable in *dbhelper.js*:

    ```js
    static get DATABASE_URL_REVIEWS () {
      const port = 1337
      return `http://localhost:${port}/reviews`
    }
    ```

  - I updated `DBHelper.createDatabase()` to fetch the reviews and put them into a separate IDB store. I'm not using the new IDB store yet, but I will get to it.
- Next, when rendering the restaurant info page *restaurant.html*, I needed to fetch reviews specific to that restaurant.
  - It was confusing and frustrating to figure this out. I had to spend several hours hacking and console logging, trying to sort through the Udacity [callback hell](https://www.quora.com/What-is-callback-hell).  The way Udacity wrote the code is non-linear and difficult to read. I considered refactoring the entire codebase, but decided it wouldn't be worth the effort at this point. I eventually had some success.
  - I started at `restaurant.fetchRestaurantFromURL()`, which calls `DBHelper.fetchRestaurantById()`, which calls `DBHelper.fetchRestaurants()`.
  - Within the call to `DBHelper.fetchRestaurants()` I added `self.restaurant.reviews = restaurant.reviews`, which will read reviews returned from the function and plug into the rest of the previously written code in *restaurant.js*.
  - This means I need to pull review data into the `DBHelper.fetchRestaurants()` function. I decided to just work with the online data API itself right now, because trying to add in IDB calls at the same time would be too complicated. As a side benefit, I was finally able to delete the line with `==`. StandardJS prefers `===` over `==`, but when I tried to add `===` previously it was breaking the function. I was simply able to slice the array by `id`.

    ```js
    // dbhelper.js
    // Static method to fetch restaurant by ID
    static fetchRestaurantById (id, callback) {
      DBHelper.fetchRestaurants(async (error, restaurants) => {
        if (error) {
          callback(error, null)
        } else {
          // const restaurant = restaurants.find(r => r.id == id)
          const restaurant = restaurants[id]
          // Fetch reviews by ID
          const query = fetch(DBHelper.DATABASE_URL_REVIEWS)
          const response = await (await query).json()
          const reviews = response.filter(review => review.restaurant_id === restaurant.id)
          restaurant.reviews = reviews
          if (restaurant) {
            callback(null, restaurant)
          } else {
            callback(null, 'Restaurant does not exist')
          }
        }
      })
    }
    ```

  - The restaurant array ID starts at zero, but the `restaurant_id` value for each review starts at 1. I addressed this discrepancy by updating `urlForRestaurant()`:

    ```js
    static urlForRestaurant (restaurant) {
      const correctedId = restaurant.id - 1
      return (`./restaurant.html?id=${correctedId}`)
    }
    ```

### Fetch reviews from IndexedDB

- Next, I needed to fetch reviews from IndexedDB if available.
  - This was much easier and only took me a few minutes.
  - I considered making a separate `fetchReviews()` function, or adding the reviews fetch to `fetchRestaurants()`, but the callbacks make it too difficult.
  - I ended up just nesting the reviews fetch under `fetchRestaurantById()`.
  - The function in *dbhelper.js* looked like this:

    ```js
    // dbhelper.js
    // Static method to fetch restaurant by ID
    static fetchRestaurantById (id, callback) {
      DBHelper.fetchRestaurants(async (error, restaurants) => {
        if (error) {
          callback(error, null)
        } else {
          const restaurant = restaurants[id]
          // Fetch reviews by ID from IDB if present, else fetch from server API
          const db = await idb.open('udacity-google-mws-idb', 1)
          const tx = db.transaction('reviews', 'readonly')
          const store = tx.objectStore('reviews')
          const data = await store.getAll()
          if (data.length > 0) {
            let response = data[0]
            console.log('Reading reviews from IndexedDB.')
            const reviews = response.filter(review => review.restaurant_id === restaurant.id)
            restaurant.reviews = reviews
          } else {
            const query = fetch(DBHelper.DATABASE_URL_REVIEWS)
            let response = await (await query).json()
            console.log('Reading reviews from server API.')
            const reviews = response.filter(review => review.restaurant_id === restaurant.id)
            restaurant.reviews = reviews
          }
          if (restaurant) {
            callback(null, restaurant)
          } else {
            callback(null, 'Restaurant does not exist')
          }
        }
      })
    }
    ```

### User interface for adding reviews

- I created an overlay for adding reviews.
- I added `<form class="overlay d-none" id="overlay-div"></form>` to *restaurant.html* as a placeholder, and programmatically created the HTML from within *restaurant.js*.
- I show and hide the overlay by using a function to toggle `d-none` when the `addReview` link in the header is clicked:

  ```js
  addReview.addEventListener('click', () => overlayDiv.classList.toggle('d-none'))
  ```

### Review submission

- To get started, I reviewed the [MDN sending form data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_and_retrieving_form_data) page.
- The review submission process starts on the restaurant page and in *restaurant.js*. The `saveReview()` function collects metadata for the `POST` request, but does not yet submit the `POST` request, and then triggers the `DBHelper.saveReview()` function.
- After submitting the form, the page was reloading to `http://localhost:8000/restaurant.html?`.
  - Problem with *restaurant.js* `fetchRestaurantFromURL()`.

## Performance

My app was already meeting the performance benchmarks during project 2.
