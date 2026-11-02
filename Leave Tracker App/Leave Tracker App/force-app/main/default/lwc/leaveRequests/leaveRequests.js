import { api, LightningElement, wire } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequestController.getLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import hasManagePermission from '@salesforce/customPermission/Manage_Leave_Request'

const COLUMNS = [
    { label: 'Request Id', fieldName: 'Name', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'User', fieldName: 'userName', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'From Date', fieldName: 'From_Date__c', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'To Date', fieldName: 'To_Date__c', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'Reason', fieldName: 'Reason__c', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'Status', fieldName: 'Status__c', cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'Manager Comment', fieldName: 'Manager_Comment__c', cellAttributes: { class: { fieldName: 'cellClass' } } },
    {
        type: "button", typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            value: 'edit',
            disabled: { fieldName: 'isEditDisabled' }
        }, cellAttributes: { class: { fieldName: 'cellClass' } }
    }
];
export default class LeaveRequests extends LightningElement {
    columns = COLUMNS;

    leavesReqeusts = [];
    leavesReqeustsWireResult;
    showModalPopup = false;
    objectApiName = 'Leave_Request__c';
    recordId = '';
    currentUserId = Id;

    get hasManageLeavePermission() {
        return hasManagePermission;
    }

    @wire(getLeaveRequests)
    wiredMyLeaves(result) {
        this.leavesReqeustsWireResult = result;
        if (result.data) {
            this.leavesReqeusts = result.data.map(a => ({
                ...a,
                userName: a.User__r.Name,
                cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Declined' ? 'slds-theme_warning' : '',
                isEditDisabled: (this.hasManageLeavePermission == false || this.hasManageLeavePermission == undefined || this.hasManageLeavePermission == null) ? true : a.Status__c != 'Pending'
            }));
        }
        if (result.error) {
            console.log('Error occured while fetching my leaves- ', result.error);
        }
    }

    get noRecordsFound() {
        return this.leavesReqeusts.length == 0;
    }

    newRequestClickHandler() {
        this.showModalPopup = true;
        this.recordId = '';
    }
    popupCloseHandler() {
        this.showModalPopup = false;
    }

    rowActionHandler(event) {
        this.showModalPopup = true;
        this.recordId = event.detail.row.Id;
    }

    successHandler(event) {
        this.showModalPopup = false;
        this.showToast('Data saved successfully');
        this.refreshGrid();
    }

    @api
    refreshGrid() {
        refreshApex(this.leavesReqeustsWireResult);
    }
    showToast(message, title = 'success', variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}