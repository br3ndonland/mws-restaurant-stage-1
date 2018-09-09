# Project docs

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 3. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Project overview](#project-overview)
  - [Description](#description)
  - [Specification](#specification)
  - [Requirements](#requirements)
- [Project instructions](#project-instructions)
- [Project rubric](#project-rubric)
  - [Functionality](#functionality)
  - [Responsive design and accessibility](#responsive-design-and-accessibility)
  - [Performance](#performance)

## Project overview

### Description

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage Three**, you will take the connected application you yu built in **Stage One** and **Stage Two** and add additional functionality. You will add a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. Finally, you’ll work to optimize your site to meet even stricter performance benchmarks than the previous project, and test again using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

### Specification

You will be provided code for an updated [Node development server](https://github.com/udacity/mws-restaurant-stage-3) and a README for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your **Stage Two** project code.

> This server is *different* than the server from stage 2, and has added capabilities. Make sure you are using the **Stage Three** server as you develop your project. Connecting to this server is the same as with **Stage Two**, however.

You can find the documentation for the new server in the README file for the server.

Now that you’ve connected your application to an external database, it’s time to begin adding new features to your app.

### Requirements

**Add a form to allow users to create their own reviews:** In previous versions of the application, users could only read reviews from the database. You will need to add a form that adds new reviews to the database. The form should include the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form should update the server when the user is online.

**Add functionality to defer updates until the user is connected:** If the user is not online, the app should notify the user that they are not connected, and save the users' data to submit automatically when re-connected. In this case, the review should be deferred and sent to the server when connection is re-established (but the review should still be visible locally even before it gets to the server.)

**Meet the new performance requirements:** In addition to adding new features, the performance targets you met in **Stage Two** have tightened. Using Lighthouse, you’ll need to measure your site performance against the new targets.

- **Progressive Web App** score should be at 90 or better.
- **Performance** score should be at **90** or better.
- **Accessibility** score should be at 90 or better.

## Project instructions

Steps to complete

1. Fork and clone the [server repository](https://github.com/udacity/mws-restaurant-stage-3). You’ll use this development server to develop your project code.
2. Add a form to allow users to submit their own reviews.
3. Add functionality to defer submission of the form until connection is re-established.
4. Follow the recommendations provided by Lighthouse to achieve the required performance targets.
5. Submit your project code for review.

## Project rubric

Restaurant Reviews: Stage 3

### Functionality

- [ ] User Interface
  - [ ] Users are able to mark a restaurant as a favorite, this toggle is visible in the application. A form is added to allow users to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.
- [ ] Offline Use
  - [ ] The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. User is able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.

### Responsive design and accessibility

- [ ] Responsive Design
  - [ ] The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.
- [ ] Accessibility
  - [ ] The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form.

### Performance

- [ ] Site Performance
  - [ ] Lighthouse targets for each category exceed:
    - [ ] Progressive Web App: >90
    - [ ] Performance: >90
    - [ ] Accessibility: >90