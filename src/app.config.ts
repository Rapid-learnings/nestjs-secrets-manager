import { SecretsManager } from 'aws-sdk';

export default async () => {
  return await loadSecretsFromAWS();
};

async function loadSecretsFromAWS() {
  try {
    /**
     *  This can be used in development environment
     *  For production always use AWS CLI - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config
     */

    const client = new SecretsManager({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY, // In server we dont need this. This will load automatically from the system.
      secretAccessKey: process.env.AWS_SECRET_KEY, // In server we dont need this. This will load automatically from the system.
    });

    // AWS_SECRET_NAME is a house where our secrets are stored.[ARN]
    const secrets = await client
      .getSecretValue({ SecretId: process.env.AWS_SECRET_NAME })
      .promise();

    const parsedSecrets = JSON.parse(secrets.SecretString);

    // Store secrets to process env
    Object.keys(parsedSecrets).forEach(function (key) {
      process.env[key] = parsedSecrets[key];
    });
  } catch (error) {
    // switch (error.code) {
    //   case "DecryptionFailureException":
    //     // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
    //     // Deal with the exception here, and/or rethrow at your discretion.
    //     break;
    //   case "InternalServiceErrorException":
    //     // An error occurred on the server side.
    //     // Deal with the exception here, and/or rethrow at your discretion.
    //     break;
    //   case "InvalidParameterException":
    //     // You provided an invalid value for a parameter.
    //     // Deal with the exception here, and/or rethrow at your discretion.
    //     break;
    //   case "InvalidRequestException":
    //     // You provided a parameter value that is not valid for the current state of the resource.
    //     // Deal with the exception here, and/or rethrow at your discretion.
    //     break;
    //   case "ResourceNotFoundException":
    //     // We can't find the resource that you asked for.
    //     // Deal with the exception here, and/or rethrow at your discretion.
    //     break;
    //   default:
    //     break;
    // }
    throw error;
  }
}
