const request = require('request-promise-native')
const uuidv1 = require('uuid/v1')

const URI = 'https://remote.btchost/'
const JSONRPC_VERSION = '1.0'
const TIMEOUT = 30000

/**
 * Class representing a client wrapper for remote bitcoin node
 */
module.exports = class Client {
    constructor({
        password,
        user,
        timeout = TIMEOUT
    } = {}) {
        this.user = user
        this.password = password
        this.timeout = timeout
    }

    /**
     * @param {object} object
     * @param {string} object.method - Json-rpc method
     * @param {array|object} object.params - Params for json rpc
     * @return {string|object}
     */
    async _query({ method, params = [] }) {
        const id = uuidv1()
        const options = {
            method: 'POST',
            uri: URI,
            body: {
                jsonrpc: JSONRPC_VERSION,
                id,
                method,
                params
            },
            json: true,
            timeout: this.timeout,
            auth: {
                user: this.user,
                pass: this.password
            }
        }

        const { result, error } = await request(options)

        if (error) {
            console.error(`QUERY_ERROR ${method}`, JSON.stringify(error))
            throw error
        }

        return result
    }

    /**
     * @return {string} - New bitcoin address
     */
    async getNewAddress() {
        const method = 'getnewaddress'
        return await this._query({ method })
    }

    /**
     * @param {object} object
     * @param {string} object.address - Bitcoin address
     * @param {number} object.amount - Amount of bitcoins
     * @return {string} - Transaction hash
     */
    async sendToAddress({ address, amount }) {
        const method = 'sendtoaddress'
        const params = { address, amount }
        return await this._query({ method, params })
    }

    /**
     * @param {object} object
     * @param {string} object.hash - Transaction hash
     * @return {object}
     */
    async getTransaction({ hash }) {
        const method = 'gettransaction'
        const params = { hash }
        return await this._query({ method, params })
    }
}