---
template: post
title: 'AWS CDK: Running Integration Tests in AWS cloud environment on CI/CD.'
slug: aws-cdk-integration-tests
draft: true
date: 2022-05-01T11:57:43.146Z
description: >-
  With the evolution of tools that allow us to deploy infrastructure in a few
  seconds is getting easier and easier to spin up Cloud environments in a blink
  of an eye! This article brings a simple demo of how we can do it and integrate
  it with CI/CD tools like Github actions.
category: 'cloud, AWS, AWS-CDK, Tests'
tags:
  - web
  - ''
---
With the evolution of tools that allow us to deploy infrastructure in a few seconds is getting easier and easier to spin up Cloud environments in a blink of an eye!

I won't dive deep into the discussion of the differences between unit/end to end vs integration tests, but I do believe that integration tests are one of the most valuable tools to validate our systems & business rules. I'd recommend a read on [Kent C Dods](https://kentcdodds.com/blog/write-tests) article on this. 

The most important part of any system/software is usually the businesses roles, the user histories, e.g a User wants to add a product to the database, so integration tests allow to test individual roles and usually don't take as much time to develop end to end tests across a full-stack application. 

We have great tools that offer and try to mock the same environment that we would have in a real cloud environment, for example in memory-databases, and tools like [LocalStack](https://github.com/localstack/localstack)  (which I personally think it's great). 

But, what if we could run integration tests on real cloud environments?

With tools like Terraform, AWS CDK is totally possible to do that. Usually, whenever a new deployment is done we'd need to:\
\
1 - Create all the cloud resources\
2 - Seed(add fake data to database, initialize resources)\
3 - Setting up configuration/environment variables with the new stack\
4 - Running integration test\
5 - Removing the Stack.

Obviously when we are dealing with real-world scenarios and huge applications is not that simple, but I want to show a simple repository that displays how we can do it.

## Let's get into action:

I have created [this repository](https://github.com/lucashfreitas/aws-cognito-auth) with an abstraction of AWS Cognito client and I was thinking about how to test it and I decided to run tests directly on real AWS environment.\
\
[https://github.com/lucashfreitas/aws-cognito-auth. ](https://github.com/lucashfreitas/aws-cognito-auth)

I often use [google zx](https://github.com/google/zx) to develop scripts in nodejs, I found it super helpful and easy to use.

In this project example, our pipeline definition is very clean as it is running a few npm scripts that execute the commands defined in my google zx scripts.

Let's start by having a look at the github actions workflow file:

[https://github.com/lucashfreitas/aws-cognito-auth/blob/main/.github/workflows/test-pipeline.yml ](https://github.com/lucashfreitas/aws-cognito-auth/blob/main/.github/workflows/test-pipeline.yml)

![Github Pipeline](/media/screen-shot-2022-05-02-at-12.23.50-am.png "Github Pipeline")

Note that we basically have three main scripts:

**\- aws-setup:** Setup an AWS Profile using the CLI.\
**\- infra:up:** Creates and Deploys the cloud resources using CDK.\
**\- test:integration:** Run the integration tests using jest\
**\- infra:destroy:** Destroy the infra using CDK.

1. The setup script is quite simple. It creates a profile and it will also trigger an error if the computer doesn't have the AWS CLI installed.

```typescript
#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

try {
  await $`aws --profile ${config.profile} configure set aws_access_key_id ${config.accessKey}`;
  await $`aws --profile ${config.profile} configure set aws_secret_access_key ${config.secretKey}`;
  await $`aws --profile ${config.profile} configure set region ${config.region}`;

  console.log(
    chalk.green(`AWS PROFILE ${config.profile} successfully created`)
  );
} catch (error) {
  console.error(error);
}
```

2. The **infra-up** script is also straightfoward. It calls the CDK deploy passing the profile. Note how ZX is quite handy as we can pass any environment setting. configuration to the command without any extra effort.

```typescript
#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

try {
  const deploy =
    await $`cd infra && yarn up --require-approval never --profile ${config.profile}`;
  console.log(chalk.green(`AWS Stack deployed`), deploy);
} catch (error) {
  console.error(error);
}
```

3. The integration tests need to do a small trick to read the environment settings once the stack is. CDK offer tools to save the stack output values into JSON files, we can use the `CnfOut` attribute for that:

```typescript
 const userPoolClientSecret = describeCognitoUserPoolClient.getResponseField(
      "UserPoolClient.ClientSecret"
    );
    new cdk.CfnOutput(this, "ClientSecret", {
      value: userPoolClientSecret,
    });

    new CfnOutput(scope, "UserPoolId", {
      value: this.userPoll.userPoolId,
    });

    new CfnOutput(scope, "UserClientId", {
      value: userPoolClient.userPoolClientId,
    });
```

Then, in the CDK Deploy command, we can specify an **\--outputs-file** option, and our settings will be saved into the specified json file. 

`npx cdk deploy AwsCognitoTestStack --outputs-file ./cdk-outputs.json`

Before starting our tests we need to read the new environment settings from the Deployed stack. In this example. I created an output.ts file that reads and validate the settings

```typescript
export const getOutput: () => Output = () => {
  const cdkOutput = require("./cdk-outputs.json");

  const poolId = cdkOutput.AwsCognitoTestStack.UserPoolId;
  const clientId = cdkOutput.AwsCognitoTestStack.UserClientId;
  let clientSecret: string = "";
  for (const [key, value] of Object.entries(cdkOutput.AwsCognitoTestStack)) {
    if (key.indexOf("ClientSecret") !== -1) {
      clientSecret = value as string;
    }
  }

  
  if (!clientId || !poolId || !clientSecret) {
    throw new Error("Configuration not found in cdk output.");
  }

  return {
    CognitoUserClientId: clientId,
    CognitoUserPoolId: poolId,
    CognitoClientSecret: clientSecret,
  };
};
```

For last, on my tests setup files, I just read the output and set that in the environment variables, and then we are all ready to construct our libraries/clients using real resources in the cloud. See the `globalSetup` on jest file.

```typescript
import { getOutput } from "../infra/output";
import "dotenv/config";
export default async function () {

  // is running on CI environment, need to manually set environment variables from  cdk deploy
  const output = getOutput();
  process.env.AWS_SANDBOX_COGNITO_CLIENT_ID = output.CognitoUserClientId;
  process.env.AWS_SANDBOX_COGNITO_CLIENT_SECRET = output.CognitoClientSecret;
  process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID = output.CognitoUserPoolId;

  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID ||
    !process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID ||
    !process.env.AWS_SANDBOX_COGNITO_CLIENT_SECRET
  ) {
    throw new Error(`AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY,
    AWS_SANDBOX_COGNITO_USERPPOL_ID,
    AWS_SANDBOX_COGNITO_CLIENT_ID,
    AWS_SANDBOX_COGNITO_CLIENT_SECRET
    must be set up for the cognito integration tests. `);
  }
}
```

So after these steps, we are able to execute our tests on using real cloud environment and call the script to destroy the stack once the tests are finished.

> It's important to notice that google zx doesn't garantee that the secrets won't be printed into the terminal, but the CI/CD tools like github actions will hide the environment variables outputed by the ZX scripts.

In this example, the whole test took only 4 minutes (Of course this will be much more in large projects).

![Pipeline Execution](/media/screen-shot-2022-05-02-at-12.50.54-am.png "Pipeline Execution")

![Pipeline Execution](/media/screen-shot-2022-05-02-at-12.50.38-am.png "Pipeline Execution")



## That's it

This was just a quick demo project of how we can do it and integrate with CI/CD tools like github actions. As I mentioned before you can even create databases, seed them, test business roles, etc.

Thanks for reading and please share your thoughts
