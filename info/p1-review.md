# Project 1 code review

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Project 1. Restaurant Reviews app](https://github.com/br3ndonland/udacity-google-mws)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Submission 1](#submission-1)
  - [Notes to reviewer 1](#notes-to-reviewer-1)
  - [Reviewer comments 1](#reviewer-comments-1)
  - [Code review 1](#code-review-1)
- [Submission 2](#submission-2)
  - [Notes to reviewer 2](#notes-to-reviewer-2)
  - [Reviewer comments 2](#reviewer-comments-2)
  - [Code review 2](#code-review-2)

## Submission 1

### Notes to reviewer 1

Thanks for your time and feedback!

### Reviewer comments 1

> Well done! :star: You have done a great job on this project especially considering it your first submission! :fire: I really appreciate the efforts you have put into the app ! :clap::clap:
> Go through the code review, minor changes are required :+1:
> Keep Learning ! :smiley: :bell:
> Stay Udacious ! :udacious:

#### Responsive Design

> Great! All the content is responsive in all viewports! :clap::clap:

#### Accessibility

> All the images must have appropriate alternate text. Go through the code review, some changes are required.
>
> Appropriate ARIA roles must be defined for non semantic elements. To know more about aria roles refer to below-mentioned link.
>
> [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

#### Offline Availability

> Great work with service worker! :fire:

### Code review 1

#### restaurant.html 1

> AWESOME: Great work adding viewports to make the pages responsive :clap: :clap:
>
> REQUIRED: Appropriate ARIA roles must be added in breadcrumb.
>
> REQUIRED: Add aria roles in map div

#### sw.js 1

> AWESOME: Great work implementing service worker :fire:

#### assets/css/styles.css 1

> AWESOME: Great work with CSS and styling :boom: :boom:

#### assets/js/main.js and assets/js/restaurant_info.js 1

> REQUIRED: Appropriate alternate text must be added. Images must have the restaurant name as alternate text.
>
> You may add like this: `image.alt = restaurant.name + " Restaurant"`

## Submission 2

### Notes to reviewer 2

Thank you for your thorough and helpful review.

- Included restaurant name in alt text with ES6 template literal
- Added ARIA roles to breadcrumb and map

### Reviewer comments 2

> Great work and great start⭐️⭐️
>
> I noticed that you worked hard and with dedication on this project.
>
> Congratulations on passing this submission🎉 and all the very best for stage 2.
>
> Feel free to get in touch with your mentors in case you need any help.
>
> Keep learning and stay Udacious!

### Code review 2

#### index.html 2

> AWESOME: Great work adding a viewport.
>
> AWESOME: The map has an appropriate aria role.

#### restaurant.html 2

> AWESOME: Great work adding a viewport.
>
> AWESOME: The map has an appropriate aria role.

#### assets/js/main.js and assets/js/restaurant_info.js 2

> AWESOME: Images have appropriate alternate text.

#### assets/css/styles.css 2

> AWESOME: Media queries are correctly implemented.