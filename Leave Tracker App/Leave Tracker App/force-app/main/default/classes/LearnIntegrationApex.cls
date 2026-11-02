public with sharing class LearnIntegrationApex {
  
  public static void makeCallout() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Global_Warming_Named/api/temperature-api');
        request.setMethod('GET');
        request.setTimeout(120000);
        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            System.debug('Callout successful: ' + response.getBody());
        } 
} 
}