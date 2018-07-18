# Ajax with jQuery

<a href="https://www.udacity.com/">
  <img src="https://s3-us-west-1.amazonaws.com/udacity-content/rebrand/svg/logo.min.svg" width="300" alt="Udacity logo">
</a>

[Asynchronous JavaScript Requests course](https://www.udacity.com/course/es6-javascript-improved--ud356) lesson 2/3

Udacity Google Mobile Web Specialist Nanodegree program part 3 lesson 02

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Intro](#intro)
  - [2.01. The jQuery Library & Ajax](#201-the-jquery-library--ajax)
- [jQuery Ajax syntax](#jquery-ajax-syntax)
  - [2.02. jQuery's `ajax()` Method](#202-jquerys-ajax-method)
  - [2.03. Handling The Returned Data](#203-handling-the-returned-data)
  - [2.04. Cleaning up the Success Callback](#204-cleaning-up-the-success-callback)
- [jQuery under the hood](#jquery-under-the-hood)
  - [2.05. Code Walkthrough](#205-code-walkthrough)
  - [2.06. Peek inside $.ajax()](#206-peek-inside-ajax)
  - [2.07. Review the Call Stack](#207-review-the-call-stack)
  - [2.08. Walkthrough of .ajaxTransport](#208-walkthrough-of-ajaxtransport)
- [More features of jQuery](#more-features-of-jquery)
  - [2.09. jQuery's Other Async Methods](#209-jquerys-other-async-methods)
  - [2.10. Async with jQuery Outro](#210-async-with-jquery-outro)

## Intro

### 2.01. The jQuery Library & Ajax

>jQuery is an incredibly popular JavaScript library that provides a lot of functionality right out of the box. It was created a number of years ago back when browsers hadn't joined together to standardize on functionality. jQuery made life easier for developers that were building websites that had to function in all of the major browsers by providing a unified interface. The developer would use jQuery-specific functions and then jQuery would figure out what code to run depending on the browser that was being used.
>
>jQuery is just JavaScript, so you'd [download a current version](https://code.jquery.com/) and link to it with a regular `<script>` tag. Once it's been included it on the page, you've got this powerhouse of functionality right at your fingertips.
>
>Now that browsers have pretty much aligned, jQuery's usage is not as necessary as it was several years ago. However, one powerful tool that it provides is it's `ajax()` method. As its name suggests, jQuery's `ajax()` method is used to handle all asynchronous requests.
>
>Let's see it in action.
>
> Wanna Learn jQuery?
>
> jQuery is incredibly popular and used by hundreds of thousands of sites. If you want dig deeper into this cool JavaScript library, check out our [Intro to jQuery](https://www.udacity.com/course/intro-to-jquery--ud245) course.

## jQuery Ajax syntax

### 2.02. jQuery's `ajax()` Method

#### Intro

>The [`.ajax()` method](http://api.jquery.com/jquery.ajax/) is at the heart of all asynchronous requests for the entire jQuery library. There are a couple of ways you can call the `.ajax()` method:
>
>```js
>$.ajax(url-to-fetch, configuration-object);
>// or
>$.ajax(just a configuration object);
>```
>
>The most common way to use the `.ajax()` method is with just the configuration object, since everything can be set inside the configuration object.

#### What's a configuration object

> A configuration object is just a plain ol' JavaScript object that's used to configure something. For example:
>
> ```js
> var settings = {
>    frosting: 'buttercream',
>    colors: ['orange', 'blue'],
>    layers: 2,
>    isRound: true
> };
>
> ```
>
> ...the `settings` configuration object can be used in the imaginary `MakeCake` constructor function:
>
> ```js
> const myDeliciousCake = MakeCake( settings );
>
> ```
>
> Alternatively, the `settings` object could be passed in directly:
>
> ```js
> const myDeliciousCake = MakeCake({
>    frosting: 'buttercream',
>    colors: ['orange', 'blue'],
>    layers: 2,
>    isRound: true
> });
>
> ```

#### Making an Ajax call

>jQuery's `.ajax()` method has to be incredibly versatile and powerful if it's what powers all of jQuery's asynchronous requests. A simple Ajax request would look like this:
>
>```js
>$.ajax({
>    url: 'https://swapi.co/api/people/1/'
>});
>```
>
>Let's test it out!
>
>1. go to the [jQuery website](http://jquery.com/)
>2. open up your browser's developer tools
>3. make sure the network traffic is being recorded
>    - in Chrome, switch to the network pane
>4. add the request above to the console
>5. ...aaaand run it!
>
>![swapi-request](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba105b_ud109-l2-swapi-request/ud109-l2-swapi-request.gif)
>
>*Running an asynchronous request in the console. The request is for a resource on SWAPI. The request is displayed in the network pane.*
>
>So we can make a request with `.ajax()`, but we haven't handled the response yet.

### 2.03. Handling The Returned Data

> If you recall from setting up an XHR object, the response was handled by a function. It's the same thing with the `.ajax()` method. We can *chain* on to `.ajax()` with a `.done()` method. We pass the `.done()` method a function that will run with the Ajax call is done!
>
> ```js
> function handleResponse(data) {
>     console.log('the ajax request has finished!');
>     console.log(data);
> }
>
> $.ajax({
>     url: 'https://swapi.co/api/people/1/'
> }).done(handleResponse);
>
> ```
>
> ![swapi-request-with-done](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba1097_ud109-l2-swapi-request-with-done/ud109-l2-swapi-request-with-done.gif)
>
> *Asynchronous call set up with a `done` method to handle the response. The request is made, and then the response is logged to the console.*
>
> Let's convert the existing, plain XHR call with jQuery's `.ajax()`. This is what the app currently has:
>
> ```js
> const imgRequest = new XMLHttpRequest();
> imgRequest.onload = addImage;
> imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
> imgRequest.setRequestHeader('Authorization', 'Client-ID <your-client-id-here>');
> imgRequest.send();
> ```
>
> A lot of this information is handled behind the scenes by jQuery, so here's the first step in the conversion:
>
> ```js
> $.ajax({
>     url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
> }).done(addImage);
>
> ```
>
> With the jQuery code:
>
> - we do not need to create an XHR object
> - instead of specifying that the request is a `GET` request, it defaults to that and we just provide the URL of the resource we're requesting
> - instead of setting `onload`, we use the `.done()` method

#### Quiz Question

> The only change that needs to be made is including the Client ID header along with the request so that Unsplash will verify the request. Why don't you check out [the API for the .ajax() method](http://api.jquery.com/jQuery.ajax/) and select the code below that correctly adds an "Authorization" header to the request.
>
> ```js
> $.ajax({
>         url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
>     }).addHeader('Authorization', 'Client-ID 123abc456def')
>     .done(addImage);
> ```
>
> ```js
> $.ajax({
>         url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
>         setHeader: \[\['Authorization', 'Client-ID 123abc456def'\]\]
>     }).done(addImage);
> ```
>
> ```js
> $.ajax({
>         url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
>         authorization: 'Client-ID 123abc456def'
>     }).done(addImage);
> ```
>
> ```js
> $.ajax({
>         url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
>         headers: {
>             Authorization: 'Client-ID 123abc456def'
>         }
>     }).done(addImage);
> ```
>

<details><summary>Solution</summary>

>The correct answer is option 4. A header is added to the request by passing a headers object as a property. Each key in the headers object is the name of the header, and the value is what will be used as the value for the header.

</details>

>The request should send perfectly now. Fantastic work! But there seem to be issues with the response and how it's handled.

### 2.04. Cleaning up the Success Callback

#### Clean up

> jQuery detects the response and if it's JSON, it will automatically convert it to JavaScript for us. How awesome is that! So we only need to make a few tweaks to the existing code. Here's what it currently is:
>
> ```js
> function addImage() {
>     const data = JSON.parse(this.responseText);
>     const firstImage = data.results[0];
>
>     responseContainer.insertAdjacentHTML('afterbegin',
>       `<figure>
>         <img src="${firstImage.urls.small}" alt="${searchedForText}">
>         <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
>       </figure>`
>     );
> }
>
> ```
>
> We just need to change the first three lines:
>
> ```js
> function addImage(images) {
>     const firstImage = images.results[0];
>
>     responseContainer.insertAdjacentHTML('afterbegin',
>       `<figure>
>         <img src="${firstImage.urls.small}" alt="${searchedForText}">
>         <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
>       </figure>`
>     );
> }
>
> ```
>

#### What changed

> - the function now has one parameter `images`
> - this parameter has already been converted from JSON to a JavaScript object, so * the line that had `JSON.parse()` is no longer needed.
> - the `firstImage` variable is set to the `images.results` first item
>
> The code that adds the HTML to the response container hasn't changed at all!

#### Replace Nytimes Xhr With $.Ajax()

> Now that we've walked through converting one request from using XHR to jQuery's `.ajax()` method, why don't you give it a shot on your own and convert the second request!
>
> Make sure to use the existing code as an example. If you get stuck, check out the documentation page.
>
> When you're successfully converted the code to use jQuery's `.ajax()` method and fixed the callback function so it adds the data to the page, check the checkbox to continue.
>
> Task List
>
> - I've successfully converted the code!

## jQuery under the hood

### 2.05. Code Walkthrough

> Using jQuery's `.ajax()` method, there's less setup code that you need to manage. That's good, but to use jQuery we also have to include the entire library and force our users to download the entire thing every time.
>
> It's true that they might have it cached, but do we really need jQuery? Is it doing something special?

### 2.06. Peek inside $.ajax()

> We're about to dig into jQuery's source for a second. To do that, you need to:
>
> 1. open up the project in a browser
> 2. open up DevTools
> 3. switch to the "Sources" pane
> 4. open up the jquery.js file
>     - in Chrome, you can open a specific file by searching for it with ctrl/command + P
> 5. set a breakpoint on line 9036
>
> ![breakpoint](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba1156_ud109-l2-jquery-xhr-set-breakpoint/ud109-l2-jquery-xhr-set-breakpoint.gif)
>
> A breakpoint set in the jQuery source file right where new XMLHttpRequest object is created

#### Search For A Topic

> Now that we've added the breakpoint, if we do a search, then the JavaScript code will run (which will use jQuery's `.ajax()` method!) and DevTools will pause when it hits the line with the breakpoint. So go ahead and do a search to cause the code to break at the breakpoint. Why not search for something exciting like "Volcanoes"!
>
> ![code-paused-at-breakpoint](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba1216_ud109-l2-code-paused-at-breakpoint/ud109-l2-code-paused-at-breakpoint.png)
>
> DevTools paused at breakpoint

#### Debugging in Chrome

> TIP: If you've never done it before, debugging a JavaScript application can seem like a complicated process. We'll be looking at the important parts of DevTools in this course, but if you're looking for a deeper dive, check out the following resources on Google's Developer site:
>
> - [Pause Your Code With Breakpoints](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints)
> - [JavaScript Debugging Reference](https://developers.google.com/web/tools/chrome-devtools/javascript/reference)

### 2.07. Review the Call Stack

#### The call stack

> The DevTools has a ton of helpful information! If you're not familiar with them, you really should spend some learning about all of its features. It'll make developing and debugging websites a lot easier! One helpful piece of info that DevTools provides is the JavaScript Call Stack. This displays the order of function calls that are in progress. The function at the bottom of the stack is the first one to run. It calls the second one on the stack...the second calls the third, the third... you get the idea. A function stays on the stack until the one above it returns.
>
> We can click on the bottom function in the stack (the `anonymous function`) to see that what kicked all this code off was the `$.ajax()` call for the Unsplash images. That `$.ajax()` call in turn calls `transport.send()`, which calls `options.xhr()`, which creates a new `XMLHttpRequest()` object!
>
> So the order is:
>
> 1. our code in an anonymous function calls `.ajax()`
> 2. `.ajax()` calls a `.send()` method
> 3. `.send()` calls `options.xhr()`
> 4. `options.xhr()` calls `jQuery.ajaxSettings.xhr` which creates a new XHR object
>
> ![xhr-call-stack](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba123e_ud109-l2-jquery-xhr-call-stack/ud109-l2-jquery-xhr-call-stack.gif)
>
> Clicking through the call stack to see the order of function calls

#### Question 1 of 2

> When `$.ajax()` is called, does the jQuery code create a new XHR object each time or does it create an initial one and reuses it for each subsequent call to `.ajax()`?
>
> - It creates a new one each time
> - It reuses the existing XHR object each time

<details><summary>Solution</summary>

> Thanks for completing that!
>
> Look at jQuery's code and especially the `jQuery.ajaxSettings.xhr` function, we can see that the code is `return new window.XMLHttpRequest();`. So this code will return a new XHR object every time it's called (which happens every time `$.ajax()` is run!).

</details>

#### Question 2 of 2

> Try working through the `.send()` function (the third item from the bottom of the call stack) on your own to see how it sets up the newly created XHR object. After reviewing the code, how does it set all of the headers?
>
> - It uses a `for` loop
> - it uses a `while` loop
> - it uses a `for...in` loop
> - it uses a `do while` loop

<details><summary>Solution</summary>

> Thanks for completing that!
>
> jQuery uses a for…in loop to iterate over the data in the headers object. This can be seen on lines 9094-9096.

</details>

### 2.08. Walkthrough of .ajaxTransport

## More features of jQuery

### 2.09. jQuery's Other Async Methods

#### Other methods

> jQuery has a number of other methods that can be used to make asynchronous calls. These methods are:
>
> - [.get()](http://api.jquery.com/jQuery.get/)
> - [.getJSON()](http://api.jquery.com/jQuery.getJSON/)
> - [.getScript()](http://api.jquery.com/jQuery.getScript/)
> - [.post()](http://api.jquery.com/jQuery.post/)
> - [.load()](http://api.jquery.com/load/)
>
> Each one of these functions in turn calls jQuery's main `.ajax()` method. These are called "convenience methods" because they provide a convenient interface and do some default configuration of the request before calling `.ajax()`.
>
> Let's look at the `.get()` and `.post()` methods to see how they just call `.ajax()` under the hood.

#### Add a Breakpoint

> With the project open in a browser:
>
> 1. load up DevTools
> 2. open the Sources pane
> 3. open the jQuery file
> 4. add a breakpoint to line 8797
> 5. reload the page (this will pause the code at the breakpoint you just made!)
>
> ![jquery-xhr-set-breakpoint](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba12cb_ud109-l2-jquery-xhr-set-breakpoint/ud109-l2-jquery-xhr-set-breakpoint.gif)
>
> Breakpoint added to jQuery source file in DevTools. The browser has been reloaded and is paused at the newly added breakpoint.
>
> The first time through the loop, the `method` variable will be `get`. This makes
>
> ```js
> jQuery[ method ] = function(...) {...}
> ```
>
> become
>
> ```js
> jQuery[ 'get' ] = function(...) {...}
> ```
>
> which gives us the `$.get()` method!
>
> On line 8807 you can see that this new `jQuery[ 'get' ]` function returns a call made to `jQuery.ajax( … );`! Notice that *before* the `.ajax()` call is run, the `type` property is set to the `method` variable (which is still`'get'`). So calling `$.get()` calls `$.ajax()` with some preset properties.
>
> All this was for `'get'`. This exact same code runs right after this for `'post'`! So the code creates a `jQuery[ 'post' ]` function that will call `jQuery.ajax( … )` and set the `type` property to `'post'`.
>
> Isn't it pretty cool how jQuery provides these convenience methods that just end up calling the main `.ajax()` method!?
>
> ![jquery-get-post-methods](https://d17h27t6h515a5.cloudfront.net/topher/2017/March/58ba12ed_ud109-l2-jquery-get-post-methods/ud109-l2-jquery-get-post-methods.gif)
>
> Walking through the jQuery source to see how the $.get() and $.post() methods are created, set some default properties, and then end up running $.ajax().

#### Which Method Should You Use

> [From the jQuery website](https://learn.jquery.com/ajax/jquery-ajax-methods/):
>
> It's often considered good practice to use the $.ajax() method over the jQuery provided convenience methods.

### 2.10. Async with jQuery Outro

[Previous lesson](ajax-2-jquery.md)

[Next lesson](ajax-3-fetch.md)

[Back to TOC](#table-of-contents)