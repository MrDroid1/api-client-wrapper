const assert = require('assert')
const nock = require('nock')

const { address, hash, transaction } = require('./test_data.json')

const Client = require('../index')

describe('Client wrapper', () => {
    const password = 'pass'
    const user = 'user'
    const timeout = 3000
    const defaultRes = { jsonrpc: '1.0' }
    const client = new Client({ password, user, timeout })

    it('should set property', () => {
        assert.equal(password, client.password)
        assert.equal(user, client.user)
        assert.equal(timeout, client.timeout)
    })

    it('should return newAddress', async () => {
        nock('https://remote.btchost/')
        .post('/')
        .reply(200, {
            result: address,
            ...defaultRes
        })

        const newAddress = await client.getNewAddress()

        assert.equal(newAddress, address)
    })

    it('should send to address', async () => {
        nock('https://remote.btchost/')
        .post('/')
        .reply(200, {
            result: hash,
            ...defaultRes
        })

        const newHash = await client.sendToAddress({ address, amount: 10 })

        assert.equal(hash, newHash)
    })

    it('should return transaction', async () => {
        nock('https://remote.btchost/')
        .post('/')
        .reply(200, {
            result: transaction,
            ...defaultRes
        })

        const newTransaction = await client.getTransaction({ hash })

        assert.deepEqual(newTransaction, transaction)
    })

    it('should throw error', async () => {
        const error = {
            code: -32000,
            message: 'jsonrpc error'
        }

        nock('https://remote.btchost/')
        .post('/')
        .reply(200, {
            error,
            ...defaultRes
        })

        try {
            await client.getNewAddress()
        } catch(err) {
            assert.deepEqual(err, error)
        }
    })
})