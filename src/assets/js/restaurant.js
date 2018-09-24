// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JavaScript for restaurant pages ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Add restaurant name to breadcrumb navigation menu
const fillBreadcrumb = (restaurant = self.restaurant) => {
  try {
    const breadcrumb = document.getElementById('breadcrumb')
    breadcrumb.className = 'breadcrumb'
    const path = document.createElement('span')
    path.textContent = restaurant.name
    path.className = 'breadcrumb__path'
    breadcrumb.appendChild(path)
  } catch (e) {
    throw Error(e)
  }
}

// Create restaurant HTML and add to the webpage
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  try {
    const div = document.getElementById('restaurant-div')
    // Create header
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
    // Add restaurant details
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
    // Add map below restaurant details
    const map = document.createElement('div')
    map.className = 'map'
    map.id = 'map'
    map.role = 'application'
    // Add header for reviews section
    const reviewsHeader = document.createElement('div')
    reviewsHeader.className = 'restaurant__header'
    const title = document.createElement('h3')
    title.classList.add('restaurant__header', 'header--reviews')
    title.textContent = 'Reviews'
    const addReview = document.createElement('a')
    addReview.className = 'header--link'
    addReview.id = 'addReview'
    addReview.textContent = 'Add'
    const closeReview = document.createElement('a')
    closeReview.classList.add('header--link', 'd-none')
    closeReview.id = 'closeReview'
    closeReview.textContent = 'Close'
    reviewsHeader.append(title, addReview, closeReview)
    // Add reviews
    const reviewsDiv = document.createElement('div')
    reviewsDiv.className = 'reviews'
    let reviews = self.restaurant.reviews
    if (reviews) {
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
      })
    } else {
      const noReviews = document.createElement('p')
      noReviews.textContent = 'No reviews yet!'
      reviewsDiv.appendChild(noReviews)
    }
    div.append(header, detailsDiv, map, reviewsHeader, reviewsDiv)

    // Overlay for adding review
    const overlayDiv = document.getElementById('overlay-div')
    const overlayTitle = document.createElement('h3')
    overlayTitle.textContent = `Submit review for ${restaurant.name}`
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
    submitBtn.id = 'submitBtn'
    submitBtn.className = 'restaurant__more'
    submitBtn.textContent = 'Submit review'
    submitBtn.addEventListener('click', () => DBHelper.postReview(restaurant))
    overlayDiv.append(overlayTitle, nameDiv, ratingDiv, commentsDiv, submitBtn)
    reviewsHeader.append(overlayDiv)
    addReview.addEventListener('click', () => {
      overlayDiv.classList.toggle('d-none')
      addReview.classList.toggle('d-none')
      closeReview.classList.toggle('d-none')
    })
    closeReview.addEventListener('click', () => {
      overlayDiv.classList.toggle('d-none')
      addReview.classList.toggle('d-none')
      closeReview.classList.toggle('d-none')
    })
  } catch (e) {
    throw Error(e)
  }
}

// Get current restaurant from page URL
const fetchRestaurantFromURL = (callback) => {
  try {
    const id = window.location.href.replace(/.*=/g, '')
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
        fillBreadcrumb()
        fillRestaurantHTML()
        callback(null, restaurant)
      })
    }
  } catch (e) {
    throw Error(e)
  }
}

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
      DBHelper.mapMarker(self.restaurant, self.newMap)
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  DBHelper.createDatabase()
  initMap()
})
