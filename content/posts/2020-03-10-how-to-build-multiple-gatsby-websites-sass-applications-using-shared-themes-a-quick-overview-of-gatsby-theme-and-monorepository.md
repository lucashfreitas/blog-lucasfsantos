---
template: post
title: >-
  How to build multiple Gatsby websites/SaaS applications using shared themes .
  A quick overview of gatsby theme and monorepository.
slug: gatsby-react-shared-theme-monorepository
draft: false
date: 2020-03-10T09:00:09.587Z
description: >-
  In many situations, especially for SaaS applications, we can have multiples
  web applications using the same components, layouts, features, services, etc.


  Let's imagine you have to set up the same web application with the same data
  structure for different customers, then you might need to change little things
  such as images, colors, and all the data with is sitting on your backend CRM
  system. (I will use contentful in this example).


  We will use Gatsby Theme which is perfect for this situation. We'll share
  components, services, graphQL queries, pages, everything!


  It's easy, simple to maintain & deploy.
category: react gatsby web-development javascript
tags:
  - gatsby react javascript web-development
---
![gatsby-theme](/media/gatsby-theme-right.png "Gatsby Theme Architecture")

Let's imagine that you have a SaaS product with same base layout/components and backend structure for all clients, but each customer will have  different colors, images, logos, styling and of course, data sources.

In this case, instead of setting up many different web applications, you can have a base application (we will use gatsby theme) which will have all common components, api calls, business logic but with different data sources (different api sources, different contentful spaces and different styling (colors, typography, etc).

The solution should also be flexible to allow us to add features/components to each web application separately. 

This can save a lot of time and resource, because we can set up most part of the code base, logic using a shared gatsby theme which will be used for all websites

In this sample, we will use monorepository structure to achieve that. 

It;s under development and will be released on the next days. All the code will be available at this [git repository](https://github.com/lucashfreitas/gatsby-monorepository-shared-theme) when it's done. :)
