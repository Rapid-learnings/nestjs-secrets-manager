import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import SecretsManager from "aws-sdk/clients/secretsmanager";

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  private readonly region = this.configService.get("AWS_REGION")
    ? this.configService.get("AWS_REGION")
    : "YOUR_AWS_REGION";
  private readonly secretName = this.configService.get("AWS_SECRET_NAME")
    ? this.configService.get("AWS_SECRET_NAME")
    : "YOUR_AWS_AWS_SECRET_NAME";
  private readAWSConfig = true;
  private envConfig = {};

  public async get(key: string): Promise<string> {
    if (this.readAWSConfig) {
      await this.upAWSSecrets();
    }
    return this.envConfig[key] ? this.envConfig[key] : "Doesn't exist";
  }

  public getStatic(key): string {
    return this.envConfig[key] ? this.envConfig[key] : "Doesn't exist";
  }

  public async upAWSSecrets() {
    let error;
    const client = new SecretsManager({
      region: this.region,
    });

    const secrets = await client
      .getSecretValue({ SecretId: this.secretName })
      .promise()
      .catch((err) => (error = err));

    if (error) {
      if (error.code === "DecryptionFailureException")
        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === "InternalServiceErrorException")
        // An error occurred on the server side.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === "InvalidParameterException")
        // You provided an invalid value for a parameter.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === "InvalidRequestException")
        // You provided a parameter value that is not valid for the current state of the resource.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === "ResourceNotFoundException")
        // We can't find the resource that you asked for.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
    }
    const resultSecrets = JSON.parse(secrets.SecretString);

    // eslint-disable-next-line prefer-const
    for (let key in resultSecrets) {
      this.envConfig[key] = resultSecrets[key];
    }

    this.readAWSConfig = false;
  }
}
