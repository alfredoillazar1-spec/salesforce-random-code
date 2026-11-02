public class UpdateLeaveRequestQueueable implements Queueable{

    public void execute(QueueableContext context) {
        System.debug('Queueable job started at: ' + System.now());
        String query = 'SELECT Id, Status__c FROM Leave_Request__c WHERE Status__c = \'Pending\' AND From_Date__c <= TODAY';
        List<Leave_Request__c> leaveRequests = Database.query(query);
        List<Leave_Request__c> leaveRequestsToUpdate = new List<Leave_Request__c>();
        
        for (Leave_Request__c lr : leaveRequests) {
            System.debug('Processing Leave Request Id: ' + lr.Id + ' with Status: ' + lr.Status__c);
            if (lr.Status__c == 'Pending') {
                lr.Status__c = 'Declined';
                leaveRequestsToUpdate.add(lr);
                System.debug('Leave Request Id: ' + lr.Id + ' marked for update to Declined status.');
            }
        }
        
        if (!leaveRequestsToUpdate.isEmpty()) {
            System.debug('Updating ' + leaveRequestsToUpdate.size() + ' leave requests to Declined status.');
            update leaveRequestsToUpdate;
        } else {
            System.debug('No pending leave requests found that need to be updated.');
        }
        
        System.debug('Queueable job finished at: ' + System.now());
    }
}

/*
to run this class, you can execute the following line in the Developer Console's Execute Anonymous window:
System.enqueueJob(new UpdateLeaveRequestQueueable());

*/