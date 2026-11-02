public with sharing class ZoomController {

    public static void IntegrationWrapper() {
        WrapperMeeting wm = new WrapperMeeting();
        wm.topicOfMeeting = 'Project Discussion';
        wm.typeOfMeeting = '2';
        wm.startTimeOfMeeting = '2026-07-01T10:00:00Z';
        wm.durationOfMeeting = '30';
        wm.timezoneOfMeeting = 'America/New_York';
        String jsonBody = JSON.serialize(wm);
        createMeeting(jsonBody);
    }

    public static void createMeeting(string jsonBody) {
        HttpRequest req = new HttpRequest();
        req.setBody(jsonBody);
        req.setEndpoint('callout:Zoom_Integration_NC/v2/users/me/meetings');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        Http http = new Http();
        HttpResponse res = http.send(req);
        System.debug('Response Body: ' + res.getBody());

        if (res.getStatusCode() == 201) {
            System.debug('Meeting created successfully');
        } else {
            System.debug('Meeting creation failed with status code: ' + res.getStatusCode());
        }
        
    }

    public class WrapperMeeting {
        Public String topicOfMeeting {get; set;}
        Public String typeOfMeeting {get; set;}
        Public String startTimeOfMeeting {get; set;}
        Public String durationOfMeeting {get; set;}
        Public String timezoneOfMeeting {get; set;}     
}
}