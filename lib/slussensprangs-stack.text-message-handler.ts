import { APIGatewayEvent, Handler } from 'aws-lambda'
import TextMessage from './text-message'
import TextMessageManager from './text-message-manager'
import { SecretsManager, DynamoDB } from 'aws-sdk'
import Tweet, { TwitterCredentials } from './tweet'

type APIGatewayProxyResponse = {
    statusCode: number,
    headers?: {
        [x: string]: string
    },
    body?: string
}

const response: APIGatewayProxyResponse = {
    statusCode: 200,
}

const tableName = process.env.MESSAGES_TABLE_NAME!
const region = process.env.AWS_REGION
const twitterSecretArn = process.env.TWITTER_CREDENTIALS_ARN!
const dynamo = new DynamoDB({ region });
const manager = new TextMessageManager(dynamo, tableName);
const secretsManager = new SecretsManager({ region })

export const handler: Handler<APIGatewayEvent, APIGatewayProxyResponse> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResponse> => {
    const message = TextMessage.from(event)
    console.log('Received message', {
        message,
        event
    })

    if (!message) {
        return response
    }

    if (await manager.seen(message)) {
        console.log('Received duplicate message, ignoring', { message })
        return response;
    }

    const { SecretString } = await secretsManager.getSecretValue({ SecretId: twitterSecretArn }).promise()
    const twitterCredentials = JSON.parse(SecretString!) as TwitterCredentials
    const twitter = new Tweet(twitterCredentials)
 
    await twitter.send(message)
    await manager.save(message)

    return response
}