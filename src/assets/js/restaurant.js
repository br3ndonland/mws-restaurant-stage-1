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
        zoom: 13,
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
      DBHelper.mapMarker(self.restaurant, self.newMap)
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

  const header = document.createElement('div')
  const name = document.createElement('h2')
  name.textContent = restaurant.name
  name.className = 'restaurant__header'
  const favoriteButton = document.createElement('button')
  favoriteButton.classList.add('restaurant__header', 'header--star')
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
  detailsDiv.className = 'restaurant__info'
  const infoDiv = document.createElement('div')
  const cuisine = document.createElement('p')
  cuisine.className = 'restaurant__cuisine'
  cuisine.textContent = restaurant.cuisine_type
  const neighborhood = document.createElement('p')
  neighborhood.textContent = restaurant.neighborhood
  neighborhood.className = 'restaurant__neighborhood'
  const address = document.createElement('p')
  address.textContent = restaurant.address
  address.className = 'restaurant__address'
  infoDiv.append(cuisine, neighborhood, address)
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
  const image = document.createElement('img')
  image.classList.add('restaurant__img', 'lazy')
  image.alt = `Restaurant image for ${restaurant.name}`
  image.src = DBHelper.imageUrlForRestaurant(restaurant)
  detailsDiv.append(infoDiv, hours, image)

  const map = document.createElement('div')
  map.className = 'map'
  map.id = 'map'
  map.role = 'application'

  const reviewsHeader = document.createElement('div')
  reviewsHeader.className = 'restaurant__header'
  const title = document.createElement('h3')
  title.classList.add('restaurant__header', 'header--reviews')
  title.textContent = 'Reviews'
  const addReview = document.createElement('a')
  addReview.className = 'header--link'
  addReview.textContent = 'Add/edit'
  reviewsHeader.appendChild(title)
  reviewsHeader.appendChild(addReview)

  const reviewsDiv = document.createElement('div')
  reviewsDiv.className = 'reviews'
  // Fill reviews HTML
  let reviews = self.restaurant.reviews
  if (!reviews) {
    const noReviews = document.createElement('p')
    noReviews.textContent = 'No reviews yet!'
    reviewsDiv.appendChild(noReviews)
    return
  }
  reviews.forEach(review => {
    const reviewDiv = document.createElement('div')
    reviewDiv.className = 'review'
    const name = document.createElement('h4')
    name.textContent = review.name
    name.className = 'review__name'

    const date = document.createElement('p')
    date.textContent = review.date
    date.className = 'review__date'

    const rating = document.createElement('p')
    rating.textContent = `Rating: ${review.rating}`
    rating.className = 'review__rating'

    const comments = document.createElement('blockquote')
    comments.textContent = review.comments
    comments.className = 'review__comments'

    reviewDiv.append(name, date, rating, comments)
    reviewsDiv.appendChild(reviewDiv)
    return reviewDiv
  })
  div.append(header, detailsDiv, map, reviewsHeader, reviewsDiv)

  // Overlay for adding or editing review
  const overlayDiv = document.getElementById('overlay-div')
  // Set overlay content
  const nameDiv = document.createElement('div')
  const reviewName = document.createElement('h4')
  reviewName.textContent = 'Your name'
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.id = 'reviewName'
  nameDiv.append(reviewName, nameInput)
  const ratingDiv = document.createElement('div')
  const ratingTitle = document.createElement('h4')
  ratingTitle.textContent = 'Rating'
  const ratingSelect = document.createElement('select')
  ratingSelect.id = 'reviewRating'
  const ratings = [1, 2, 3, 4, 5]
  for (const rating of ratings) {
    let option = document.createElement('option')
    option.value = `${rating}`
    option.textContent = rating
    ratingSelect.append(option)
  }
  ratingDiv.append(ratingTitle, ratingSelect)
  const commentsDiv = document.createElement('div')
  const commentsTitle = document.createElement('h4')
  commentsTitle.textContent = 'Comments'
  const commentsText = document.createElement('textarea')
  commentsText.classList.add('overlay__textarea')
  commentsText.id = 'reviewComment'
  commentsText.rows = '10'
  commentsDiv.append(commentsTitle, commentsText)
  const submitBtn = document.createElement('button')
  submitBtn.className = 'restaurant__more'
  submitBtn.textContent = 'Submit review'
  /*
  submitBtn.addEventListener('click', () => {
    // send to db
    // clear form
  })
   */
  overlayDiv.append(nameDiv, ratingDiv, commentsDiv, submitBtn)
  reviewsHeader.append(overlayDiv)
  // Toggle visibility when addReview link is clicked
  addReview.addEventListener('click', () => overlayDiv.classList.toggle('d-none'))
}
