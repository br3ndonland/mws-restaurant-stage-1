# Ajax with XHR

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo">
</a>

[Asynchronous JavaScript Requests course](https://www.udacity.com/course/es6-javascript-improved--ud356) lesson 1/3

Udacity Google Mobile Web Specialist Nanodegree program part 3 lesson 01

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Intro](#intro)
  - [1.01. Course Intro](#101-course-intro)
  - [1.02. Client Server Demonstration](#102-client-server-demonstration)
  - [1.03. Ajax Definition & Examples](#103-ajax-definition--examples)
  - [1.04. APIs](#104-apis)
- [XHR syntax](#xhr-syntax)
  - [1.05. Create An Async Request with XHR](#105-create-an-async-request-with-xhr)
  - [1.06. The XHR Object](#106-the-xhr-object)
  - [1.07. XHR's .open() method](#107-xhrs-open-method)
  - [1.08. XHR's .send() method](#108-xhrs-send-method)
  - [1.09. A Full Request](#109-a-full-request)
- [Ajax project](#ajax-project)
  - [1.10. Project Initial Walkthrough](#110-project-initial-walkthrough)
  - [1.11. Setting a Request Header](#111-setting-a-request-header)
  - [1.12. Project Final Walkthrough](#112-project-final-walkthrough)
- [XHR summary](#xhr-summary)
  - [1.13. XHR Recap](#113-xhr-recap)
  - [1.14. XHR Outro](#114-xhr-outro)

## Intro

### 1.01. Course Intro

### 1.02. Client Server Demonstration

- Ajax requests are asynchronous, meaning they happen in the background without blocking the rest of the page load.
- The X stands for XML, but JSON is much more popular today, so they're really Ajaj requests.

### 1.03. Ajax Definition & Examples

#### A little history

>JavaScript frameworks and Single Page Apps are the way to build today, but let's review where we've come from.
>
>In the *traditional* server-rendered web application, the client computer makes a request for a web page. The server creates and returns a page to the client. Finally, the client loads the new page and displays the information. If they interact with the page, say to add or remove something by submitting a form, they start the cycle all over again. The client will make another request, the server returns a totally new page, the client loads and presents it to the user again.
>
>Up until the mid 2000s, this was basically the only way internet communication occurred. Information would reside on the server, and a client would request that data and refresh the page and display it. This cycle would repeat for each and every new page request.
>
>In the late 90s, the Microsoft Outlook team added the XMLHTTP component to Internet Explorer and built a web version of the Outlook mail client. This code was later picked up by other browsers as XMLHttpRequest. This allowed browsers to make HTTP requests from Javascript and update the current page in place without fetching an entire page from the server. Instead of the synchronous model of waiting for a whole page, the user interface could update asynchronously as the user kept working. Most of the data being exchanged used the XML format.

#### AJAX

>In 2005, [Jesse James Garrett coined the term AJAX](https://web.archive.org/web/20080702075113/http://www.adaptivepath.com/ideas/essays/archives/000385.php) to mean “Asynchronous Javascript and XML”. This is essentially the technique of using [XMLHTTPRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) to fetch data and then modify the current page.
>
>AJAX took the web world by storm, spreading far beyond Microsoft Outlook. State-of-the-art web applications like Flickr, GMail, and Google Maps rapidly adopted it. Instead of having to wait for data and have the entire page refresh, these new, near instantaneous applications were incredible.

#### Browser Inconsistencies

>Hold up, though. Ajax wasn't all ponies and rainbows. There were several different, incompatible browser implementations and developers were forced to code for one browser or write complex code for them all. Eventually, JavaScript libraries like jQuery and YUI emerged to reconcile the differences.
>
>AJAX apps were great, but difficult for individual developers to write; as browsers kept changing, and people demanded apps on more devices, the code then became more and more complex and confusing. This challenge led to the rise of standard Javascript frameworks and libraries. JavaScript libraries arose to hide the complex browser differences, JavaScript frameworks made developing complex, powerful applications manageable.

### 1.04. APIs

#### Getting Data

>We've looked at the concepts of Ajax and that it's the technology we'll use to add data to our project asynchronously. But where is this data coming from? And how do we get access to it? How will our app know how to retrieve that data.
>
>We'll be using an **API** to interact with various data sources.

#### What's an API

>The acronym "API" stands for:
>
>**A**pplication
>**P**rogramming
>**I**nterface
>
>There's data out there that's just waiting to be used. Most of the data-rich applications you use get their data from 3rd party websites. They actually fetch this data using APIs. In the video below, Cameron will demo how Reddit uses APIs for added interactivity on its site.
>
>[Google's APIs](https://developers.google.com/apis-explorer/) All the Google services you can imagine.
>
>[Giant database of APIs](http://www.programmableweb.com/apis/directory) This is definitely worth skimming for some inspiration.
>
>Also, did you know that [Udacity has an API](https://www.udacity.com/public-api/v1/catalog)? It's available for anyone to use. We want to make it easy for developers to access and share our catalog of courses.

## XHR syntax

### 1.05. Create An Async Request with XHR

### 1.06. The XHR Object

>Just like how the `document` is provided by the JavaScript engine, the JavaScript engine also provides a way for us to make asynchronous HTTP requests. We do that with an `XMLHttpRequest` object. We can create these objects with the provided `XMLHttpRequest` constructor function.
>
>One of the best ways to learn is to get your hands dirty and try things out! So go to [Unsplash](https://unsplash.com/), open up the developer tools, and run the following on the console:
>
>```js
>const asyncRequestObject = new XMLHttpRequest();
>```
>
>Confusingly, the constructor function has "XML" in it, but it's not limited to only XML documents. Remember that the "AJAX" acronym used to stand for "Asynchronous JavaScript and XML". Since the main file format that was originally used for asynchronous data exchange were XML files, it's easy to see why the function is called `XMLHttpRequest`!
>
>XMLHttpRequests (commonly abbreviated as XHR or xhr) can be used to request any file type (e.g. plain text files, HTML files, JSON files, image files, etc.) or data from an API.
>
>**Note:** We'll be digging into the `XMLHttpRequest` object. We'll look at how to create it, what methods and properties need to be used, and how to actually send asynchronous requests. For even more info on using the XHR object to make async requests, check out these links:
>
>- MDN's docs - [https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)
>- WHATWG Spec - [https://xhr.spec.whatwg.org/](https://xhr.spec.whatwg.org/)
>- W3C Spec - [https://www.w3.org/TR/XMLHttpRequest/](https://www.w3.org/TR/XMLHttpRequest/)

### 1.07. XHR's .open() method

#### Intro

>So we've constructed an XHR object named `asyncRequestObject`. There are a number of methods that are available to us. One of the most important is the [open method](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open).
>
>```js
>asyncRequestObject.open();
>
>```
>
>`.open()` takes a number of parameters, but the most important are its first two: the HTTP method URL to send the request
>
>If we want to asynchronously request the homepage from the popular high-res image site, Unsplash, we'd use a `GET` request and provide the URL:
>
>```js
>asyncRequestObject.open('GET', 'https://unsplash.com');
>```

#### A little rusty on your HTTP methods

>The main two that you'll be using are:
>
>- `GET` \- to retrieve data
>- `POST` \- to send data
>
>For more info, check out our course on [HTTP & Web Servers](https://classroom.udacity.com/courses/ud303)!
>
>**Warning:** For security reasons, you can only make requests for assets and data on the same domain as the site that will end up loading the data. For example, to asynchronously request data from google.com your browser needs to be on google.com. This is known as the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). This might seem extremely limiting, and it is!
>
>The reason for this is because JavaScript has control over so much information on the page. It has access to all cookies and can determine passwords since it can track what keys are pressed. However, the web wouldn't be what it is today if all information was bordered off in its own silos. The way to circumvent the same-origin policy is with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) (Cross-Origin Resource Sharing). CORS must a technology that is implemented on the server. Services that provide APIs use CORS to allow developers to circumvent the same-origin policy and access their information.

#### Question 1 of 2

>Go to [Google](https://www.google.com), open up the developer tools, and run the following on the console:
>
>```js
>const req = new XMLHttpRequest();
>req.open('GET', 'https://www.google.com/');
>```
>
>What happens?
>
>- The Google homepage open in the browser
>- An async request sent to [https://www.google.com](https://www.google.com)
>- Nothing happens
>- An error occurs

<details><summary>Solution</summary>

Nothing happens

>The XHR's .open() method does not actually send the request! It sets the stage and gives the object the info it will need when the request is actually sent. A bit anti-climactic… So let's actually send the request!

</details>

#### Question 2 of 2

>An XHR object's `.open()` method can take a number of arguments. Use [the documentation](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) to explain what the following code does:
>
>```js
>const myAsyncRequest = new XMLHttpRequest();
>myAsyncRequest.open('GET', 'https://udacity.com/', false);
>```
>
>- Nothing special, this is the standard way `.open()` works.
>- The request is sent immediately.
>- The JavaScript freezes and waits until the request is returned.

<details><summary>Solution</summary>

The JavaScript freezes and waits until the request is returned.

>Passing false as the third option makes the XHR request become a synchronous one. This will cause the JavaScript engine to pause and wait until the request is returned before continuing - this "pause and wait" is also called "blocking". This is a terrible idea and completely defeats the purpose for having an asynchronous behavior. Make sure you never set your XHR objects this way! Instead, either pass true as the 3rd argument or leave it blank (which makes it default to true).'

</details>

### 1.08. XHR's .send() method

>To actually send the request, we need to use the [send method](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send):
>
>```js
>asyncRequestObject.send();
>```
>
>Let's check out what happens:
>
>![send-xhr-request-1](https://d17h27t6h515a5.cloudfront.net/topher/2017/August/59938614_ud109-l1-send-xhr-request-1/ud109-l1-send-xhr-request-1.gif)
>
>*The XHR request is sent, but we don''t see anything!*
>
>It's a little pointless to make a request for something but then do absolutely nothing with it! Why would you order some cake and then not go to pick it up or not eat it? The horror! We want to eat our cake, too!

#### Handling Success

>To handle the successful response of an XHR request, we set the [onload property](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload) on the object to a function that will handle it:
>
>```js
>function handleSuccess () {
>    // in the function, the `this` value is the XHR object
>    // this.responseText holds the response from the server
>
>    console.log( this.responseText ); // the HTML of https://unsplash.com/
>}
>
>asyncRequestObject.onload = handleSuccess;
>
>```
>
>As we just saw, if `onload` isn't set, then the request *does* return...but nothing happens with it.

#### Handling Errors

>You might've picked up that **onload** is called when the response is *successful*. If something happens with the request and it can't be fulfilled, then we need to use the **onerror property**:
>
>```js
>function handleError () {
>    // in the function, the `this` value is the XHR object
>    console.log( 'An error occurred 😞' );
>}
>
>asyncRequestObject.onerror = handleError;
>
>```
>
>As with `onload`, if `onerror` isn't set and an error occurs, that error will just fail silently and your code (and your user!) won't have any idea what's wrong or any way to recover."

### 1.09. A Full Request

#### Full request

>Here's the full code that we've built up that creates the XHR object, tells it what info to request, sets up handlers for a success or error, and then actually sends the request:
>
>```js
>function handleSuccess () {
>  console.log( this.responseText );
>// the HTML of https://unsplash.com/}
>function handleError () {
>  console.log( 'An error occurred \uD83D\uDE1E' );
>}
>const asyncRequestObject = new XMLHttpRequest();
>asyncRequestObject.open('GET', 'https://unsplash.com');
>asyncRequestObject.onload = handleSuccess;
>asyncRequestObject.onerror = handleError;
>asyncRequestObject.send();
>
>```

#### APIs and JSON

>Getting the HTML of a website is ok, but it's probably not very useful. The data it returns is in a format that is extremely difficult to parse and consume. It would be a lot easier if we could get just the data we want in an easily formatted data structure. If you're thinking that JSON would be a good idea, then you're right and I'll give you a piece of my cake!
>
>Instead of requesting the base URL for Unsplash, let's create an app that pulls an image from Unsplash's API and relevant articles from the New York Times.
>
>When making a request from an API that returns JSON, all we need to do is convert that JSON response into a JavaScript object. We can do that with `JSON.parse();`. Let's tweak the onload function to handle a JSON response:
>
>```js
>function handleSuccess () {
>const data = JSON.parse( this.responseText ); // convert data from JSON to a JavaScript object
>console.log( data );
>}
>
>asyncRequestObject.onload = handleSuccess;
>
>```

## Ajax project

### 1.10. Project Initial Walkthrough

#### Download the Starter Code

>The starter project is on GitHub: [https://github.com/udacity/course-ajax](https://github.com/udacity/course-ajax). You can clone the project by running the following Git command in your terminal:
>
>```text
>git clone https://github.com/udacity/course-ajax.git
>
>```
>
>Once you've cloned the project, you'll notice that it has three separate folders:
>
>1. `lesson-1-async-w-xhr`
>2. `lesson-2-async-w-jQuery`
>3. `lesson-3-async-w-fetch`
>
>Make sure to work on the files for the correct lesson. Since this is the *first* lesson, we'll be working in the `lesson-1-async-w-xhr` directory.

#### Create Your Accounts

>To complete these final steps, you'll need accounts with Unsplash and The New York Times.

##### Unsplash

>- Create a developer account here - [https://unsplash.com/developers](https://unsplash.com/developers)
>- Next, create an application here - [https://unsplash.com/oauth/applications](https://unsplash.com/oauth/applications)
>- this will give you an "Application ID" that you'll need to make requests

##### The New York Times

>- Create a developer account here - [https://developer.nytimes.com/](https://developer.nytimes.com/)
>- They'll email you your api-key (you'll need this to make requests)

#### Unsplash Request

>In our app, the variable `searchedForText` contains the text we're interested in, and we'll set the `onload` property to a function called `addImage` (which is a do-nothing function that we'll flesh out in a moment). If we temporarily set `searchedForText` to "hippos", the code for the XHR call to Unsplash is:
>
> ```js
> function addImage(){}
> const searchedForText = 'hippos';
> const unsplashRequest = new XMLHttpRequest();
>
> unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
> unsplashRequest.onload = addImage;
> unsplashRequest.send();
> ```
>
> ...but if you try running this code, you'll get an error.

#### Unsplash Quiz Question

> The request for Unsplash doesn't work because it needs an HTTP header to be sent along. What is the XHR method to add a header to the request? Check out [the documentation](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) for help!
>
> - `.includeRequestHeader()`
> - `.addHeader()`
> - `.setRequestHeader()`
> - `.sendHeader()`
>
<details><summary>Solution</summary>

`.setRequestHeader()`

</details>

### 1.11. Setting a Request Header

>The XHR method to include a header with the request is [setRequestHeader](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader). So the full code needs to be:
>
> ```js
> const searchedForText = 'hippos';
> const unsplashRequest = new XMLHttpRequest();
>
> unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
> unsplashRequest.onload = addImage;
> unsplashRequest.setRequestHeader('Authorization', 'Client-ID <your-client-id>');
> unsplashRequest.send();
>
> function addImage(){
> }
>
> ```
>
> Since the New York Times doesn't require a specific header, we don't need to do anything special. We'll set its `onload` property to the function `addArticles` that we'll flesh out in a minute:
>
> ```js
> function addArticles () {}
> const articleRequest = new XMLHttpRequest();
> articleRequest.onload = addArticles;
> articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=<your-API-key-goes-here>`);
> articleRequest.send();
>
> ```
>
> Make sure to fill in the URL above with the API key you received in an email from the New York Times after signing up as a developer.

#### Adding The Articles

> Similar to how we added the Unsplash image to the page. See if you can add all of the New York Times articles to the page. When you''re done, check the box to continue.
>
> Task List
>
> - My code now adds the articles to the page!

### 1.12. Project Final Walkthrough

## XHR summary

### 1.13. XHR Recap

#### XHR Usage Review

>There are a number of steps you need to take to send an HTTP request asynchronously with JavaScript.

#### To Send An Async Request

> - create an XHR object with the `XMLHttpRequest` constructor function
> - use the `.open()` method - set the HTTP method and the URL of the resource to be fetched
> - set the `.onload` property - set this to a function that will run upon a successful fetch
> - set the `.onerror` property - set this to a function that will run when an error occurs
> - use the `.send()` method - send the request

#### To Use The Response

> - use the `.responseText` property - holds the text of the async request's response
>
> > **Note:** The original XHR specification was created in 2006. This was version 1 of the specification. A number of years with minimal changes to the spec.
>
> In 2012, work was started on a version 2 of the XHR specification. In 2014, the XHR2 spec was merged into the XHR1 spec so that there wouldn't be diverging standards. There are still references to XHR2, but the XHR specification now fully incorporates XHR2.
>
> Check out this HTML5Rocks article for info on the [new tricks in XHR2](http://www.html5rocks.com/en/tutorials/file/xhr2/) that are now in the XHR spec.

### 1.14. XHR Outro

[Next lesson](ajax-2-jquery.md)

[Back to TOC](#table-of-contents)