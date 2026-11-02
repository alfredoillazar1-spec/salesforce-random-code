import { LightningElement, track, wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequestController.getMyLeaves';
import getMyLeavesCount from '@salesforce/apex/LeaveRequestController.getMyLeavesCount';
import deleteRequest from '@salesforce/apex/LeaveRequestController.deleteLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import lightningConfirm from 'lightning/confirm';

import hasManagePermission from '@salesforce/customPermission/Manage_Leave_Request'

const COLUMNS = [
    { label: 'Request Id', fieldName: 'Name', sortable: true, cellAttributes: { class: { fieldName: 'cellClass' } } },
    { label: 'From Date', fieldName: 'From_Date__c', sortable: true, cellAttributes: { class: { fieldName: 'cellClass' } } },
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
export default class MyLeaves extends LightningElement {
    columns = COLUMNS;

    @track myLeaves = [];
    myLeavesWireResult;
    showModalPopup = false;
    objectApiName = 'Leave_Request__c';
    recordId = '';
    currentUserId = Id;

    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    isLoading = false;


    get hasManageLeavePermission() {
        return hasManagePermission;
    }
    
    connectedCallback() {
        this.initPagination();
    }

    async initPagination() {
        const total = await getMyLeavesCount();
        this.totalPages = Math.ceil(total / this.pageSize);

    }

    @wire(getMyLeaves, {pageSize : '$pageSize', pageNumber : '$currentPage'})
    wiredMyLeaves(result) {
        this.isLoading = true;
        this.myLeavesWireResult = result;
        if (result.data) {
            this.myLeaves = result.data.map(a => ({
                ...a,
                cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled: (this.hasManageLeavePermission == false || this.hasManageLeavePermission == undefined || this.hasManageLeavePermission == null) ? true : a.Status__c != 'Pending'
                
            }));
            
        this.isLoading = false;
        }
        if (result.error) {
            console.log('Error occured while fetching my leaves- ', result.error);
            this.isLoading = false;
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchMyLeaves();
        }
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchMyLeaves();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.myLeaves];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.myLeaves = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }



    get noRecordsFound() {
        return this.myLeaves.length == 0;
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
        //refreshApex(this.myLeavesWireResult);
        this.fetchMyLeaves();

        const refreshEvent = new CustomEvent('refreshleaverequests');
        this.dispatchEvent(refreshEvent);
    }
    submitHandler(event) {
        event.preventDefault();
        const fields = { ...event.detail.fields };
        fields.Status__c = 'Pending';
        if (new Date(fields.From_Date__c) > new Date(fields.To_Date__c)) {
            this.showToast('From date should not be grater then to date', 'Error', 'error');
        }
        else if (new Date() > new Date(fields.From_Date__c)) {
            this.showToast('From date should not be less then Today', 'Error', 'error');
        }
        else {
            this.refs.leaveReqeustFrom.submit(fields);
        }
    }
    showToast(message, title = 'success', variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    deleteRequestClickHandler() {
        const selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        if(selectedRows.length == 0) {
            this.showToast('Please select at least one record to delete', 'Error', 'error');
            return;
        }

        let leaveRequestIds = [];
        let leaveRequestNames = [];
        selectedRows.forEach(row => {
            leaveRequestIds.push(row.Id);
            leaveRequestNames.push(row.Name);
        });


        lightningConfirm.open({
            message: 'Are you sure you want to delete the selected leave requests ' + leaveRequestNames.join(', ') + ' ?',
            theme: 'warning',
            label: 'Confirm Deletion'
        })
        .then((result) => {
            if(result) {
                
                deleteRequest({ leaveRequestIds: leaveRequestIds })
                    .then(() => {
                        this.isLoading = true;
                        this.showToast('Selected leave requests deleted successfully');
                        this.fetchMyLeaves();
                    })
                    .catch(error => {
                        this.isLoading = false;
                        console.error('Error deleting leave requests: ', error);
                        this.showToast('Error deleting leave requests: ' + error.body.message, 'Error', 'error');
                    }).finally(() => {
                        this.isLoading = false;
                    });
            }
        }).catch((error) => {
            console.error('Error displaying confirmation dialog: ', error);
        });
    
    }

    fetchMyLeaves() {
        refreshApex(this.myLeavesWireResult);
    }
}