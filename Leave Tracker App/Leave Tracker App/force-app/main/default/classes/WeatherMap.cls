public with sharing class WeatherMap {
    @AuraEnabled
    public static WeatherMapWrapper getWeatherMapByCity(String cityName) {
        try {
            String apiKey = 'a962f750e839856f61b02597ac7a1f4c';
            String  endpoint = 'http://api.openweathermap.org/data/2.5/weather';
            endpoint += '?q=' + cityName;
            endpoint += '&units=metric';
            endpoint += '&APPID=' + apiKey;
            System.debug('endpoint : ' + endpoint);


            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('response : ' + response);
            System.debug('body : ' + JSON.deserializeUntyped(response.getBody()));

            WeatherMapWrapper weatherWrapper = new WeatherMapWrapper();
            if (response.getStatusCode() == 200) {
                Map<String, Object> res = (Map<String,Object>)JSON.deserializeUntyped(response.getBody());
                weatherWrapper.city = String.valueOf(res.get('name'));
                Map<String, Object> mainResult = (Map<String, Object>)(res.get('main')); 
                weatherWrapper.temperature = String.valueOf(mainResult.get('temp'));
                weatherWrapper.pressure = String.valueOf(mainResult.get('pressure'));
                weatherWrapper.humidity = String.valueOf(mainResult.get('humidity'));
                weatherWrapper.feelsLike = String.valueOf(mainResult.get('feels_like'));
                weatherWrapper.tempMin = String.valueOf(mainResult.get('temp_min'));
                weatherWrapper.tempMax = String.valueOf(mainResult.get('temp_max'));
            
            }

            System.debug('weatherWrapper : ' + weatherWrapper);
            return weatherWrapper;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    public class WeatherMapWrapper {
    @AuraEnabled
    public String city {get; set;}
    @AuraEnabled
    public String temperature {get; set;}
    @AuraEnabled
    public String pressure {get; set;}
    @AuraEnabled
    public String humidity {get; set;}
    @AuraEnabled
    public String feelsLike {get; set;}
    @AuraEnabled
    public String tempMin {get; set;}
    @AuraEnabled
    public String tempMax {get; set;}
}
}

temperature
pressure
humidity
feelsLike
tempMin
tempMax