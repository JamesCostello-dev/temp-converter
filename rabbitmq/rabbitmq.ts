import amqplib from 'amqplib';

const uri = 'amqp://rabbitmq:5672';

export const connect = async () => {
    try {
        const connection = await amqplib.connect(uri);
        return connection;
    } catch (err) {
        console.log(err)
    }
}