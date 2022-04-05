# NestJS with AWS Secrets Manager

NestJS with AWS Secrets Manager to build a small web application and fetch some variables from Secret Manager with the JavaScript SDK provided by AWS.

## Starting the NestJS project

We should already have Node.js and npm or yarn installed. We proceed to globally install the NestJS cli and start a project named nestjs-secrets-manager.

```bash
$ npm i -g @nestjs/cli
$ nest new nestjs-secrets-manager
$ cd nestjs-secrets-manager
```

In the project, we need to install the AWS SDK for Node.js

```bash
$ npm i aws-sdk
```

NestJS has some initial files in the src directory, with which you can make a "Hello World!" at http://localhost:3000 the service should be started

```bash
$ npm run start:dev
```

In the web browser you will see the "Hello World!" of the base project.

## Creating the module and service to use the AWS SDK

We are going to generate a module and a service type provider to make the Secrets calls, it will be called config

```bash
$ nest generate module config
$ nest generate service config
```

Using the above statements, not only were the module and service generated, but the ConfigService was imported into the module. We only need to export the ConfigService when the ConfigModule is instantiated.

```Javascript
import { Module } from '@nestjs/common';
import { awsConfigService } from './aws-config.service';

@Module({
  providers: [awsConfigService],
  exports: [awsConfigService]
})
export class awsConfigModule {}
```

We are going to modify the awsConfigService to create some methods and use the AWS SDK, calling the Secret Manager API. We already have the SDK installed in the project, so we proceed to import and create variables that will be useful when making the instance of the class.

```JavaScript
import { Injectable } from '@nestjs/common';
import SecretsManager from 'aws-sdk/clients/secretsmanager';

@Injectable()
export class ConfigService {
  private readonly region = '';
  private readonly secretName = '';
  private readAWSConfig = true;
  private readonly envConfig = {};
}
```

In the envConfig object we will store all the information stored in the Secret.

We make a method to get the values ​​of the envConfig object when it holds the Secret Manager information.

```JavaScript
public async get(key: string): Promise<string> {
  if (this.readAWSConfig) {
    await this.upAWSSecrets();
  }
  return this.envConfig[key] ? this.envConfig[key] : "Doesn't exist";
}

public getStatic(key): string {
    return this.envConfig[key] ? this.envConfig[key] : "Doesn't exist";
  }
```

The previous method evaluates if we should read the Secrets with the readAWSConfig variable, if the reading should be done, the upAWSSecrets method is called.

```JavaScript
public async upAWSSecrets() {
  let error;

  let client = new SecretsManager({
    region: this.region,
  });

  const secrets = await client
    .getSecretValue({ SecretId: this.secretName })
    .promise()
    .catch(error => (error = error));

  if (error) {
    if (error.code === 'DecryptionFailureException')
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw error;
    else if (error.code === 'InternalServiceErrorException')
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw error;
    else if (error.code === 'InvalidParameterException')
    // You provided an invalid value for a parameter.
    // Deal with the exception here, and/or rethrow at your discretion.
      throw error;
    else if (error.code === 'InvalidRequestException')
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw error;
    else if (error.code === 'ResourceNotFoundException')
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw error;
  }

  const resultSecrets = JSON.parse(secrets.SecretString);

  for (let key in resultSecrets) {
    this.envConfig[key] = resultSecrets[key];
  }

  this.readAWSConfig = false;
}
```

The above code is taken in a measure from the example of using the SDK and basically starts the call to the Secret Manager API, evaluates the possible errors, in the for we assign all the variables to the envConfig object and then we pass the reading of the Secrets to false .

## Using the module and service Config

The Config module has already been imported into the main App module, so we proceed to create a couple of new methods in the controller that ConfigService will use to call some variables.

```JavaScript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { awsConfigService } from './config/aws-config.service';

@Controller()
export class AppController {
  builder(
    private readonly appService: AppService,
    private readonly configService: awsConfigService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/firstPhrase')
  async getFirstPhrase(): Promise<string> {
    return await this.configService.get('FIRST_PHRASE');
  }

  @Get('/secondPhrase')
  async getSecondPhrase(): Promise<string> {
    return await this.configService.get('SECOND_PHRASE');
  }

  @Get('threePhrase')
  getThreePhrase(): string {
    return this.configService.getStatic('SOME_VAL');
  }
}
```

## Conclution

NestJS with AWS Secrets Manager can make it easy for us to create a web application, at the same time it gives us the necessary security to deploy them, especially in microservices and with the ease to do it quickly.

## credits:

https://github.com/ajdelgados/nestjs-aws-secrets-manager
&
google translate
