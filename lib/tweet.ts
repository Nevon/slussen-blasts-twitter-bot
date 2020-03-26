import Twitter from 'twitter-lite'
import TextMessage from './text-message'

export type TwitterCredentials = {
    consumer_key: string,
    consumer_secret: string,
    access_token_key: string,
    access_token_secret: string
}

const EMOJIS = ['💣', '🧨', '💥', '👷‍♀️', '👷‍♂️', '🚧']
const randomEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

export default class Tweet {
    private readonly client: Twitter

    constructor(credentials: TwitterCredentials) {
        this.client = new Twitter({
            subdomain: 'api',
            version: '1.1',
            ...credentials
        })
    }

    async send(message: TextMessage): Promise<void> {
        const status = `${message.text} ${randomEmoji()} #slussen`
        await this.client.post("statuses/update", { status })
    }
}