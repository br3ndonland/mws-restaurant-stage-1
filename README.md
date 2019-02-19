# README

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

[![license](https://img.shields.io/badge/license-MIT-blue.svg?longCache=true&style=for-the-badge)](https://choosealicense.com/)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Table of Contents <!-- omit in toc -->

- [Description](#description)
- [Repository contents](#repository-contents)
- [Projects](#projects)
  - [Project 1](#project-1)
  - [Project 2](#project-2)
    - [Data API in project 2](#data-api-in-project-2)
    - [Web server in project 2](#web-server-in-project-2)
    - [IndexedDB](#indexeddb)
    - [Performance in project 2](#performance-in-project-2)
  - [Project 3](#project-3)
    - [Data API in project 3](#data-api-in-project-3)
    - [Web server in project 3](#web-server-in-project-3)
    - [Favorites and reviews](#favorites-and-reviews)
    - [Performance in project 3](#performance-in-project-3)

## Description

Mobile Web Specialists are trained in building **Progressive Web Apps** (PWAs, see [Google](https://developers.google.com/web/progressive-web-apps/), [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive), and [Medium](https://medium.com/javascript-scene/native-apps-are-doomed-ac397148a2c0)). PWAs are like a combination of web apps and native apps, improving on the best features of each. I learned how to build PWAs in the [Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024).
I was awarded a scholarship to this Nanodegree program after completing the [Grow with Google](https://grow.google/) Udacity challenge course, intermediate web developer track, in the top 10% of 10,000 students. Materials from the challenge course are available in my [udacity-google repo](https://github.com/br3ndonland/udacity-google).

![Udacity Google Mobile Web Specialist scholarship email](info/img/udacity-google-mws-award.png)

In this Nanodegree program, I built a restaurant reviews PWA that displays restaurant locations and info. The app provides offline access through the Service Worker, IndexedDB, and web manifest files. Users can add favorites and reviews for restaurants. If changes are made offline, they sync to the web server when network access is restored.

![Screenshot of restaurant reviews app homepage on desktop](info/img/udacity-google-mws-iPhone.png)

## Repository contents

- [info/](info): Project documentation, reviews, and computational narratives.
- [lessons/](lessons): Lesson notes, divided into subdirectories for each part of the Nanodegree program.
- [src/](src): Application source files.
  - [assets](src/assets)
    - [css](src/assets/css)
      - [styles.css](src/assets/css/styles.css): Styles used in application. Features CSS Grid, variables ("custom properties"), and BEM (Block Element Modifier).
    - [img](src/assets/img): Images used in application.
    - [js](src/assets/js)
      - [dbhelper.js](src/assets/js/dbhelper.js): JavaScript class constructor with static methods to serve data to the app.
      - [index.js](src/assets/js/index.js): JavaScript for application homepage.
      - [restaurant.js](src/assets/js/restaurant.js): JavaScript for restaurant details page.
  - [data](src/data)
    - [restaurants.json](src/data/restaurants.json): Restaurant data in JSON format.
- [.babelrc](.babelrc): Configuration file for [Babel](https://babeljs.io/).
- [.eslintrc](.eslintrc): Configuration file for [ESLint](https://eslint.org/). I use [JavaScript Standard Style](https://standardjs.com/) with the [vscode extension](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs). The ESLint file is used by [Codacy](https://www.codacy.com/) for continuous integration of code quality reviews.
- [.gitignore](.gitignore): Instructions to Git to exclude certain files from commits.
- [.prettierrc](.prettierrc): Configuration file for [Prettier](https://prettier.io/) autoformatter.
- [index.html](src/index.html): Application homepage.
- [manifest.webmanifest](src/manifest.webmanifest): Web app manifest. Communicates app metadata to the browser and makes the app installable. The *.webmanifest* extension has been officially recognized in the [W3C spec](https://w3c.github.io/manifest/). See [Google](https://developers.google.com/web/fundamentals/web-app-manifest/) and [MDN](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive/Installable_PWAs) for more.
- [restaurant.html](src/restaurant.html): Restaurant details page.
- [sw.js](src/sw.js): Service Worker for offline caching.
- [README.md](README.md): This file, a concise description of the repository.

## Projects

### Project 1

Project 1 had three parts:

1. **Responsive design**
2. **Accessibility features**
3. **Offline capability**

Run a local HTTP server to test the application. There are multiple pages, so it is helpful to run a server instead of directly opening the HTML in a browser.

  ```sh
  cd <PATH>
  python3 -m http.server 8000
  ```

Browse to [localhost:8000](http://localhost:8000) to see the app.

### Project 2

#### Data API in project 2

In project 2, we use a Node server to deliver the data API.

- Clone the [server repo](https://github.com/udacity/mws-restaurant-stage-2) into a separate directory.
- Start the data server:

  ```sh
  cd <PATH>
  npm i
  npm i sails -g
  node server
  ```

#### Web server in project 2

- Start the web server in the *src/* subdirectory.

  ```sh
  cd <PATH>/src
  python3 -m http.server 8000
  ```

- The app calls the data server on port `1337`.
- The data server actually fetches the data from the same place as before, *data/restaurants.json*, but it presents the data as an API instead of just a JSON file.
- Browse to [localhost:8000](http://localhost:8000) to see the app.

#### IndexedDB

- The app stores the JSON data in IndexedDB for offline access.

#### Performance in project 2

We were required to meet [Lighthouse](https://developers.google.com/web/tools/lighthouse/) performance benchmarks for progressive web apps:

- **Performance** ≥70
- **Progressive Web App** ≥90
- **Accessibility** ≥90

My app's Lighthouse scores:

- **Performance** 94
- **Progressive Web App** 92
- **Accessibility** 100

### Project 3

#### Data API in project 3

We use a different Node server to deliver the data API.

- Clone the [project 3 server repo](https://github.com/udacity/mws-restaurant-stage-3) into a separate directory.
- Start the data server:

  ```sh
  cd path/to/data/server
  npm i
  npm i sails -g
  node server
  ```

#### Web server in project 3

- Start the app's web server in the *src/* subdirectory.

  ```sh
  cd path/to/app/src
  python3 -m http.server 8000
  ```

- Browse to [localhost:8000](http://localhost:8000) to see the app.

#### Favorites and reviews

- Users can now favorite restaurants and add reviews.
- Favorites and reviews are saved to IndexedDB, then synced to the data server when network access is present.

#### Performance in project 3

We were required to meet [Lighthouse](https://developers.google.com/web/tools/lighthouse/) performance benchmarks for progressive web apps:

- **Performance** ≥90
- **Progressive Web App** ≥90
- **Accessibility** ≥90

My app's Lighthouse scores:

- **Performance** 92
- **Progressive Web App** 92
- **Accessibility** 100