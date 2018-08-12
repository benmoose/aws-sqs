const SQS = require('./sqs')
const uuid = require('uuid')

class Consumer {
    constructor (queueName) {
        this.queueName = queueName
        this.id = uuid.v4()
        // create service
        this.sqs = new SQS()

        console.log(`Consumer ${this.id} started`)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    start () {
        let count = 0
        this.timer = setInterval(() => {
            this._sendMessage(`${this.id}-${++count}`)
        }, 1500)
    }

    stop () {
        clearInterval(this.timer)
    }

    _sendMessage (payload) {
        this.sqs.receiveMessages(this.queueName, { autoDelete: true })
            .then((message) => {
                if (message.Messages) {
                    console.log(`received ${message.Messages.length} messages`)
                } else {
                    console.log('No messages received')
                }
            })
    }
}

module.exports = Consumer
