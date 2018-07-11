# Computational narrative

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 1. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws-p1)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
  - [Map](#map)
- [Responsive design](#responsive-design)
  - [Simple structure and styling](#simple-structure-and-styling)
  - [CSS Grid](#css-grid)
- [Accessibility](#accessibility)
- [Offline availability](#offline-availability)

## Getting started

- Forked and cloned the repo
- Created a `dev` branch
- Started a local HTTP server in the directory

  ```sh
  cd computing/udacity-google-mws-p1
  python3 -m http.server 8000
  ```

### Map

- Signed up for [Mapbox](https://www.mapbox.com).
- [Leaflet](https://leafletjs.com/).

## Responsive design

### Simple structure and styling

- I worked on one page at a time.
- I started by cleaning up the HTML structure.
- I organized the CSS and worked on some simple styling changes.
  - I added `border-top-left-radius: 1rem;` to `img` to achieve the rounded corner as shown in the mockup.
  - I modified some of the colors and text effects to match the header to the mockup, and style the header and footer consistently.
  - Here's how it's looking now:

    ![Screen shot after adjusting HTML and CSS](img/Screen-shot-2018-07-06-at-21.18.15.png)

- Git commit at this point: Style homepage header and footer 83fe5d7

### CSS Grid

- I opted to use CSS Grid for layout and responsive design.
- I started with the [Wes Bos CSS grid course](https://cssgrid.io/).
- I also reviewed the [MDN CSS Layout Guide](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout).
- I changed the restaurant list from an unordered list to a container div, then styled the container into a grid.
- I changed this line in *index.html*:

  ```html
  <ul id="restaurant-list"></ul>
  ```

- To this:

  ```html
  <div class="container" id="restaurant-list"></div>
  ```

- And then styled the container with CSS:

  ```css
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 0.2rem;
    border: var(--border);
  }
  ```

- This results in a nice grid for the restaurants:

  ![Screen shot of restaurant list with CSS grid](img/Screen-shot-2018-07-06-at-22.57.25.png)

- Git commit: Add CSS Grid for homepage restaurants bd154fd
- Next, I made the restaurant grid responsive.
  - Use auto-fill and minmax for responsive reflowing
  - Trim unneccessary CSS
  - Organize CSS, img, and JS in /assets
- Git commit: Responsively reflow restaurant grid
- Next, I formatted the entire page as a grid, and made the restaurant list a nested grid.

#### TODO

- [x] grid container
- [ ] Set height of divs: header 2, map 5, filter 1, restaurants remainder, footer 1
- [ ] map minmax
- [x] create three columns
- [x] use `fr` to lay out columns
- [ ] Move both filter dropdowns onto same new row
- [ ] Fix spacing in restaurant grid so the restaurants don't overlap
- [ ] Rewrite `fillRestaurantsHTML` and `createRestaurantHTML` in *main.js* to create `div`s instead of `ul`/`li`?

## Accessibility

## Offline availability

[(Back to top)](#top)
