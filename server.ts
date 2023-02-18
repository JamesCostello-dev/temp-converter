import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './rabbitmq';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Temperature Converter Microservice');
});

app.post('/convert', async (req, res) => {
    const { temperature, from, to } = req.body;

    const connection = await connect();
    if (!connection) {
        res.status(500).send('Failed to connect to RabbitMQ');
        return
    }

    const channel = await connect().then(conn => conn?.createChannel());

    if (!channel) {
        res.status(500).send('Failed to create RabbitMQ channel');
        return;
    }

    const queue = 'temperature-converter';
    await channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ temperature, from, to })));

    res.send(`Conversion request of ${temperature} ${from} to ${to} queued for processing`);


})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});