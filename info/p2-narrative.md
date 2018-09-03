# Computational narrative

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 2. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
- [Data](#data)
  - [Server](#server)
  - [Use IndexedDB to cache JSON responses](#use-indexeddb-to-cache-json-responses)
- [Accessibility](#accessibility)
- [Performance](#performance)
  - [Building and bundling](#building-and-bundling)
## Getting started

- As usual, I copied the project documentation and rubric HTML from the Udacity classroom, pasted it into [Turndown](https://domchristie.github.io/turndown/), and saved it in Markdown files.
- We don't need to add the project 2 repo to our project. The project 2 repo is just a server that we use to fetch data.
- I deleted my old `dev` branch, and created a new `dev` branch. Previously, you can see that I jumped over the "Submit project 1" commit back onto the old `dev` branch. This is why GitHub prompts users to delete branches after merging.

## Data

### Server

#### Server setup

- The first step is to set up the development server for the restaurant data.
- The project uses [Sails](https://sailsjs.com/), a Node.js MVC framework.
- I got the development server up and running:

  ```sh
  cd udacity-google-mws-p2
  npm i
  npm i sails -g
  node server
  ```

- The server runs on port 1337 (haha).
- I could now `curl` data from the server

  ```sh
  curl "http://localhost:1337/restaurants"
  curl "http://localhost:1337/restaurants/3"
  ```

#### Server usage

- The next step is to reconfigure the app to fetch data from the server's API.
- I changed the port in *dbhelper.js* to `1337` to work with the server.

  ```js
  static get DATABASE_URL () {
    const port = 1337
    return `http://localhost:${port}/restaurants`
  }
  ```

### Use IndexedDB to cache JSON responses

- I used [IndexedDB Promised](https://github.com/jakearchibald/idb) from Jake Archibald.
- *TODO:* import idb

## Accessibility

## Performance

### Building and bundling

## TODO

- [Udacity MWS Darren walkthrough](https://www.youtube.com/watch?v=S7UGidduflQ)

### Offline

### Performance

- [ ] Images
  - [ ] [webp](https://developers.google.com/speed/webp/) images?
- [ ] Accessibility
  - [ ] Leaflet: just override the map `<a>` with a darker color and you should get it back, that was all I had to do
- [ ] Lighthouse
  - [ ] Audits tab in Chrome
  - [ ] [Check Lighthouse score by CI](https://medium.freecodecamp.org/how-to-make-sure-your-progressive-web-app-keeps-its-lighthouse-audit-score-4c11cf514e1a)?
- [ ] Google Maps static API?
- [ ] Lazy loading?
- [ ] Build tools?