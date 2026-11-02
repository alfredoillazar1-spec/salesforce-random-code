import { LightningElement, api } from 'lwc';
import getWeatherDetails  from '@salesforce/apex/WeatherMap.getWeatherMapByCity';
export default class WeatherCenter extends LightningElement {
    inputCityName = '';
    weatherDetails = {};
    showWeatherDetails = false;


    handleInputChange(event) {
        this.inputCityName = event.detail.value;
    }

    handleWeatherDetails() {
        getWeatherDetails({cityName : this.inputCityName})
        .then((result) => {
            this.weatherDetails = result;
            this.showWeatherDetails = true;

        })
        .catch((error) => {
            this.showWeatherDetails = false;
            console.log('Error has occurred');
        })
        

        console.log('result ' + JSON.stringify(this.weatherDetails));
    }

}