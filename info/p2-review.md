# Project 2 code review

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 2. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Submission 1](#submission-1)
  - [Notes to reviewer 1](#notes-to-reviewer-1)
  - [Reviewer comments 1](#reviewer-comments-1)
  - [Code review 1](#code-review-1)

## Submission 1

### Notes to reviewer 1

Thanks for your review!

### Reviewer comments 1

Congratulations! You've completed all the requirements of the project. :sunflower:

I left some comments to improve your code, please take a look at my `CODE COMMENT`.

Good luck and happy coding.

Phuc Tran from Udacity.

### Code review 1

- *src/*
  - *assets/*
    - *idb.js*
      > [Dexie](http://dexie.org/) was written to be straightforward and easy to learn. If you've ever had to work with native IndexedDB then you'll certainly appreciate Dexie's concise API.
    - *index.js*
      > You should add aria-label to View Details Button to provide a better description of the button, otherwise, the Screen Reader will speak View Details for all the buttons
    - *restaurant.js*
      > [LazyLoad](https://www.andreaverlicchi.eu/lazyload/) is a fast, lightweight and flexible script that speeds up your web application by loading images as they enter the viewport. It's written in plain "vanilla" JavaScript, uses Intersection Observers, and supports responsive images. It's also SEO-friendly and it has some other notable features.
  - *restaurant.html*
    > AWESOME: Great work in using navigation role for the Breadcrumb
  - *sw.js*
    > SUGGESTION: You don't need to handle restaurant.html manually, you only need to use `ignoreSearch` in `match` function. Check out the ignoreSearch in the [external resource below](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match) to get it working.