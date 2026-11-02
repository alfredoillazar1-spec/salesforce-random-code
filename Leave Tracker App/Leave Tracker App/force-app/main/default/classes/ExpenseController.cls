public with sharing class ExpenseController {
    
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getExpensesGroupByType(Date startDate, Date endDate) {
        try {
            return [SELECT Expense_Type__c, sum(Expense_Amount__c) totalExpense FROM Expense__c 
                    WHERE Expense_Date__c  >= :startDate AND Expense_Date__c <= :endDate
                    WITH USER_MODE GROUP BY Expense_Type__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving expenses: ' + e.getMessage());
        }
    }

}