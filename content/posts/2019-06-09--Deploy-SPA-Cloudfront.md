---
template: post
title: Deploying Single Page Applications to AWS Cloudfront
slug: /posts/deploy-react-angular-cloudfront/
draft: false
date: '2019-06-09'
description: >-
  We have a sort of different providers to host those web apps. (Heroku, netfly,
  cloudfare, akamai, etc) and a lot of frameworks to develop it (React, Vue,
  Angular, etc). In this article, I will show how it's easy, simple and cheap to
  deploy your web app in a few minutes using AWS S3 & CloudFront
category: Web Development
tags:
  - ''
---


We have a sort of different providers to host those web apps. (Heroku, netfly, cloudfare, akamai, etc) and a lot of frameworks to develop it (React, Vue, Angular, etc). In this article, I will show how it's easy, simple and cheap to deploy your web app in a few minutes using AWS S3 & CloudFront

It's not new that many web application nowadays is SPA (Single Page Application) and it tends to grow a lot.
We have a sort of different providers to host those web apps. ([Heroku](https://www.heroku.com/), [Netfly](https://www.netlify.com/), [Cloudfare](https://www.cloudflare.com/), [Akamai](https://www.akamai.com/), etc) and a lot of frameworks to develop it (React, Vue, Angular, etc). In this article, I will show how it's easy, simple and cheap to deploy your web app in a few minutes using AWS S3 & CloudFront.
I presume you have basic knowledge about AWS before reading this article, if I am wrong, no worries, just do a quick google and you'll find a lot of content. If you are not using AWS, you might find the content about cache useful :)
Note: For this tutorial, we'll follow all steps using AWS Web console interface, although it can be easily done using automatic tools as such as aws-cli, aws cloud formation, etc.

All the files and code are available in this [github repositry](https://github.com/lucashfreitas/react-angular-deploy-s3-cloudfront).

> Why I like AWS Cloudfront?

* [**AWS Lambda**](https://aws.amazon.com/lambda/): My favorite one! AWS introduced Lambda@Edge which allows us to **manipulate requests/responses** and customize the content delivered through the Amazon CloudFront CDN. What if you want to redirect the users when the request comes from a specific location? What if you want to deliver different content if users access your website using mobile devices? What if you want to use services like [Prender.io](https://prerender.io/) to deliver pre-rendered page if the request was made by a search engine bot crawler? All this and much more can be done using AWS Lambda Edge and it’s really powerful and customizable. I‘ll talk more about AWS Lambda in next article and how we can do things such as deliver pre-rendered content for SEO Optimization. [check here some lambda examples](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.htm).
* **Price**: If you manage your CloudFront apps caching in the right way, you’ll save a lot of money
* If you already use other services from AWS you might find easy to keep all in the same place.
* Easy setup and configuration using either aws-cli or aws web console.
* Free ssl certificate, custom gzip, possible to restrict viewer access using cookies or signed urls.
* **Statistics**: Cloudfront provides different types of statistics for your web app: access by device type, access by browser type, access by country, files most requested, cache statistics, etc.
* Integration with Route 53. I’ll talk about that in the last section of this article.
  Reliable: Cloudfront is fast, reliable and used by companies like Spotify and Slack. [Cloudfront case studies](https://aws.amazon.com/cloudfront/case-studies/) , [Stackshare - companies using Cloudfront](https://stackshare.io/amazon-cloudfront)

> What is a single page application?

If you don’t know what is a single page application just have a look at this article written by Neoteric. [What is a single page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)

I divided this tutorial into 8 sections:

1. **General overview of caching and how CloudFront works with S3.**
2. **Create S3 Bucket, make it public read access and enable static website hosting.**
3. **Build our SPA to generate website static files.**
4. **Install, configure and use AWS-CLI (a tool to copy website files to S3 Bucket and send invalidation request to CloudFront)**
5. **Upload our static web site files to the bucket setting correct cache headers**

Dealing with cache in single page apps is really critical, we need to make sure that users will always see the new content after a new deployment/update.
Also if you use cache headers correctly, you will save your budget and your web app will be like a rocketship — Trust me.

6. **Create CloudFront distribution and send an invalidation request.**

We’ll create and setup our cloudfront distribution and learn how to send an invalidation request using aws-cli. Have you ever see the classic issue of SPAs when user needs to clear the cache to see the changes after a new deployment? We need to do that to keep the content always fresh.

7. **Add custom domain and SSL Certificate
   We’ll see how can we easily create a SSL Certificate and attach a custom domain to your distribution**
8. **Review & Next Steps**

We’ll talk about how can we manage our aws cloud resource using automatic tools as aws-cli/aws-cloud formation and how to implement continuous integration/deployment. Also I’ve plans to talk more about AWS Lambda and how it can be really powerful using together cloudfront.

# Caching, CDN, Cloudfront & S3

**What is AWS S3**? As described by AWS - is a simple web services interface that you can use to store and retrieve any amount of data, at any time, from anywhere on the web. Basically, you can store objects and access them through HTTP requests.

A Single Page Application (_a.k.a SPA_) is nothing but a bunch of files including javascript, css, fonts, images,html files, etc and usually has an entry point (**index.html**) which contains all entries and reference to all needed scripts/fonts/css to run our application. These files are usually generated at build time and result as output of build process (We not diving into build process but it’s really important to understand how your application is built. Most part of nowadays frameworks have built-in solutions to build your web app,e.g. angular ([angular-cli](https://cli.angular.io/), [create-react-app](https://github.com/facebook/create-react-app))

## Cache and common issues

Every time when you load a web app the browser downloads all the necessary files (including HTML, javascript, CSS, fonts, etc) to run the application. Let’s suppose that you have an application developed in angular. When you first access the website your browser will download everything and depending on the **cache headers returned in HTTP response** of each file, the browser will cache it, so the next time when you load the website browser will check if it has the file on cache then it won’t be necessary to load the file from server again.

This is really important for website performance (if your website does not use cache you’ll notice that it will lose score at google page speed test tool — [Google page speed tool](https://developers.google.com/speed/pagespeed/insights/).

If you access your browser inspector and go to Network Tabs you can find from where browser fetched the files (some of them came from cache) and also view HTTP cache headers from responses. (they will tell browsers how they should cache your content)

![browser-network-responses](/media/cf-network-response.png "Http Response")

![Response Headers](/media/cf-response-headers.png "Response Headers")

We should be always aware of using cache. I strongly recommend having a read on this [article](https://www.mnot.net/cache_docs/) written by Mark Nottingham to understand how cache headers work under the hood.

## Why cache can be tricky?

Let's suppose that your website has a javascript file served with HTTP header telling browser to cache it for 7 days. Then in the next day, you find a bug and need to update it. If you simply change file and upload it to the server, users that have already accessed your website won't see any change as the file still cached and the browser won't even request the updated javascript file to your server again. We currently have a lot of approaches to solve this problem:

* Change filename after every update: Generally after every build, most part of frameworks already do that using web pack. Your CSS/javascript files name always change after every build. eg. `5.03f99a2add8f74c93cb2.js` become `6.60586bba6b0bca088238.js`. You might have seen some files with queryString params: `myJsFile.js?version=1`, `myJsFile.js?version=2`. Doing that we make sure that after update the user will get the new content, even though if old content was cached on the browser.
* Do not cache `index.html` file: The `index.html` file contains all links to other assets used by your application. After you generate a new build, the file names and link references will also change, so can you imagine what will happens if your browser does not always get fresh index.html? Users that accessed your website before will not get the new index.html files with new references to scripts, css, fonts, etc they must have to clear the cache to get the changes.
* Do not cache `service-worker.js` file: If you are using PWA, I've seen some recommendations to not cache `service-worker.js` file. Please have a look at
  https://stackoverflow.com/questions/38843970/service-worker-javascript-update-frequency-every-24-hours/38854905#38854905, https://github.com/GoogleChromeLabs/sw-precache/issues/332

You might have some questions: How should I decide which files might be cached and for how long?

* If the users need to clear the cache to see any update in your single page application you might need to review your cache policies.
* Be aware of which files you are caching, for how long and what is the impact of that. In this example, we cache everything (js, css, fonts, etc) for 1 day, except HTML files. It can change depending on the situation.
* Every time when you deploy a new version/change to our website all the users should be able to get the updated content after a single page refresh.
* For last, you should keep track of which files compound your web app and decide what is the best cache option for each. e.g: Whenever you add cache to all javascript files and they tend to change, make sure that filename will change after an update as described before.

## Overview of AWS S3 & AWS CloudFront and Caching.

Now we will do a quick overview of how S3 works with Cloudfront. Cloudfront is a [CDN (Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network), if you are not familiar please have a look at this article: [Cloudfare - what is a CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

Basically, Cloudfront CDN will serve your website content across different regions on the globe. So, if you access the website from North America, you request will be redirected to the closest CloudFront EDGE from your location and it will deliver your website content over a secure connection (SSL) and low latency. When you create a distribution you can choose which areas you want:

![Cloudfront Edges](/media/cf-locations.png "Cloudfront Edges Location")



## How CloudFront works and what is the relationship with S3?

Let's now dive into the relationship between CloudFront and S3. Please have a look at the image below:

