const AWS = require('aws-sdk')
const uuid = require('uuid')

// create a bucket name
const bucketName = 'aws-sdk-test' + uuid.v4()
// create name for uploaded object key
const keyName = 'aws-sdk-test.txt'

const bucketPromise = new AWS.S3({
    apiVersion: '2006-03-01',
})
    .createBucket({
        Bucket: bucketName,
    })
    .promise()

bucketPromise.then((data) => {
    const objectParams = {
        Bucket: bucketName,
        Key: keyName,
        Body: 'Hello world from bens mbp 1!',
    }
    const uploadPromise = new AWS.S3({
        apiVersion: '2006-03-01',
    })
        .putObject(objectParams)
        .promise()
    uploadPromise.then((data) => console.log('Successfully uploaded data to ' + bucketName + '/' + keyName))
}).catch((err) => {
    console.error(err, err.stack)
})
