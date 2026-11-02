import { LightningElement } from 'lwc';

import hasManagePermission from '@salesforce/customPermission/Manage_Leave_Request';
import hasViewPermission from '@salesforce/customPermission/View_Leave_Request';


export default class LeaveTracker extends LightningElement {

    refreshLeaveRequestHandler(event) {
        //this.refs.myLeavesComp.refreshGrid();
        console.log('Refresh event received in Leave Tracker');
        const leaveRequestsComp = this.template.querySelector('c-leave-requests');
        if (leaveRequestsComp) {
            leaveRequestsComp.refreshGrid();
        }
    }
    
    connectedCallback() {
        console.log('hasManageLeavePermission in Leave Tracker - ', hasManagePermission);
    }
    
    get hasManageLeavePermission() {
        return hasManagePermission;
    }

    
    get hasViewLeavePermission() {
        return hasViewPermission;
    }

    get showLeaveRequestsComponent() {
        return this.hasManageLeavePermission || this.hasViewLeavePermission;
    }
}