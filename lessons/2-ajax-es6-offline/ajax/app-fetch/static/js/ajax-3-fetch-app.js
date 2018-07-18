(function () {
  const form = document.querySelector('#search-form')
  const searchField = document.querySelector('#search-keyword')
  let searchedForText
  const responseContainer = document.querySelector('#response-container')
  // Listen for, and act on, form submissions
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    responseContainer.innerHTML = ''
    searchedForText = searchField.value
    // Query Unsplash API
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
      method: 'GET',
      headers: {
        Authorization: 'Client-ID paste_access_key_here'
      }
    }).then(r => r.json())
      .then(addImage)
      .catch(e => requestError(e, 'image'))
    // Query NYT article search API
    fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=paste_api_key`)
      .then(r => r.json())
      .then(addArticles)
      .catch(e => requestError(e, 'article'))
    function addImage (data) {
      let htmlContent = ''
      if (data && data.results && data.results.length > 1) {
        const firstImage = data.results[0]
        htmlContent = `<figure>
        <img src="${firstImage.urls.small}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`
      } else {
        htmlContent = 'Unfortunately, no image was returned for your search.'
      }
      responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
    }
    function addArticles (data) {
      let htmlContent = ''
      if (data.response && data.response.docs && data.response.docs.length > 1) {
        const articles = data.response.docs
        htmlContent = '<ul>' + articles.map(article => `<li class="article">
          <h2><a href ="${article.web_url}">${article.headline.main}</a></h2>
          <p>${article.snippet}</p></li>`)
          .join('') + '</ul>'
      } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>'
      }
      responseContainer.insertAdjacentHTML('beforeend', htmlContent)
    }
    function requestError (e, part) {
      console.log(e)
      responseContainer.insertAdjacentHTML('beforeend',
        `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`)
    }
  })
})()
