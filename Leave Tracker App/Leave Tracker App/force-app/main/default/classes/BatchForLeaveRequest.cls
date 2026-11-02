public class BatchForLeaveRequest implements Database.Batchable<SObject>, Database.Stateful, Database.AllowsCallouts, Schedulable {

    public Database.QueryLocator start(Database.BatchableContext BC) {
        System.debug('Batch job started at: ' + System.now());
        String query = 'SELECT Id, Status__c FROM Leave_Request__c WHERE Status__c = \'Pending\' AND From_Date__c <= TODAY';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext BC, List<Leave_Request__c> scope) {
        List<Leave_Request__c> leaveRequests = new List<Leave_Request__c>();
        for (Leave_Request__c lr : scope) {
            System.debug('Processing Leave Request Id: ' + lr.Id + ' with Status: ' + lr.Status__c);
            if (lr.Status__c == 'Pending') {
                lr.Status__c = 'Declined';
                leaveRequests.add(lr);
                System.debug('Leave Request Id: ' + lr.Id + ' marked for update to Declined status.');
            }
            
        }
        System.debug('Updating ' + leaveRequests.size() + ' leave requests to Declined status.');
        update leaveRequests;
    }

    public void finish(Database.BatchableContext BC) {
        System.System.debug('Batch job finished at: ' + System.now());
        // Optional: Add any post-processing logic here
    } 

    public void execute(SchedulableContext sc) {
        BatchForLeaveRequest batch = new BatchForLeaveRequest();
        Database.executeBatch(batch, 200);
    }
} 