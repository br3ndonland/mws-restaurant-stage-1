// ~~~~~~~~~~~~~~~ Database helper for restaurant reviews app ~~~~~~~~~~~~~~ //
class DBHelper {
  // JSON data location
  static get DATABASE_URL () {
    const port = 8000
    return `http://localhost:${port}/data/restaurants.json`
  }

  // Static method to fetch restaurants
  static fetchRestaurants (callback) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', DBHelper.DATABASE_URL)
    xhr.onload = () => {
      if (xhr.status === 200) {
        const json = JSON.parse(xhr.responseText)
        const restaurants = json.restaurants
        callback(null, restaurants)
      } else {
        const error = (`Request failed. Returned status of ${xhr.status}`)
        callback(error, null)
      }
    }
    xhr.send()
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
          callback('Restaurant does not exist', null)
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

  // Static method to return URL for restaurant page
  static urlForRestaurant (restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }

  // Static method to return URL for restaurant image
  static imageUrlForRestaurant (restaurant) {
    return (`/assets/img/${restaurant.photograph}`)
  }

  // Static method to create map marker for restaurant
  // https://leafletjs.com/reference-1.3.0.html#marker
  static mapMarkerForRestaurant (restaurant, map) {
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap)
    return marker
  }
}
