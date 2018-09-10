// ~~~~~~~~~~~~~~~~~~~~~~~~~ JavaScript for restaurant reviews homepage ~~~~~~~~~~~~~~~~~~~~~~~~ //

// Register service worker
if ('serviceWorker' in navigator) {
  console.log(`Registering Service Worker.`)
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log(`Service Worker registration successful for ${reg.scope}`)
  }).catch(e => {
    console.log(`Registration failed with error ${e}`)
  })
}

// Fetch neighborhoods and cuisines as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  DBHelper.createDatabase()
  initMap()
  fetchNeighborhoods()
  fetchCuisines()
})

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
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap)
    marker.on('click', onClick)
    function onClick () {
      window.location.href = marker.options.url
    }
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

// Set neighborhoods HTML
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select')
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option')
    option.innerHTML = neighborhood
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
    option.innerHTML = cuisine
    option.value = cuisine
    select.append(option)
  })
}

// Reset HTML and map markers
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = []
  const ul = document.getElementById('restaurant-list')
  ul.innerHTML = ''
  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove())
  }
  self.markers = []
  self.restaurants = restaurants
}

// Create HTML for restaurants
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurant-list')
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant))
  })
  addMarkersToMap()
}
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement('div')
  li.className = 'restaurant'

  const image = document.createElement('img')
  image.className = 'restaurant__img lazy'
  image.alt = `Restaurant image for ${restaurant.name}.`
  image.src = DBHelper.imageUrlForRestaurant(restaurant)
  li.append(image)

  const header = document.createElement('div')
  const name = document.createElement('h2')
  name.innerHTML = restaurant.name
  name.className = 'restaurant__header'
  const favoriteButton = document.createElement('button')
  favoriteButton.className = 'restaurant__header header--star'
  if (restaurant.favorite === 'true') {
    favoriteButton.innerHTML = '&#9733'
    favoriteButton.setAttribute('aria-label', `Remove ${restaurant.name} from favorites`)
  } else {
    favoriteButton.innerHTML = '&#9734'
    favoriteButton.setAttribute('aria-label', `Add ${restaurant.name} to favorites`)
  }
  header.append(name, favoriteButton)
  li.append(header)

  const neighborhood = document.createElement('p')
  neighborhood.innerHTML = restaurant.neighborhood
  neighborhood.className = 'restaurant__neighborhood'
  li.append(neighborhood)

  const address = document.createElement('p')
  address.innerHTML = restaurant.address
  address.className = 'restaurant__address'
  li.append(address)

  const more = document.createElement('a')
  more.innerHTML = 'View Details'
  more.className = 'restaurant__more'
  more.setAttribute('aria-label', 'details button')
  more.href = DBHelper.urlForRestaurant(restaurant)
  li.append(more)

  return li
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
