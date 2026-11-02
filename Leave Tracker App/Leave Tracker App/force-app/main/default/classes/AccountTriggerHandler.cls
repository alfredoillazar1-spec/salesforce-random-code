public with sharing class AccountTriggerHandler {
    public static void updateContacts(List<Account> accountList, Map<Id, Account> accountMap) {
            Set<Id> accountIds = new Set<Id>();
            for (Account acctNew : accountList) {
                if (acctNew.BillingCity != accountMap.get(acctNew.Id).BillingCity) {
                    //accountIds.add(acctNew.Id);
                    acctNew.addError('Error!!!! do not change city');
                }
            }
            

            Map<id, contact> contactMap = new Map<id, contact>([Select id, Remarks__c FROM Contact WHERE AccountId IN : accountIds]);
            List<Contact> contactList = new List<Contact>();
        
            if (contactMap.size() > 0) {
                for (Contact con : contactMap.values()) {
                    con.Remarks__c = 'Failed';
                    contactList.add(con);
                }
                update contactList;
            }
    }
}   