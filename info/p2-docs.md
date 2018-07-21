# Project docs

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 2. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Project overview](#project-overview)
  - [Description](#description)
  - [Specification](#specification)
  - [Requirements](#requirements)
- [Project instructions](#project-instructions)
  - [Steps to complete](#steps-to-complete)
  - [Submission instructions](#submission-instructions)
- [Project rubric](#project-rubric)
  - [Application data and offline use](#application-data-and-offline-use)
  - [Responsive design and accessibility](#responsive-design-and-accessibility)
  - [Performance](#performance)

## Project overview

### Description

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage Two**, you will take the responsive, accessible design you built in **Stage One** and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

### Specification

You will be provided code for a Node development server and a README for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your **Stage One** project code.

The core functionality of the application will not change for this stage. Only the source of the data will change. You will use the `fetch()` API to make requests to the server to populate the content of your Restaurant Reviews app.

### Requirements

**Use server data instead of local memory** In the first version of the application, all of the data for the restaurants was stored in the local application. You will need to change this behavior so that you are pulling all of your data from the server instead, and using the response data to generate the restaurant information on the main page and the detail page.

**Use IndexedDB to cache JSON responses** In order to maintain offline use with the development server you will need to update the service worker to store the JSON received by your requests using the IndexedDB API. As with **Stage One**, any page that has been visited by the user should be available offline, with data pulled from the shell database.

**Meet the minimum performance requirements** Once you have your app working with the server and working in offline mode, you’ll need to measure your site performance using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

Lighthouse measures performance in four areas, but your review will focus on three:

- **Progressive Web App** score should be at 90 or better.
- **Performance** score should be at 70 or better.
- **Accessibility** score should be at 90 or better.

You can audit your site's performance with Lighthouse by using the Audit tab of Chrome Dev Tools.

## Project instructions

### Steps to complete

1. Fork and clone the [server repository](https://github.com/udacity/mws-restaurant-stage-2). You’ll use this development server to develop your project code.
2. Change the data source for your restaurant requests to pull JSON from the server, parse the response and use the response to generate the site UI.
3. Cache the JSON responses for offline use by using the IndexedDB API.
4. Follow the recommendations provided by Lighthouse to achieve the required performance targets.
5. Submit your project code for review.

### Submission instructions

Make sure your code adheres to our HTML, CSS, JavaScript, and Git style guidelines.

- [Udacity's HTML Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/index.html)
- [Udacity's CSS Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/css.html)
- [Udacity's JavaScript Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)
- [Udacity's Git Style Guide](https://udacity.github.io/git-styleguide/)

We recommend using Git from the very beginning. Make sure to commit often and to use well-formatted commit messages that conform to our [guidelines](https://udacity.github.io/git-styleguide/).

## Project rubric

Your project will be evaluated by a Udacity code reviewer according to the [Restaurant Reviews: Stage 2 rubric](https://review.udacity.com/#!/rubrics/1131/view).

### Application data and offline use

- [ ] Application Data Source
  - [ ] The client application should pull restaurant data from the development server, parse the JSON response, and use the information to render the appropriate sections of the application UI.
- [ ] Offline Use
  - [ ] The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline.

### Responsive design and accessibility

- [ ] Responsive Design
  - [ ] The application maintains a responsive design on mobile, tablet and desktop viewports.
- [ ] Accessibility
  - [ ] The application retains accessibility features from the Stage 1 project.
  - [ ] Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly.

### Performance

- [ ] Lighthouse targets for each category exceed:
  - [ ] Progressive Web App: >90
  - [ ] Performance: >70
  - [ ] Accessibility: >90