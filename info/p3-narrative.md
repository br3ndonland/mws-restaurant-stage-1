# Computational narrative

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 3. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
- [Favorites](#favorites)
  - [Favorite button](#favorite-button)
  - [Favorite toggle](#favorite-toggle)
- [Reviews](#reviews)
  - [User interface for reviews](#user-interface-for-reviews)
  - [Review submission](#review-submission)
- [Performance](#performance)

## Getting started

- Same strategy for the data server as in project 2, but it comes from a new repo.
- Cloned the [project 3 server repo](https://github.com/udacity/mws-restaurant-stage-3) into a separate directory.
- I watched the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok). Note Doug's use of [ternary conditional operators](https://en.wikipedia.org/wiki/%3F:) `?:`.

## Favorites

### Favorite button

- I created a favorite button with *index.js* in the `createRestaurantHTML()` function.
  - I used the HTML unicode character [white star `&#9734;`](https://unicode-table.com/en/2606/).
  - I included an if/then statement, in *dbhelper.js*, *index.js*, and *restaurant.js*, to change to the [black star `&#9733`](https://unicode-table.com/en/2605/) when the restaurant is favorited.

### Favorite toggle

- Now that I have a favorite button, I need to use it to change the `is_favorite` value in the restaurant data. The project 3 data server provides a `PUT` endpoint at `http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true`.
- I started by creating a `toggleFavorite()` function in *dbhelper.js*, and getting it working over the network.
  - I set up a `fetch` query using the data server `PUT` endpoint. The `PUT` method updates the JSON data on the server. I used the [ternary conditional operators](https://en.wikipedia.org/wiki/%3F:) `?:`, as shown in the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok). The `?:` works like if/then, so if the restaurant JSON has `"is_favorite": "true",` the query will change it to `"is_favorite": "false",`.
  - Boolean vs. string: `true` and `false` can either be interpreted as Boolean (without quotes) or string (with quotes). See the [Doug Brown project 3 walkthrough](https://www.youtube.com/watch?v=a7i0U1aCBok) 0.15.00. I kept them as strings.
  - I included the same if/then statement from *index.js* and *restaurant.js* to change to the [black star `&#9733`](https://unicode-table.com/en/2605/) when the restaurant is favorited. I need it in all three files because I need to create the star when the page is rendered, and also change the star when the favorite status changes.
  - Here's how the online-only function looked initially:

    ```js
    static async toggleFavorite (restaurant) {
      try {
        const query = fetch(`${DBHelper.DATABASE_URL}/${restaurant.id}/?${restaurant.is_favorite === 'true' ? 'is_favorite=false' : 'is_favorite=true'}`, {method: 'PUT'})
        const response = await (await query).json()
        restaurant.is_favorite = response.is_favorite
        const favoriteButton = document.getElementById(`restaurant-${restaurant.id}`)
        console.log(`This is restaurant ID ${restaurant.id}`)
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
    ```

- Next, I need to check for IndexedDB and put changes there.

## Reviews

### User interface for reviews

I plan to use a [Bootstrap-style modal](https://getbootstrap.com/docs/4.1/components/modal/).

### Review submission

## Performance

My app was already meeting the performance benchmarks during project 2.
