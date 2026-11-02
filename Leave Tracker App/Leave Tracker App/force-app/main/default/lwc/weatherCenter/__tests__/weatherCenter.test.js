import { createElement } from '@lwc/engine-dom';
import WeatherCenter from 'c/weatherCenter';

describe('c-weather-center', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the weather values in layout items', () => {
        const element = createElement('c-weather-center', {
            is: WeatherCenter
        });
        element.temperature = '22';
        element.pressure = '1012';
        element.humidity = '55';
        element.feelsLike = '21';
        element.tempMin = '19';
        element.tempMax = '25';

        document.body.appendChild(element);

        const layoutItems = element.shadowRoot.querySelectorAll('lightning-layout-item');
        expect(layoutItems).toHaveLength(6);
        expect(Array.from(layoutItems, (item) => item.textContent.trim())).toEqual([
            'Temperature: 22',
            'Pressure: 1012',
            'Humidity: 55',
            'Feels like: 21',
            'Minimum temperature: 19',
            'Maximum temperature: 25'
        ]);
    });
});