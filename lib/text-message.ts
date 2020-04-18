import { parse } from 'date-fns'
import { APIGatewayEvent } from 'aws-lambda'

const dateFormat = 'yyyy-MM-dd HH:mm:ss'

const MESSAGE_SUFFIX_REGEX = /\s*Skicka ditt nummer till slussen@stockholm.se för att avanmäla dig från sms-tjänsten\.?\s*/

export default class TextMessage {
    text: string
    messageId: string
    timestamp: Date

    constructor(text: string, messageId: string, timestamp: Date) {
        this.text = text
        this.messageId = messageId
        this.timestamp = timestamp
    }

    static from(event: APIGatewayEvent) : TextMessage | null {
        if (!event.queryStringParameters || !event.queryStringParameters.text) {
            return null
        }

        const timestamp = parse(event.queryStringParameters['message-timestamp'], dateFormat, new Date())
        const text = event.queryStringParameters.text.replace(MESSAGE_SUFFIX_REGEX, '')
        const { messageId } = event.queryStringParameters

        console.log('Parsed message', {
            pre: event.queryStringParameters.text,
            post: text
        })

        return new TextMessage(text, messageId, timestamp)
    }
}