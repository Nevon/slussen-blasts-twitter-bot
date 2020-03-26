import { Stack, Construct, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { Runtime } from '@aws-cdk/aws-lambda'
import { Table, AttributeType, BillingMode, StreamViewType } from '@aws-cdk/aws-dynamodb'
import { PolicyStatement } from '@aws-cdk/aws-iam'

const TWITTER_CREDENTIALS_ARN = process.env.TWITTER_SECRETS_SSM_ARN!

export class SlussensprangsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'text-messages', {
      partitionKey: {
        name: 'messageId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,
      timeToLiveAttribute: 'ttl',

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    })

    const handler = new NodejsFunction(this, 'text-message-handler', {
      runtime: Runtime.NODEJS_12_X,
      minify: true,
      environment: {
        MESSAGES_TABLE_NAME: table.tableName,
        TWITTER_CREDENTIALS_ARN: TWITTER_CREDENTIALS_ARN
      }
    })

    table.grantReadWriteData(handler)
    handler.addToRolePolicy(new PolicyStatement({
      resources: [ TWITTER_CREDENTIALS_ARN ],
      actions: [ 'secretsmanager:GetSecretValue' ]
    }));

    const api = new LambdaRestApi(this, 'text-message-api', {
      handler,
      proxy: true
    })

    const key = api.addApiKey('slussen-sprangs-api-key');
  }
}
