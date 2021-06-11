---
template: post
title: 10 tips to improve your website speed
slug: 10-tips-improve-website-performance
draft: false
date: 2021-06-11T11:25:04.282Z
description: >-
  Increasing your website speed can bring many benefits, not only related to
  user experience but also improve your SEO results/google ranking score. This
  article was heavily inspired by the content available at
  https://developers.google.com/ and https://web.dev and brings some
  tips/concepts to make your website faster.
category: web-development performance
---
Increasing your website speed can bring many benefits, not only related to user experience but also improve your SEO results/google ranking score. This article was heavily inspired by the content available at <https://developers.google.com/> and <https://web.dev> and brings some tips/concepts to make your website faster. 

I have added a lot of high quality links alongside this post, so I really recommend you have a look at all of them!

It's not new that as fast as your website is it will have better results on google ranking and also users will have a better experience as mentioned [here](https://developers.google.com/web/updates/2018/07/search-ads-speed).\
\
Instead of dive deep into each topic, this article aims to give a direction on how to optimize your website speed. All sections have references to articles at [web.dev](https://web.dev). A lot of tools and frameworks like NextJS, Gatsby, Nuxt, etc have tools/libraries that help to achieve better results, but once you grasp the basic concepts you should be able to research and find good tools for whatever framework/language you are using.

Okaay, let's start:

### 1 - Use async/defer to load non-critical scripts and move them before the <body> closing tag.

This will prevent non-critical scripts from blocking DOM parsing/rendering. HTML renders the DOM starting from the Head until the end of the document, so if you have a script in the head the browser will download and parse it which will delay the rendering process. If you use attributes as defer and async the browser will wait until the DOM is loaded before running the script. 

* Some scripts like Google analytics/tag manager are async by nature so you don't need to use these attributes on them.
* Move non-critical scripts to before the closing of body and add async/defer to them.|

To fully understand how async/defer work and what is the different between them please visit this link: <https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript>.

