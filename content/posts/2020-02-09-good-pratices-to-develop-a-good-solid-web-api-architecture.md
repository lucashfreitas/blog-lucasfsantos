---
template: post
title: Good Pratices to Develop a good/solid Web API Architecture
slug: good-pratices-to-develop-web-api
draft: true
date: 2020-02-09T07:41:37.896Z
description: test
category: web-api
---
It has been a while since I did the last post, I was really busy over last months, but let's get's on a really important topic and I have seen many mistakes over the last years is about building a solid  **architecture.** 

You will get better understanding if you are already familiar with Web-api, if not no worries, here you go some good explanations: 

* [MuletSoft-What is a web api](https://www.youtube.com/watch?v=s7wmiS2mSXY)
* [HackerNoon - What are web apis](https://hackernoon.com/what-are-web-apis-c74053fa4072)

I have been working for Web Api's in the last 5 years and I have done and seem some projects lacking a well defined architecture which results in more bugs, more time to develop new features. I will **not cover** all the differences between different architectures, if we are using micro services we can use a different approach/architecture, for example. So this tip will be most related with tradicional **WEB API** mvc frameworks. 

The main mistake that I have been seeing is a lacking of separation between the **HTTP/Web application Layer** from **Business Application Layer**. I will explain what is these two: 

## HTTP/Web/Controllers application Layer

Here is what lives all the Web application core services as **Requests** and **Responses** payload,  Authentication, Validation, Cache, etc. In this layer we will receive and handle all the requests, process some operation and return the result. (_AKA Controllers/Midllewares in MVC frameworks_)

The returned response will be based on the result of the operation that you have done based on input's received (request parameters). 

The main mistake that I have seem in this layer is the use of all the business logic on controllers, so we ending having some controllers methods with over than 100 lines, the downsize: 

1. Hard to test: If you are using TDD, is hard to test controllers with have many duties
2. Hard to maintain, if you find a bug you would have to find all the 
3. Most part of the bugs sits on business layer/logic of your application.


Usually what is the common flow that we follow in each controller method: 

1 - Check Authentication (if request is not authenticated returns \
2 - Validate Request (If request is not valid returns Bad response)\
3 - 

\
What is the most important in your web api is the business logic, so if you abstract your business logic it will be a way more clear.
