---
template: post
title: 'WEB APIs: Important Concepts for beginners: Business Logic x HTTP Layer'
slug: web-api-business-logic-vs-http-layer
draft: false
date: 2020-09-17T08:41:37.896Z
description: >-
  In this short post, I will focus mainly on giving an idea/mindset of
  view/separate the HTTP Layer/Controllers vs Business Roles. So this tip will
  be most related to traditional Web MVC frameworks. Does not matter if you are
  developing it using  Ruby, C#, Java, or Javascript, for example, the concept
  can be applied to different languages and frameworks.
category: web-api
tags:
  - web-api solid http mvc
---
It has been a while since I did the last post, I was really busy over the last months, but let's gets on a really important topic when deciding on how to build your web API.

You will get a better understanding if you are already familiar with Web APIs, otherwise here you go some good explanations:

* [MuletSoft-What is a web api](https://www.youtube.com/watch?v=s7wmiS2mSXY)
* [HackerNoon - What are web apis](https://hackernoon.com/what-are-web-apis-c74053fa4072)

I have been working for Web Api's for the last years and I **have** seemed projects lacking a well-defined architecture which results in more bugs, more time to develop new features, and more time for new developers to understand the code.

I will **not cover** all the differences between all possible architectures/frameworks & cases as I don't believe there is a "magic" architecture that would fit for all cases, I believe instead that a good architectural decision should be based on each project needs/timeline and the team skills. I like to think about how it will improve team productivity and make the code less buggy and easy to maintain. 

One of the questions I ask my self when starting to develop a new project is: 

> If I need to fix some bug & change an existent feature, how easy/guessable is to identify where exactly I need to go to fix this bug? Which folder, which file, which method, which line of code?
>
> How easy is to test this code?

As developers, we know how good is to work in a project with a clear architecture, where the folder structures and the code are organized in a intuitive and easy way! It saves time and money!

What I mean with this post might not make sense for all cases and you might see production systems using a different approach, by the way, we have many interesting topics and architectures to discuss as for example DDD, CQRS & Event Sourcing, but hopefully, I will talk about them in a separated blog post.

> In this short post, I will focus mainly on giving an idea/mindset of view/separate the HTTP Layer/Controllers vs Business Roles (Services, Domains). So this tip will be most related to traditional MVC Frameworks. Does not matter if you are using  Ruby, C#, Java, or Javascript, for example, the concept can be applied to different languages and frameworks.

One of the biggest problems that I have seen when maintaining web APIs is to find `Controllers` with a huge amount of code. I've found controllers with over 500 lines of code for each method. 

I believe that of the most importants principles of clean code and SOLID is the single responsability, a \`class\` shouldn't have many duties and try to do many things, it should be specific and should do specific things.

I will not go through technical architectural steps but instead, I will try to share my a different view about the separation of concerns between the **HTTP LAYER/CONTROLLERS layer** vs **BUSINESS LOGIC/DOMAIN LAYER.**

## The Business Logic/Domain Layer

The **Business Logic/Domain** layer is responsible to implement all the BUSINESS NEEDS, it's the core part of your system and it's directly related to the business rules. This layer will implement all your client needs, let's suppose the person who hired you to build a system wants to add a new customer to the database, this layer will be responsible to receive the `input` from the front end application, do validations and insert the data on the database and return a result telling if the action was successful or not.

The most valuable part of any **enterprise** system is usually this layer as it is directly related to your user's needs This layer is directly related to our database, even though if we have the database operations in a different layer using repository patterns.

This layer usually contains pieces of code commonly called `Services` that executes important task to implement the Business Roles/Needs, for example as add a User:

```jsx
service USER_SERVICE {

/*The database connection will be available at the user services.
  This could be done using Dependency injection*/

	const databaseConnection;  // database connection
	const loggerService;  // Another service to add l

	addUser(const input) {
		try {
	
		if(IsNullOrEmpty(input->email)) {
			return { error: "Invalid_Email", success: false, validation: false} 
	  } 
	
		var existentUser = 
	   databaseConnection->users->getFirst(u => u.email === input.email)
	
	  if(existentUser) {
	   return { error: "Email_Already_Exists", success: false, validation: false}
	   }
			
	
		var newUser = {
	   email: input->email,
	   name: input->name
	   }
	   
	   databaseConnection->users->add(newUser)
     
     return { success: true}
     
     }
    
     catch (error) {
     loggerService->log(error)
     return { success:false}
     }
	}
```

This is just a pseudo-code of a service that receives an input, does some validations, and add a new user in the database. 

This service can now be used whenever any part of the system needs it. I will show how it can be done using Dependency Injection in the next blog posts.

All right, now you are familiar with the Business/Domain Layer, let's jump to the next one!

## The HTTP/Controller Layer

The HTTP Layer will be a way to **EXPOSE** and **ALLOW** a third party application (could be either a front end application written in react, a mobile app, or even an IoT device like a camera, your fridge) to do transactions, execute tasks, and change data in on your system.

Here is what lives all the Web application components as **Requests** and **Responses** payload, Authentication, Validation, Cache, etc. In this layer, we will receive and handle all the requests, process the operation, and return the **result (**could be a JSON payload or an HTML view) to the users. API Routes,  Middlewares, Controllers are directly related to this layer.

Sometimes I have seen all business logic implementation happening in this layer, on the controllers, so we ending having some **controllers methods with over 300 lines.** 

Many production systems use this approach and I don't want to create a bias that it's terrible, but alongside my developer experience it difficult a lot understand/testing and maintaining features. I Have  listed some reasons for that:

1. **Hard to understand and maintain**: Let's suppose that:  I found a bug on my reactjs application on the API request to add a user ⇒ let's see what's going on the backend? ⇒ the post request to add User implementation has over 500 lines on the controller, a lot of if and else, etc 😱
2. Most part of the bugs sits on the business layer/logic of your application
3. Impossible to reutilize the code in two different controllers: Let's suppose that the User Service has a method `getUser` and needed to be used in two different controllers
4. Hard to test: If you are using TDD, is hard to test controllers as it has many duties. 

Let's imagine that you want to develop an API to allow a frontend or a mobile application to add new CARS to the database and you want to display it in a frontend or mobile application. You will probably map a new route something like `/cars` to a controller method handler, for example:

```jsx
USER_CONTROLLER extends BASE_CONTROLLER {

	/* User Service is available to the controller*/
  var userService

	constructor(userService) {
	    this.userService = service;
  }

  
	/* The add user method is mapped to a ROUTE, for example: api/cars*/

	addUserRequestHandler(var request) {
			
		
			const result = userService->addUser(request->data)
		  if (!result->validation) {
			return HTTP.BAD_REQUEST("Ops.. Some invalid parameter")
      }

      if(!request->success) {
	       return HTTP.ERROR("Ops.. something bad happened")
      }

   
			return HTTP.OK("All good! User successfully added")
		  
}
```

This is just a pseudo code to explain how the controller usually much cleaner focusing only in handle request/response, but you might be wondering how the service class is available to the controller just by passing it inside a constructor: this is done using `dependency injection`, which is another important topic to understand if you want to build a clean architecture.

There are other many techniques and libraries like that we can help us to perform common tasks as validation, caching, authentication/authorization, mapping entities to JSON responses, etc.

I've developed a quick demo that shows an example of how having the controllers layer separately from your domain layer:

[https://github.com/lucashfreitas/serverless-clean-api-domain-example](https://github.com/lucashfreitas/serverless-clean-api-domain-example/tree/master/src)

This example doesn't go further on all the concepts but tries to  give a general idea of how separate concerns when building an web API but it's clear to see that difference between the domain and HTTP layer. For this example, I've used AWS Lambda/API Gateway and Serverless framework, but I will cover common frameworks as express, NestJS in the next blog posts.

I have also developed an example that have tests and uses specific classes for every requests, methods in Laravel that is available here: <https://github.com/lucashfreitas/laravel-web-api-clean-code>.

## GOING FURTHER

When we talk about SOLID and single responsability we can apply some techniques to make the code even cleaner. 

* What about organizing folders by feature instead of spliting things by type? This usually can bring problems for big problems and usually is not scalable. 
* What about creating a single class for every request, and this class would be responsable to validate the inputs?
* What about creating a specific class to handle every api request?
* What about using the controller only to delegate the incoming request to the correct handler?
* I have created this repository that shows an example that use some OOP concepts that allow us to abstract common things and focus on business roles. <https://github.com/lucashfreitas/laravel-web-api-clean-code>

## FINAL THOUGHTS

The main idea of this post is to share a mindset of seeing the HTTP Layer and the Business Layer and architect them in an efficient way.

As I said before, there is no single truth in the software development world, you should understand and decide what is the best approach based on your team/project context, but without following clean code/SOLID principles it will become hard to scale and for other developers to work in your code. 

I do have a lot more subjects I want to cover in other blog posts as: 

* **HTTP Protocol:** Is really important to understand this before jumping to web API implementation. What status code should you use?
* **REST Principle:** How to semantically structure your routes, http methods and status code?
* Cache, Security, Middleware, Validation
* DTOS (Data Transfer Objects), Models, Entities: How to relate & map my database entities to my frontend views.
* SOLID (It will help you apply concepts to build a rock solid architecture and keep your code clean).




See you in the next post!
