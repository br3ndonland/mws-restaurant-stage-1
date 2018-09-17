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
    const correctedId = restaurant.id - 1
    return (`${DBHelper.WEB_HOST}/restaurant.html?id=${correctedId}`)
  }
  // Static method to return URL for restaurant image
  static imageUrlForRestaurant (restaurant) {
    return (`/assets/img/${restaurant.id}.jpg`)
  }

  // Static method to create IndexedDB database
  static async createDatabase () {
    try {
      if ('indexedDB' in window) {
        console.log('IndexedDB available.')
        // Create IndexedDB
        const db = await idb.open('udacity-google-mws-idb', 1, upgradeDb => {
          upgradeDb.createObjectStore('restaurants', {keypath: 'id'})
          upgradeDb.createObjectStore('restaurants-offline', {keypath: 'id'})
          upgradeDb.createObjectStore('reviews', {keypath: 'id'})
          upgradeDb.createObjectStore('reviews-offline', {keypath: 'id'})
          // upgradeDb.createObjectStore('pending', {autoIncrement: true})
        })
        // Store restaurant JSON in IndexedDB
        const restaurantsQuery = fetch(DBHelper.DATABASE_URL)
        const restaurants = await (await restaurantsQuery).json()
        const restaurantsTx = db.transaction('restaurants', 'readwrite')
        const restaurantsStore = restaurantsTx.objectStore('restaurants')
        await restaurantsStore.put(restaurants, 1)
        // Store reviews JSON in IndexedDB
        const reviewsQuery = fetch(DBHelper.DATABASE_URL_REVIEWS)
        const reviews = await (await reviewsQuery).json()
        const reviewsTx = db.transaction('reviews', 'readwrite')
        const reviewsStore = reviewsTx.objectStore('reviews')
        await reviewsStore.put(reviews, 1)
        console.log('IndexedDB creation successful.')
      } else {
        console.log('IndexedDB not available.')
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
        let restaurants = data[0]
        console.log('Reading restaurant data from IndexedDB.')
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
  // TODO: POST a review to the database
  static async postReview (review) {}
  // TODO: Sync offline and online favorites and reviews
  static async syncData () {}
  // Send to online
  // Compare online and offline
  // If same, then delete
}
