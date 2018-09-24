// ~~~~~~~~~~~~~~~~~~~~~~~~~ Database helper for restaurant reviews app ~~~~~~~~~~~~~~~~~~~~~~~~ //

class DBHelper {
  // JSON data location
  static get DATABASE_HOST () {
    const port = 1337
    return `http://localhost:${port}`
  }
  static get DATABASE_URL () {
    return `${DBHelper.DATABASE_HOST}/restaurants`
  }
  static get DATABASE_URL_REVIEWS () {
    return `${DBHelper.DATABASE_HOST}/reviews`
  }
  static get WEB_HOST () {
    return `http://localhost:8000`
  }
  // Static method to return URL for restaurant page
  static urlForRestaurant (restaurant) {
    return (`${DBHelper.WEB_HOST}/restaurant.html?id=${restaurant.id}`)
  }
  // Static method to return URL for restaurant image
  static imageUrlForRestaurant (restaurant) {
    return (`/assets/img/${restaurant.id}.jpg`)
  }

  // Static method to create IndexedDB database
  static async createDatabase () {
    try {
      if ('indexedDB' in window) {
        // Create IndexedDB
        const db = await idb.open('udacity-google-mws-idb', 1, upgradeDb => {
          upgradeDb.createObjectStore('restaurants', {keypath: 'id'})
          upgradeDb.createObjectStore('reviews', {autoincrement: true})
        })
        // Store restaurant JSON in IndexedDB
        const restaurantsQuery = fetch(DBHelper.DATABASE_URL)
        const restaurants = await (await restaurantsQuery).json()
        restaurants.forEach(async restaurant => {
          const tx = db.transaction('restaurants', 'readwrite')
          const store = tx.objectStore('restaurants')
          await store.put(restaurant, restaurant.id)
        })
        // Store reviews JSON in IndexedDB
        const reviewsQuery = fetch(DBHelper.DATABASE_URL_REVIEWS)
        const reviews = await (await reviewsQuery).json()
        reviews.forEach(async review => {
          const tx = db.transaction('reviews', 'readwrite')
          const store = tx.objectStore('reviews')
          await store.put(review, review.id)
        })
      } else {
        console.warn('IndexedDB not available.')
      }
    } catch (e) {
      throw Error(e)
    }
  }

  // Static method to fetch restaurant data from IDB if present, else fetch from server API
  static async fetchRestaurants (callback) {
    try {
      const db = await idb.open('udacity-google-mws-idb', 1)
      const tx = db.transaction('restaurants', 'readonly')
      const store = tx.objectStore('restaurants')
      const data = await store.getAll()
      if (data.length > 0) {
        let restaurants = data
        callback(null, restaurants)
      } else {
        const query = fetch(DBHelper.DATABASE_URL)
        let restaurants = await (await query).json()
        callback(null, restaurants)
      }
    } catch (e) {
      throw Error(e)
    }
  }

