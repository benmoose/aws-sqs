const SQS = require('./sqs')
const uuid = require('uuid')

class Producer {
    constructor (queueName) {
        this.queueName = queueName
        this.id = uuid.v4()
        // create service
        this.sqs = new SQS()

        console.log(`Producer ${this.id} started`)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    start () {
        let count = 0
        this.timer = setInterval(() => {
            this._sendMessage(`${this.id}-${++count}`)
        }, 750)
    }

    stop () {
        clearInterval(this.timer)
    }

    _sendMessage (payload) {
        this.sqs.sendMessage(this.queueName, payload)
            .then(m => console.log('sent message', payload))
    }
}

module.exports = Producer
