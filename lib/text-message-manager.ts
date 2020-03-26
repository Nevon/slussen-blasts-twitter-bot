import { DynamoDB } from 'aws-sdk'
import TextMessage from "./text-message";

export default class TextMessageManager {
    private readonly dynamo: DynamoDB;
    private readonly tableName: string;

    constructor(dynamo: DynamoDB, tableName: string) {
        this.dynamo = dynamo
        this.tableName = tableName
    }

    async seen(message: TextMessage): Promise<boolean> {
        const { Item } = await this.dynamo.getItem({
            TableName: this.tableName,
            Key: {
                messageId: {
                    S: message.messageId
                }
            },
            ProjectionExpression: "messageId"
        }).promise()

        return Item != null
    }

    async save(message: TextMessage): Promise<void> {
        await this.dynamo.putItem({
            TableName: this.tableName,
            Item: {
                messageId: { S: message.messageId },
                text: { S: message.text },
                timestamp: { S: message.timestamp.toISOString() },
                ttl: { N: ((new Date().getTime() + 5 * 60 * 1000) / 1000).toString() }
             }
        }).promise()
    }
}