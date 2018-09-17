// ~~~~~~~~~~~~~~~~~~~~~~~~~ JavaScript for restaurant reviews homepage ~~~~~~~~~~~~~~~~~~~~~~~~ //

// Initialize Leaflet map with function called from HTML
const initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  })
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYnIzbmRvbmxhbmQiLCJhIjoiY2pqMWRidW54MHJmODNrbGZhNm1obDlmdCJ9.gPYyzzqmosqKwbWa7AK8sA',
    maxZoom: 18,
    attribution:
      `Map data &copy;
      <a href="https://www.openstreetmap.org/">OpenStreetMap</a>,
      <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
      Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>`,
    id: 'mapbox.light'
  }).addTo(newMap)
  updateRestaurants()
}

// Add markers for current restaurants to the map
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    const marker = DBHelper.mapMarker(restaurant, self.newMap)
    const onClick = () => {
      window.location.href = marker.options.url
    }
    marker.on('click', onClick)
    self.markers.push(marker)
  })
}

// Fetch all neighborhoods and set their HTML
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error)
    } else {
      self.neighborhoods = neighborhoods
      fillNeighborhoodsHTML()
    }
  })
}
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select')
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option')
    option.textContent = neighborhood
    option.value = neighborhood
    select.append(option)
  })
}

// Fetch all cuisines and set their HTML
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error)
    } else {
      self.cuisines = cuisines
      fillCuisinesHTML()
    }
  })
}
const fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select')
  cuisines.forEach(cuisine => {
    const option = document.createElement('option')
    option.textContent = cuisine
    option.value = cuisine
    select.append(option)
  })
}

// Create and fill HTML for restaurants
const createRestaurantHTML = (restaurant) => {
  try {
    const div = document.createElement('div')
    div.className = 'restaurant'

    const image = document.createElement('img')
    image.className = 'restaurant__img lazy'
    image.alt = `Restaurant image for ${restaurant.name}.`
    image.src = DBHelper.imageUrlForRestaurant(restaurant)

    const header = document.createElement('div')
    header.className = 'restaurant__header'
    const name = document.createElement('h2')
    name.textContent = restaurant.name
    name.className = 'restaurant__header'
    const favoriteButton = document.createElement('button')
    favoriteButton.className = 'restaurant__header header--star'
    favoriteButton.id = `restaurant-${restaurant.id}`
    if (restaurant.is_favorite === 'true') {
      favoriteButton.innerHTML = '&#9733'
      favoriteButton.setAttribute('aria-label', `Remove ${restaurant.name} from favorites`)
    } else {
      favoriteButton.innerHTML = '&#9734'
      favoriteButton.setAttribute('aria-label', `Add ${restaurant.name} to favorites`)
    }
    favoriteButton.addEventListener('click', () => DBHelper.toggleFavorite(restaurant))
    header.append(name, favoriteButton)

    const detailsDiv = document.createElement('div')
    const infoDiv = document.createElement('div')
    const neighborhood = document.createElement('p')
    neighborhood.textContent = restaurant.neighborhood
    neighborhood.className = 'restaurant__neighborhood'
    const address = document.createElement('p')
    address.textContent = restaurant.address
    address.className = 'restaurant__address'
    infoDiv.append(neighborhood, address)
    detailsDiv.append(infoDiv)

    const more = document.createElement('a')
    more.textContent = 'View Details'
    more.className = 'restaurant__more'
    more.setAttribute('aria-label', `Details button for ${restaurant.name}`)
    more.href = DBHelper.urlForRestaurant(restaurant)

    div.append(image, header, detailsDiv, more)

    return div
  } catch (e) {
    throw Error(e)
  }
}
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const list = document.getElementById('restaurant-list')
  restaurants.forEach(restaurant => {
    list.append(createRestaurantHTML(restaurant))
  })
  addMarkersToMap()
}

// Update page and map for current restaurants
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select')
  const nSelect = document.getElementById('neighborhoods-select')
  const cIndex = cSelect.selectedIndex
  const nIndex = nSelect.selectedIndex
  const cuisine = cSelect[cIndex].value
  const neighborhood = nSelect[nIndex].value
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      console.error(error)
    } else {
      resetRestaurants(restaurants)
      fillRestaurantsHTML()
    }
  })
}

// Reset HTML and map markers
const resetRestaurants = (restaurants) => {
  self.restaurants = []
  const list = document.getElementById('restaurant-list')
  list.textContent = ''
  if (self.markers) {
    self.markers.forEach(marker => marker.remove())
  }
  self.markers = []
  self.restaurants = restaurants
}

// Fetch neighborhoods and cuisines as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  DBHelper.createDatabase()
  initMap()
  fetchNeighborhoods()
  fetchCuisines()
})
