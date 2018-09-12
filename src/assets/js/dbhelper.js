// ~~~~~~~~~~~~~~~~~~~~~~~~~ Database helper for restaurant reviews app ~~~~~~~~~~~~~~~~~~~~~~~~ //

class DBHelper {
  // JSON data location
  static get DATABASE_URL () {
    const port = 1337
    return `http://localhost:${port}/restaurants`
  }
  static get DATABASE_URL_REVIEWS () {
    const port = 1337
    return `http://localhost:${port}/reviews`
  }
  // Static method to return URL for restaurant page
  static urlForRestaurant (restaurant) {
    const correctedId = restaurant.id - 1
    return (`./restaurant.html?id=${correctedId}`)
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
          upgradeDb.createObjectStore('restaurants', {autoIncrement: true})
          upgradeDb.createObjectStore('reviews', {autoIncrement: true})
        })
        // Store restaurant JSON in IndexedDB
        const restaurantsQuery = fetch(DBHelper.DATABASE_URL)
        const restaurants = await (await restaurantsQuery).json()
        const restaurantsTx = db.transaction('restaurants', 'readwrite')
        const restaurantsStore = restaurantsTx.objectStore('restaurants')
        await restaurantsStore.put(restaurants)
        // Store reviews JSON in IndexedDB
        const reviewsQuery = fetch(DBHelper.DATABASE_URL_REVIEWS)
        const reviews = await (await reviewsQuery).json()
        const reviewsTx = db.transaction('reviews', 'readwrite')
        const reviewsStore = reviewsTx.objectStore('reviews')
        await reviewsStore.put(reviews)
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
  static mapMarkerForRestaurant (restaurant, map) {
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
      // TODO: Enable offline toggle capability, use format for database creation above
      const query = fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?${restaurant.is_favorite === 'true' ? 'is_favorite=false' : 'is_favorite=true'}`, {method: 'PUT'})
      const response = await (await query).json()
      restaurant.is_favorite = response.is_favorite
      const favoriteButton = document.getElementById(`restaurant-${restaurant.id}`)
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
}
