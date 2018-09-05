// ~~~~~~~~~~~~~~~ Database helper for restaurant reviews app ~~~~~~~~~~~~~~ //

class DBHelper {
  // JSON data location
  static get DATABASE_URL () {
    const port = 1337
    return `http://localhost:${port}/restaurants`
  }
  // Static method to return URL for restaurant page
  static urlForRestaurant (restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }
  // Static method to return URL for restaurant image
  static imageUrlForRestaurant (restaurant) {
    return (`/assets/img/${restaurant.id}.jpg`)
  }

  // Static method to fetch restaurants
  static async fetchRestaurants (callback) {
    try {
      const query = fetch(DBHelper.DATABASE_URL)
      const restaurants = await (await query).json()
      callback(null, restaurants)
    } catch (e) {
      throw Error(e)
    }
  }

  // Static method to fetch restaurant by ID
  static fetchRestaurantById (id, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        const restaurant = restaurants.find(r => r.id == id)
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
        const results = restaurants.filter(r => r.cuisine_type == cuisine)
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
        const results = restaurants.filter(r => r.neighborhood == neighborhood)
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
        if (cuisine != 'all') {
          // Filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') {
          // Filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood)
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
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
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
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
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
}
