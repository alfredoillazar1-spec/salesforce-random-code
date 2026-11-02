public with sharing class LeaveRequestController {
    
    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getMyLeaves(Integer pageSize, Integer pageNumber) {   
        try {

            Integer offsetVal = (pageNumber - 1) * pageSize;

            return [SELECT Id, Name, To_Date__c, From_Date__c, Status__c, Reason__c, Manager_Comment__c FROM Leave_Request__c 
            WHERE Status__c != 'Deleted' AND User__c = :UserInfo.getUserId() ORDER BY CreatedDate DESC LIMIT :pageSize OFFSET :offsetVal];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving my leave requests: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getMyLeavesCount() {
        return [SELECT COUNT() FROM Leave_Request__c WHERE Status__c != 'Deleted' AND User__c = :UserInfo.getUserId()];
    }

    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getLeaveRequests() {
        try {
            return [SELECT Id, Name, To_Date__c, From_Date__c, Status__c, Reason__c, Manager_Comment__c, User__r.ManagerId, User__r.Name FROM Leave_Request__c 
            WHERE Status__c != 'Deleted' AND User__r.ManagerId = :UserInfo.getUserId() ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving leave requests: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteLeaveRequests(List<Id> leaveRequestIds) {
        System.debug('Deleting leave requests with Ids: ' + leaveRequestIds);
        try {
            List<Leave_Request__c> leavesToDelete = [SELECT Id, Status__c FROM Leave_Request__c WHERE Id IN :leaveRequestIds];
            for (Leave_Request__c leave : leavesToDelete) {
                leave.Status__c = 'Deleted';
            }
            update leavesToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting leave requests: ' + e.getMessage());
        }
    }

}