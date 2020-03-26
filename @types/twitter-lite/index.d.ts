/// <reference types="node" />

declare module 'twitter-lite' {
  import { EventEmitter } from 'events';

  interface TwitterOptions {
    /** "api" is the default (change for other subdomains) */
    subdomain: string;
    /** version "1.1" is the default (change for other subdomains) */
    version: string;
    /** consumer key from Twitter. */
    consumer_key: string;
    /** consumer secret from Twitter */
    consumer_secret: string;
    /** access token key from your User (oauth_token) */
    access_token_key?: string;
    /** access token secret from your User (oauth_token_secret) */
    access_token_secret?: string;
  }

  interface AccessTokenOptions {
    key: string;
    secret: string;
    /** If using the OAuth web-flow, set this parameter to the value of the oauth_verifier returned in the callback URL. If you are using out-of-band OAuth, set this value to the pin-code. */
    verifier: string | number;
  }

  interface BearerResponse {
    token_type: 'bearer';
    access_token: string;
  }

  interface TokenResponse {
    oauth_token: string;
    oauth_token_secret: string;
  }

  interface AccessTokenResponse extends TokenResponse {
    user_id: number;
    screen_name: string;
  }

  class Twitter {
    private authType: 'App' | 'User';
    private url: string;
    private oauth: string;
    private config: TwitterOptions;
    private client: any;
    private token: {
      key: string;
      secret: string;
    };

    constructor(options: TwitterOptions);
  
    getBearerToken(): Promise<BearerResponse>;
  
    /** The value you specify here will be used as the URL a user is redirected to should they approve your application's access to their account. Set this to oob for out-of-band pin mode. */
    getRequestToken(twitterCallbackUrl: string | 'oob'): Promise<TokenResponse>;

    getAccessToken(options: AccessTokenOptions): Promise<AccessTokenResponse>;
  
    /**
     * Construct the data and headers for an authenticated HTTP request to the Twitter API
     * @param {string} resource - the API endpoint
     */
    private _makeRequest(method: 'GET' | 'POST' | 'PUT', resource: string, parameters: object): { requestData: { url: string; method: string; }; headers: ({ Authorization: string; } | any); };

  
    /**
     * Send a GET request
     * @param {string} resource - endpoint, e.g. `followers/ids`
     * @param {object} [parameters] - optional parameters
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     *   The `_header` property will be set to the Response headers (useful for checking rate limits)
     */
    public get(resource: string, parameters?: object): Promise<Object>;

    /**
     * Send a POST request
     * @param {string} resource - endpoint, e.g. `users/lookup`
     * @param {object} body - POST parameters object.
     *   Will be encoded appropriately (JSON or urlencoded) based on the resource
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     *   The `_header` property will be set to the Response headers (useful for checking rate limits)
     */
    public post(resource: string, body: object): Promise<object>
  
    /**
     * Send a PUT request 
     * @param {string} resource - endpoint e.g. `direct_messages/welcome_messages/update`
     * @param {object} parameters - required or optional query parameters
     * @param {object} body - PUT request body 
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     */
    public put(resource: string, parameters: object, body: object): Promise<object>
  
    /**
     * 
     * @param {string} resource - endpoint, e.g. `statuses/filter`
     * @param {object} parameters
     * @returns {Stream}
     */
    public stream(resource: string, parameters: object): Stream;
  }

  class Stream extends EventEmitter {
    constructor();
  
    parse(buffer: Buffer): void;
  }

  export = Twitter
}