---
template: post
title: 'WEB API Development for Beginners '
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

I have been working for Web Api's in the last years and I **have**  seem projects lacking of a well defined architecture which results in more bugs, more time to develop new features. I will **not cover** all the differences between different architectures, if we are using micro services, we can use a completely different approach/architecture, for example. \
\
So this tip will be most related with tradicional **`WEB API MVC`**` ``FRAMEWORKS. `

Does not matter if you are developing it using an Object Oriented Language (C#,Java) or Javascript for example, the concept is pretty much applicable to all MVC Framewors,\
\
The main mistake that I have been seeing is a lacking of separation between the **HTTP/Web application Layer** from **Business Application Layer.**

I will not go through technical architectural steps but instead I will try to give a **MINDSET** about the separation of concerns between the **HTTP LAYER** vs **BUSINESS LOGIC/DOMAIN LAYER.**

****

## INTRODUCTION

The **Business Logic/Domain** layer is responsible to implement all the BUSINESS NEEDS, it's the core part of your system and it's directly related to the business rules. Let's suppose that you need to add a new customer in your database, the service layer will be responsible to receive all the parameters from the api (AKA (Dto's)\[https://stackoverflow.com/questions/36174516/rest-api-dtos-or-not].

The most valuable part of any enterprise system is usually the business rules and the requirements.

This layer is directly related to our database, even though if we add another layer for the database (e.g repository pattern)

This layer will be directly "plugued" with the HTTP Layer. 

The HTTP Layer will be a way to EXPOSE or ALLOW a third part system (a front end application written in react for example)

The HTTP/Controllers lands is responsable to CONNECT and DELIVER your services/resource for someone to use (e.g a single page application written in react,angular,etc).



If you have these two questions: 

\- Someone 





If you think in the business that you work on, what is more important? The action that is executed by your service or 





## HTTP/Web/Controllers application Layer

Here is what lives all the Web application components  as **Requests** and **Responses** payload,  Authentication, Validation, Cache, etc. In this layer we will receive and handle all the requests, process some operation and return the result. (_AKA Controllers/Midllewares in MVC frameworks_)

The main mistake that I have seem in this layer is the use of all the business logic on controllers, so we ending having some **controllers methods with over than 100 lines,** the downsize: 

1. Hard to test: If you are using TDD, is hard to test controllers with have many duties
2. Hard to maintain, if you find a bug you would have to find all the 
3. Most part of the bugs sits on business layer/logic of your application.
4. Impossible to reutilize the same function in a different controller

Usually what is the common flow that we follow in each controller method: 

1 - Check Authentication (if request is not authenticated returns \
2 - Validate Request (If request is not valid returns Bad response)\
3 - 

What is the most important in your web api is the business logic, so if you abstract your business logic it will be a way more clear.

The controller should have a really few lines for most part of operations, usually it will try to execute some action calling our services and based on the result it will