  // Static method to fetch restaurant by ID
  static fetchRestaurantById (id, callback) {
    DBHelper.fetchRestaurants(async (error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // The array is zero-indexed, but restaurant IDs start at 1. Subtract 1 to read array properly.
        const restaurant = restaurants[id - 1]
        // Fetch reviews by ID from IDB if present, else fetch from server API
        const db = await idb.open('udacity-google-mws-idb', 1)
        const tx = db.transaction('reviews', 'readonly')
        const store = tx.objectStore('reviews')
        const data = await store.getAll()
        if (data.length > 0) {
          let response = data
          const reviews = response.filter(review => review.restaurant_id === restaurant.id)
          restaurant.reviews = reviews
        } else {
          const query = fetch(DBHelper.DATABASE_URL_REVIEWS)
          let response = await (await query).json()
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

  // Static method to fetch restaurant by cuisine
  static fetchRestaurantByCuisine (cuisine, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants by cuisine type
        const results = restaurants.filter(r => r.cuisine_type === cuisine)
        callback(null, results)
      }
    })
  }

  // Static method to fetch restaurant by neighborhood
  static fetchRestaurantByNeighborhood (neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants by neighborhood
        const results = restaurants.filter(r => r.neighborhood === neighborhood)
        callback(null, results)
      }
    })
  }

  // Static method to fetch restaurant by cuisine and neighborhood
  static fetchRestaurantByCuisineAndNeighborhood (cuisine, neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        let results = restaurants
        if (cuisine !== 'all') {
          // Filter by cuisine
          results = results.filter(r => r.cuisine_type === cuisine)
        }
        if (neighborhood !== 'all') {
          // Filter by neighborhood
          results = results.filter(r => r.neighborhood === neighborhood)
        }
        callback(null, results)
      }
    })
  }

  // Static method to fetch neighborhoods
  static fetchNeighborhoods (callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all neighborhoods
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i)
        callback(null, uniqueNeighborhoods)
      }
    })
  }

  // Static method to fetch cuisines
  static fetchCuisines (callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all cuisines
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i)
        callback(null, uniqueCuisines)
      }
    })
  }

  // Static method to create map marker for restaurant
  // https://leafletjs.com/reference-1.3.0.html#marker
  static mapMarker (restaurant, map) {
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(map)
    return marker
  }

  // Static method to toggle favorite status of a restaurant by clicking the star button
  static async toggleFavorite (restaurant) {
    try {
      const favoriteButton = document.getElementById(`restaurant-${restaurant.id}`)
      if ('indexedDB' in window) {
        const db = await idb.open('udacity-google-mws-idb', 1)
        const tx = db.transaction('restaurants', 'readwrite')
        const store = tx.objectStore('restaurants')
        const cursor = await store.openCursor(restaurant.id)
        if (cursor.value.is_favorite === 'true') {
          cursor.value.is_favorite = 'false'
        } else {
          cursor.value.is_favorite = 'true'
        }
        await cursor.update(cursor.value)
        restaurant.is_favorite = cursor.value.is_favorite
      } else {
        // If IndexedDB is not present, attempt to POST changes directly to server API
        const query = fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?${restaurant.is_favorite === 'true' ? 'is_favorite=false' : 'is_favorite=true'}`, {method: 'PUT'})
        // Fetch data from server with new favorite status
        const response = await (await query).json()
        restaurant.is_favorite = response.is_favorite
        console.log(`New favorite status for ${restaurant.name} ID ${restaurant.id} on server: ${restaurant.is_favorite}`)
      }
      // Change icon
      if (restaurant.is_favorite === 'true') {
        favoriteButton.innerHTML = '&#9733'
        favoriteButton.setAttribute('aria-label', `Remove ${restaurant.name} from favorites`)
      } else {
        favoriteButton.innerHTML = '&#9734'
        favoriteButton.setAttribute('aria-label', `Add ${restaurant.name} to favorites`)
      }
      // Sync with server
      DBHelper.syncFavorites()
    } catch (e) {
      throw Error(e)
    }
  }

  // Static method to POST a review
  static async postReview (restaurant) {
    try {
      // Collect info for POST request
      const name = document.getElementById('reviewName').value
      const rating = document.getElementById('reviewRating').value
      const comment = document.getElementById('reviewComment').value
      const body = {
        comments: comment,
        createdAt: Date.now(),
        name: name,
        rating: Number(rating),
        restaurant_id: restaurant.id
      }
      if ('indexedDB' in window) {
        // POST changes to IndexedDB
        const db = await idb.open('udacity-google-mws-idb', 1)
        const tx = db.transaction('reviews', 'readwrite')
        const store = tx.objectStore('reviews')
        const keys = await store.getAllKeys()
        const key = Number(keys.length + 1)
        await store.put(body, key)
      } else {
        // If IndexedDB is not present, attempt to POST changes directly to server API
        const url = DBHelper.DATABASE_URL_REVIEWS
        const params = {
          body: body,
          method: 'POST'
        }
        fetch(url, params)
      }
      window.location.href = `/restaurant.html?id=${self.restaurant.id}`
      // Sync with server
      DBHelper.syncFavorites()
    } catch (e) {
      throw Error(e)
    }
  }

  static async syncFavorites () {
    try {
      // Ping server to check for connection
      const ping = fetch(DBHelper.DATABASE_URL)
      const pong = await (await ping)
      if (pong.ok === true) {
        // Fetch data from server
        const serverRestaurants = await (await ping).json()
        console.log(serverRestaurants)
        // Fetch data from IndexedDB
        const db = await idb.open('udacity-google-mws-idb', 1)
        const tx = db.transaction('restaurants', 'readonly')
        const store = tx.objectStore('restaurants')
        const restaurants = await store.getAll()
        console.log(restaurants)
        // Compare data for each restaurant. If favorite status is different, PUT to server API.
        restaurants.forEach((restaurant, i) => {
          const serverRestaurant = serverRestaurants[i]
          if (restaurant.is_favorite !== serverRestaurant.is_favorite) {
            fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`, {method: 'PUT'})
            console.log(`PUT change for restaurant ${restaurant.name}`)
          }
        })
      }
    } catch (e) {
      throw Error(e)
    }
  }
}
