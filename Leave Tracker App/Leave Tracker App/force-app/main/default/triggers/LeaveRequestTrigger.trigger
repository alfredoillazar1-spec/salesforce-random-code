trigger LeaveRequestTrigger on Leave_Request__c (before insert, before update, after insert, after update, after delete, after undelete) {

    List<Leave_Request__c> leaveRequests = Trigger.new;
    for (Leave_Request__c leaveRequest : leaveRequests) {
        System.debug('Leave Request Trigger: ' + leaveRequest.From_Date__c + ' to ' + leaveRequest.To_Date__c);
    }


    System.debug('is Trigger executing ? ' + Trigger.isExecuting);
    System.debug('is Trigger insert ? ' + Trigger.isInsert);
    System.debug('is Trigger update ? ' + Trigger.isUpdate);
    System.debug('is Trigger delete ? ' + Trigger.isDelete);
    System.debug('is Trigger undelete ? ' + Trigger.isUndelete);
    System.debug('is Trigger before ? ' + Trigger.isBefore);
    System.debug('is Trigger after ? ' + Trigger.isAfter);
    System.debug('Trigger New: ' + Trigger.new);
    System.debug('Trigger Old: ' + Trigger.old);
    System.debug('Trigger NewMap: ' + Trigger.newMap);
    System.debug('Trigger OldMap: ' + Trigger.oldMap);
    System.debug('Trigger Context: ' + Trigger.operationType);
    System.debug('Trigger Size: ' + Trigger.size);

    switch on Trigger.operationType {
        when before insert {
            System.debug('Before Insert logic here');
        }
        when before update {
            System.debug('Before Update logic here');
        }
        when after insert {
            System.debug('After Insert logic here');
        }
        when after update {
            System.debug('After Update logic here');
        }
        when after delete {
            System.debug('After Delete logic here');
        }
        when after undelete {
            System.debug('After Undelete logic here');
        }
    }
}