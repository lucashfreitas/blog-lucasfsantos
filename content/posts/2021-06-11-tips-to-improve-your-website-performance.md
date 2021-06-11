---
template: post
title: Tips to improve your website performance
slug: improve-your-website-performance
draft: false
date: 2021-06-11T11:25:04.282Z
description: 'Having a fast website is not only important for SEO purposes but it''s also '
category: web-development performance
---
Improving your website speed can bring many benefits as it will improve user experiences and also will improve your website SEO ranking. This article was mainly inspired by the awesome content available at https://developers.google.com/ and https://web.dev. If you don't know them yet you should have a look.





### 1 - Use async/defer to load non critical scripts and move it before the <body> closing.

This will prevent non critical scripts from blocking DOM parsing/rendering.

* Google analytics/tag manager are async by default so you don't need to use this on them.
* Move non crictical scripts to before the closing of body and add async/defer to them, to understand more about the difference between them

**References:**

[https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript#:~:text=With async%2C the browser downloads,to parse the HTML document](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript#:~:text=With%20async%2C%20the%20browser%20downloads,to%20parse%20the%20HTML%20document).

### 2 - Use Facades to load third party scripts that are not critical to your website load. 

### E.g, create a "fake" chat widget and then when user clicks on it you load the original <script> or load then inside DOM events such as window.onload.

Chat widgets are a perfect example for this problem. You can build a Facade which is basically a FAKE HTML element that loads the original element when clicked. You would have a HTML element that would looks like the real chat widget but it would have a onclick handler event and then would insert the script in page.

Alternatively you could load it inside `window.addEventListener('load', (event) => {.` You need to use the `load` event instead of `DomContentLoaded` because the second method doesn't wait for all resources download as images, etc, just DOM parsing. 

It's a workaround but you could also wrap the function inside the `load` event inside a timeout, here goes an example:

```jsx
window.addEventListener('load', (event) => {

setTimeout(function() {
//library
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

### 3 - Optimise your images using responsive sizes for different device sizes and offer webp format. You can use services as cloudinary or imagemx for that.

Always ship images from CDN and using responsive sizes + webp format. Services as cloudinary can do all the heavy lifting here. Gatsby and next also have pre built in components that does not `gatsby-image-sharp` and `next/image`.

**References:**
<https://web.dev/fast/#optimize-your-images>

### 4 - Lazy Load images.

You can use Interest Browser API or scroll events (not so performatic) and some bowsers as chrome already support the lazy it natively.

**References:**

<https://caniuse.com/loading-lazy-attr> (As today 10/06/2021 70% of browsers already support it)
<https://github.com/mfranzke/loading-attribute-polyfill>

https://web.dev/browser-level-image-lazy-loading/.  

<https://github.com/aFarkas/lazysizes>
<https://github.com/malchata/yall.js>

### 5 - Loading Fonts

We need to make sure that user will see the website content ASAP. You can use @font-face attribute tell the browser to display an alternative font if the used font is still not downloaded, that will helps as the users won't need to wait font to be loaded to see the content.

Also include multiple versions of your fonts and give prefference for compressed formats as described here:

<https://web.dev/reduce-webfont-size/>

Add **swap** attribute to tell browser to display the default font while the main font is still being downloaded:

```jsx
@font-face {
    font-display: swap; //display the default font 
    font-family: 'yOur fonts';
    font-weight: normal;
    src: url("../fonts/YourFont.otf") format("opentype");
}
```

**References**:

<https://web.dev/optimize-webfont-loading/>
<https://web.dev/reduce-webfont-size/>

### 6 - Code Split/Tree Shaking:

Depending on the framework you're using, React, Angular, Vue they all have resources to load only the necessary scripts for each page and instead of having a big chunck of javascript/css you will load only the exactly necessary script for a page.

You can use gulp, purgecss, postcss, but most of the frameworks like NextJS, Nuxt will handle that for you. Tailwind has also an awesome feature that automatically strips out any unused css.

<https://purgecss.com/>
<https://web.dev/code-splitting-suspense/>

### 7 - Preload external references

Browser spends time to resolve DNS addresses, etc for  <scripts> and <links>,  if you preload those links you will be able to reduce the response time.

<https://web.dev/preload-critical-assets/>

### 8 - Reduce your server response time.

Depending on your backend structure you can use cache as redis to avoid hits in the database. If you have users from different countries it definitely worth using CDN services as Cloudfront, Cloudfare, Fastly, etc. 

Ecomerce websites are a little bit more tricky as you'll need to bypass cache for logged users, users with items in cart, etc. 

More content to come around this and nginx/apache configuration, cdn services, libraries, etc.

### 9 - Monitoring

We are constantly updating our website, adding new features and it's important to measure if those changes will affect the website performance. You can include tools as lighthouse CI to your deployment pipeline and even add scripts to publish a new version has a low score or issues related to page speed.

### https://web.dev/vitals-tools/

## REFERENCES & MATERIALS

Udacity Course: <https://www.udacity.com/course/website-performance-optimization--ud884>
Book: <https://www.amazon.com/gp/product/B00FM0OC4S/ref=dbs_a_def_rwt_hsch_vapi_tkin_p1_i0>
