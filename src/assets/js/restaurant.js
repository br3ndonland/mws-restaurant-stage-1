// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JavaScript for restaurant pages ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Register service worker
if ('serviceWorker' in navigator) {
  console.log(`Registering Service Worker.`)
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log(`Service Worker registration successful for ${reg.scope}`)
  }).catch(e => {
    console.log(`Registration failed with error ${e}`)
  })
}

// Initialize map as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  DBHelper.createDatabase()
  initMap()
})

// Initialize leaflet map
const initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      console.error(error)
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
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
      fillBreadcrumb()
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap)
    }
  })
}

// Add restaurant name to breadcrumb navigation menu
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb')
  breadcrumb.className = 'breadcrumb'
  const path = document.createElement('span')
  path.textContent = restaurant.name
  path.className = 'breadcrumb__path'
  breadcrumb.appendChild(path)
}

// Get a parameter by name from page URL
const getParameterByName = (name, url) => {
  if (!url) { url = window.location.href }
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) { return null }
  if (!results[2]) { return '' }
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Get current restaurant from page URL
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched
    callback(null, self.restaurant)
    return
  }
  const id = getParameterByName('id')
  if (!id) { // no id found in URL
    const error = 'No restaurant id in URL'
    callback(null, error)
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant
      self.restaurant.reviews = restaurant.reviews
      if (!restaurant) {
        console.error(error)
        return
      }
      fillRestaurantHTML()
      callback(null, restaurant)
    })
  }
}

// Create restaurant HTML and add to the webpage
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const div = document.getElementById('restaurant-div')

  const image = document.createElement('img')
  image.className = 'restaurant__img lazy'
  image.alt = `Restaurant image for ${restaurant.name}`
  image.src = DBHelper.imageUrlForRestaurant(restaurant)
  div.append(image)

  const header = document.createElement('div')
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
  div.append(header)

  const cuisine = document.createElement('p')
  cuisine.textContent = restaurant.cuisine_type
  div.append(cuisine)

  const address = document.createElement('p')
  address.textContent = restaurant.address
  address.className = 'restaurant__address'
  div.append(address)

  const map = document.createElement('div')
  map.className = 'map'
  map.id = 'map'
  map.role = 'application'
  div.append(map)

  const hours = document.createElement('table')
  if (restaurant.operating_hours) {
    const operatingHours = self.restaurant.operating_hours
    for (let key in operatingHours) {
      const row = document.createElement('tr')
      const day = document.createElement('td')
      day.textContent = key
      row.appendChild(day)
      const time = document.createElement('td')
      time.textContent = operatingHours[key]
      row.appendChild(time)
      hours.appendChild(row)
    }
  }
  div.append(hours)

  const reviewsDiv = document.createElement('div')
  reviewsDiv.className = 'reviews'
  div.append(reviewsDiv)
  fillReviewsHTML()
}

// Create reviews HTML and add to webpage
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const reviewsDiv = document.querySelector('.reviews')
  const reviewsHeader = document.createElement('div')
  const title = document.createElement('h3')
  title.className = 'restaurant__header header--reviews'
  title.textContent = 'Reviews'
  const addReview = document.createElement('a')
  addReview.className = 'header--link'
  addReview.textContent = 'Add/edit'
  reviewsHeader.appendChild(title)
  reviewsHeader.appendChild(addReview)
  reviewsDiv.appendChild(reviewsHeader)

  if (!reviews) {
    const noReviews = document.createElement('p')
    noReviews.textContent = 'No reviews yet!'
    reviewsDiv.appendChild(noReviews)
    return
  }
  reviews.forEach(review => {
    reviewsDiv.appendChild(createReviewHTML(review))
  })
}

const createReviewHTML = (review) => {
  const li = document.createElement('div')
  li.className = 'review'

  const name = document.createElement('h4')
  name.textContent = review.name
  name.className = 'review__name'
  li.appendChild(name)

  const date = document.createElement('p')
  date.textContent = review.date
  date.className = 'review__date'
  li.appendChild(date)

  const rating = document.createElement('p')
  rating.textContent = `Rating: ${review.rating}`
  rating.className = 'review__rating'
  li.appendChild(rating)

  const comments = document.createElement('blockquote')
  comments.textContent = review.comments
  comments.className = 'review__comments'
  li.appendChild(comments)

  return li
}
