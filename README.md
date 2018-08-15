# AWS SQS

This repository contains a simple dummy project I used to learn about queues on AWS. The project uses **producers** and **consumers** to mock two services that need to communicate.

### Usage

 1. Check you have an AWS credentials file in the appropriate place.
    On Linux systems this is at `~/.aws/credentials`.
 2. Start the repl `node repl.js`.
 3. Create a queue.
    ```js
    > sqs.createQueue('queue-name')
    ```
    If you don't pass a queue name then a unique one is generated for you.
 4. Create a producer.
    Producers send messages to the queue, roughly one every 750ms.
    ```js
    > const p = new Producer('your-queue-url')
    > p.start()
    ```
    You can create as many producers as you want.
 5. Create a consumer. Consumers read and delete from the queue.
    ```js
    > const c = new Consumer('your-queue-url')
    > c.start()
    ```
 6. You can stop both producers and consumers with the stop method.
    To demonstrate how a queue decouples producers and consumers try stopping all the consumers and see how the producers continue sending.
    Then stop the producers and restart the consumers.
    The two ends of the queue are completely isolated from each other.
    ```js
    > p.stop()
    > c.stop()
    ```
