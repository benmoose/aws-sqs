const AWS = require('aws-sdk')
const uuid = require('uuid')

/**
 * SQS represents a single SQS service.
 */
class SQS {
    constructor () {
        const params = {
            apiVersion: this.apiVersion,
            region: this.region,
        }
        // create the service
        this.sqs = new AWS.SQS(params)

        this.createQueue = this.createQueue.bind(this)
        this.deleteQueue = this.deleteQueue.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.receiveMessages = this.receiveMessages.bind(this)
        this.deleteMessages = this.deleteMessages.bind(this)
    }

    get apiVersion () { return '2012-11-05' }
    get region () { return 'eu-west-2' }

    generateQueueName () {
        return `aws-sqs-${uuid.v4()}`
    }

    /**
     * Create a new SQS standard queue with name `queueName`
     * @param {string} queueName 
     */
    createQueue (queueName) {
        if (!queueName) {
            queueName = this.generateQueueName()
            console.log(`No queue name provided. Generating unique queue name: ${queueName}`)
        }

        const params = {
            QueueName: queueName,
        }

        return new Promise((resolve, reject) => {
            this.sqs.createQueue(params, (err, data) => {
                if (err) reject(err)
                else     resolve(data)
            })
        })
    }

    /**
     * Delete Queue
     */
    deleteQueue (queueUrl) {
        const params = {
            QueueUrl: queueUrl,
        }
        
        return new Promise((resolve, reject) => {
            this.sqs.deleteQueue(params, (err, data) => {
                if (err) reject(err)
                else     resolve(data)
            })
        })
    }

    /**
     * Sends a message to the given queue
     * @param {string} queueName 
     * @param {object} params 
     */
    sendMessage (queueUrl, payload) {
        if (!payload) console.warn('Sending message with no payload')

        const params = {
            MessageBody: payload,
            QueueUrl: queueUrl,
        }

        return new Promise((resolve, reject) => {
            this.sqs.sendMessage(params, (err, data) => {
                if (err) reject(err)
                else     resolve(data)
            })
        })
    }

    /**
     * Receives messages from the queue
     * @param {string} queueUrl 
     * @param {object} params 
     */
    receiveMessages (queueUrl, config = { autoDelete: false }) {
        const params = {
            QueueUrl: queueUrl,
            AttributeNames: ['All'],
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5
        }

        const handleAutoDelete = (data) => {
            const receiptHandles = data.Messages
                .map(m => m.ReceiptHandle)
            return this.deleteMessages(queueUrl, receiptHandles)
        }

        return new Promise((resolve, reject) => {
            this.sqs.receiveMessage(params, (err, data) => {
                if (err) reject(err)
                else {
                    if (data.Messages && config.autoDelete) {
                        handleAutoDelete(data)
                    }
                    resolve(data)
                }
            })
        })
    }

    /**
     * Deletes messages from queue
     * @param {string} queueUrl 
     * @param {array<string>} receiptHandles 
     */
    deleteMessages (queueUrl, receiptHandles) {
        const params = {
            QueueUrl: queueUrl,
            Entries: receiptHandles.map((rh, i) => {
                return {
                    Id: i.toString(),
                    ReceiptHandle: rh
                }
            })
        }

        return new Promise((resolve, reject) => {
            this.sqs.deleteMessageBatch(params, (err, data) => {
                if (err) reject(err)
                else     resolve(data)
            })
        })
    }
}

module.exports = SQS
