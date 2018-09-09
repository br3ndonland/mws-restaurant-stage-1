# Project 2 code review

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo svg">
</a>

[Udacity Google Mobile Web Specialist Nanodegree program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024)

[Udacity Client-Server Communication by Google free course](https://www.udacity.com/course/client-server-communication--ud897)

Udacity Google Mobile Web Specialist Nanodegree program part 4 lessons 1-5

Instructors: [Surma](https://keybase.io/surma) from Google and Richard Kalehoff from Udacity

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

- [Lesson 1 HTTP request response cycle](#lesson-1-http-request-response-cycle)
- [Lesson 2 HTTP1](#lesson-2-http1)
- [Lesson 3 HTTPS](#lesson-3-https)
- [Lesson 4 HTTP2](#lesson-4-http2)
- [Lesson 5 Security](#lesson-5-security)

## Lesson 1 HTTP request response cycle

- The World Wide Web (WWW) is a subset of the internet.
- They use [Netcat](https://en.wikipedia.org/wiki/Netcat)
- Requests: Also see the [Asynchronous JavaScript Requests course](https://www.udacity.com/course/es6-javascript-improved--ud356) and my [notes](https://github.com/br3ndonland/udacity-google-mws/tree/master/lessons/2-ajax-es6-offline/ajax).

## Lesson 2 HTTP1

- RESTful APIs work with HTTP requests and responses.
- Network layers
  - Ethernet
  - IP
  - TCP
  - HTTP

## Lesson 3 HTTPS

- Importance of HTTPS for preventing MITM (Man In The Middle) attacks
- TLS certificate basics
- Make sure all resources, including images and CDN, are served over HTTPS.

## Lesson 4 HTTP2

- Also see [Udacity HTTP & Web Servers free course](https://www.udacity.com/course/http-web-servers--ud303) and [my notes](https://github.com/br3ndonland/udacity-fsnd/blob/master/1-foundations/python-http/http-03-heroku.md).
- It may actually be better not to bundle/concatenate JavaScript in the future with HTTP/2.

## Lesson 5 Security

- CORS
  - Origins: Data scheme (HTTPS), hostname, port
  - CORS allows servers to set other origin referrers.
- CSRF
  - Forging requests from a CORS-approved URL
- XSS
  - Protect against XSS by validating user input server-side.