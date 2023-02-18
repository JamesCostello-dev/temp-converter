import { connect } from './rabbitmq';
import { fahrenheitToCelsius, celsiusToFahrenheit } from './temperature-converter';

const start = async () => {
    const connection = await connect();

    if (!connection) {
        console.log('Failed to connect to RabbitMQ');
        return
    }

    const channel = await connection.createChannel();

    const queue = 'temperature-converter';
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (message) => {
        if (message) {
            const { temperature, from, to } = JSON.parse(message.content.toString());

            let convertedTemperature = 0;
            if (from === 'fahrenheit' && to === 'celsius') {
                convertedTemperature = fahrenheitToCelsius(temperature);
            } else if (from === 'celsius' && to === 'fahrenheit') {
                convertedTemperature = celsiusToFahrenheit(temperature);
            } else {
                console.log(`Invalid conversion from ${from} to ${to}`);
            }

            console.log(`Converted ${temperature} ${from} to ${convertedTemperature}`)
        }
    }, { noAck: true });
}

start();