export const fahrenheitToCelsius = (f: number) => {
    return (f - 32) * (5 / 9);
}

export const celsiusToFahrenheit = (c: number) => {
    return (c * (9 / 5) + 32);
}