_(Huge thanks to Daniel from_ [_https://www.growingwiththeweb.com/_](https://www.growingwiththeweb.com/) _for this image)_

![Async defer](/media/async-defer.png "Async defer")

### 

### 2 - Use Facades to load third party scripts that are not critical to your website load.

Does your website has a chat widget? They are a really good example for this one. A Facade would be nothing but a FAKE HTML element that visually mimics your real chat widget, but actually it's there only to load the real \`script\` and add it to the page once the user clicks on it. \
\
Let's imagine that your website have a facebook messenger link, instead of loading/parsing the whole javascript you could build a custom html icon using html and CSS and create a \`onclick\` event listener that would load the real chat widget when users clicks on it. 

Alternatively you could load it inside the \`load\` event using something like `window.addEventListener('load', (event) => {.` Its better  to use the `load` event instead of `DomContentLoaded` because the second method doesn't wait for all resources download as images, etc. Please read here to understand more about the different between \`load\` and \`DomContentLoaded\` event. 

Quote extracted from <https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event>

> The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
>
> A different event, load, should be used only to detect a fully-loaded page. It is a common mistake to use load where DOMContentLoaded would be more appropriate

Another alternative would be to add the script inside the \`load\` event callback, you could event wrap the function into a \`timeout\` callback to make sure that the page would be loaded by the time the script is loaded.

```
window.addEventListener('load', (event) => {
  setTimeout(function() {
  //this function will add the script to the head
  (function () {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://YOUR_SCRIPT_TAG.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
  })();
  }, 3000);
});
```

**References:**

* <https://web.dev/third-party-facades/>

### 3 - Optimize your images, use responsive sizes and offer webp format.

Websites that depends heavily on media such as images, videos needs to use tools to make sure that they will be optimized. 

* Offer images in the \`webp\` format as it's usually smaller in size than \`jpeg\`, \`png\`. According to caniuse 91.8% of browsers already support it. <https://web.dev/serve-images-webp/>\
* Use responsive images. You can use \`srcset\` and \`sizes\` images attribute to serve different images for different devices sizes. Mobile devices usually doesn't need to serve big images, so you can crop and reduce significavely the size of images. Read more here: <https://web.dev/fast/#optimize-your-images>\
* Compress your images: https://web.dev/compress-images/\
* Use tools/CDNs to serve  images <https://web.dev/image-cdns/>\
  Please check all the other optimizations here: https://web.dev/fast/#optimize-your-images\
  \
  But... how to achieve all of that? Thankfully we don't need to spend a huge amount of time trying to firgure it out and we can use services asl <https://cloudinary.com/>, <https://imgix.com/>, to do all the heavy lifting. I quite often say, let's not try to solve all problems in the world, let's focus on solving our business problems and delegate other tasks to who is the best to solve it - so this is a classic example for that.\
  \
  A lot of frameworks also already have tools to help on optmizing images as nextjs that have \`next/image\` component and gatsby with \`gatsby-image-sharp\` plugin that transform/optmize images at the build time. 

**References:**

* <https://web.dev/serve-responsive-images>
* <https://web.dev/fast/#optimize-your-images>

### 4 - Lazy Load images.

Let's suppose that a page has 10 images, but when users load it they'll see only 2 of them, so why not only load 2 images and as soon as the user scroll downs in the page we load the rest? \
\
You can use Interest Browser API, scroll events listeners and some bowsers as chrome already support the \`image\` lazy attribute natively. <https://caniuse.com/loading-lazy-attr> (_As today 12/06/2021 70% of browsers already support it_).

You can also use libraries as <https://github.com/aFarkas/lazysizes>, <https://github.com/mfranzke/loading-attribute-polyfill>, <https://github.com/malchata/yall.js> to help with that.

**References:**

* <https://web.dev/browser-level-image-lazy-loading/>

### 5 - Loading Fonts

We need to make sure that user will see the website content ASAP. You can use \`@font-face\` \`font-display\` property to tell browsers to display an alternative font if the website font is still not downloaded. This will helps as the user will see the text content faster instead of waiting for the font to be downloaded. 

Some formats as \`woff2\` have better compression and are smaller in size but aren't supported in all browsers, but you can tell the browser to use if it's supported. You can also use the \`local\` attribute and the browser will first check if the user has the font installed locally instead of trying to download it.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

_Extracted from_ [_https://web.dev/reduce-webfont-size/_](https://web.dev/reduce-webfont-size/)__

**References**:

* <https://web.dev/optimize-webfont-loading/>
* <https://web.dev/reduce-webfont-size/>

### 6 - Code Split/Tree Shaking:

Your website is composed by pages that depends on HTML, CSS and JavaScript code. Code splitting is the process that makes sure that you page **only** loads the CSS/JavaScript it needs to be loaded. Tree Shaking makes sure to remove any code that is **unused** by your website.

**Tree Shaking:** Let's suppose you are using \`bootstrap.css\` in your project, but the home page only use two type of classes coming from bootstrap \`col-lg-12\` and \`col-md-6\`. In this case doesn't make sense to load the whole \`boostrap.css\` file as your page only uses two classes of it, so you make sense to purge all other classes and reduce the bootstrap.css size.

**Code Spliting:** Let's supose that you have a huge javascript script called \`main.min.js\`. The Home Page depends only of 10% of it, and the about page only uses 7% of it, what about spliting this script in multiple scripts file and when the home page loads it will load only the 10% that it uses and when users navigate to About Page we will load the other chunk of script that the page needs.\
\
This is not a trivial work but you will find techniques/libraries to help you to achieve that. Some frameworks like Angular, NextJS, Tailwindcss already handle that by default. Bundle tools as webpack can help to achieve that. Another cool example is the awesome library <https://purgecss.com/> . It analyzes your content and css files and can automatically purge any unused css, this helps to reduce the css size.

\
**References:**

* <https://purgecss.com/>
* <https://web.dev/code-splitting-suspense/>

### 7 - Preload/prefetch external references

When a browser needs to load an external link a lot of things happens in the background before the browser actually downloads the file. The browser needs to resolve the DNS address, for example. 

> The preload value of the <link> element's rel attribute lets you declare fetch requests in the HTML's <head>, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance.

\
Some cool libraries like <https://github.com/guess-js/guess>  can go even further. It analyzes google analytcs data and find out what pages users are likely to navigate from any page and based on that it preload the next requests, so let's supose that according to google analytcis data, 90% of the users that goes in home page also goes to About page, then makes sense to preload 

**References:**

* <https://web.dev/preload-critical-assets/>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload>

### 8 - Reduce your server response time.

This task does not have a definitive solution and depends much on the infrastructure/framework you are using to develop/deploy your website, but there is some basic techniques/concepts we can apply:

* Try to cache content and minimize calls to the database. In distributed system context IO operations such as database calls usually tends to be the pitfall of application performance. You can use cache solutions as \`redis\` to minimize database/network calls and delivery faster responses.
* You can use CDN caches to delivery your content with a low latency from anywhere in the globe. You can also serve your website files using proper cache headers, then frequent visitors won't need to do request to the server again to download the files. In this article I did a deep dive on CDN x Browser caching <https://lucasfsantos.com/posts/deploy-react-angular-cloudfront/>
* You can add compression GZIP/Brotli to reduce the file size.
* Check your hosting settings and if you're using services as Nginx and Apache they all have guidelines for optmization.
* Use Http2. The protocol Http 2 comes with cool features such as allow browsers to resolve multiple requests at the same, it also use TCP header compressions. Please read this article to know more about: <https://http2.github.io/faq/>

**References:**

* <https://lucasfsantos.com/posts/deploy-react-angular-cloudfront/>
* <https://http2.github.io/faq/>

### 9 - Monitoring

We are constantly rolling updates to our websites, adding new features and fixing bugs, so it's important to measure how those changes are impacting the website performance. You can use tools like <https://github.com/GoogleChrome/lighthouse-ci> to automatically run page speeds tests during your CI/CD pipeline and even block a deployment if the speed score goes below a value. and it's important to measure if those changes will affect the website performance. 

**References:**

* ### <https://web.dev/vitals-tools/>

### 10 - Never stop learning and keep yourself updated - Check out this course and book

Keep yourself up to date with all the changes and try to research tools/libraries that can help you to make your website faster. As I mentioned before most of the frameworks already have tools to help us with this task. 

Try to understand concepts and metrics used in page speed tests and definitely read blog posts at https://web.dev, they are really helpful and have a lot of awesome content.

I could not also forget to recommend those extra courses / book:

* **Udacity Course**: <https://www.udacity.com/course/website-performance-optimization--ud884>
* **Book**: <https://www.amazon.com/gp/product/B00FM0OC4S/ref=dbs_a_def_rwt_hsch_vapi_tkin_p1_i0>
