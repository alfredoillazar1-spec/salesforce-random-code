trigger AccountTrigger on Account (after update) {

    if(trigger.isUpdate) {
        if (trigger.isAfter) {
            AccountTriggerHandler.updateContacts(Trigger.new, Trigger.oldMap);
        }
    }

}