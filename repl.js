const repl = require('repl')
const Consumer = require('./consumer')
const Producer = require('./producer')
const SQS = require('./sqs')

// start repl with custom context
const r = repl.start('> ')
Object.defineProperty(r.context, 'sqs', {
    configurable: false,
    enumerable: true,
    value: new SQS()
})
Object.defineProperty(r.context, 'Consumer', {
    configurable: false,
    enumerable: true,
    value: Consumer
})
Object.defineProperty(r.context, 'Producer', {
    configurable: false,
    enumerable: true,
    value: Producer
})
