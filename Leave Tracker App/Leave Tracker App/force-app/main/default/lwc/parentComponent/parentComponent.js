import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    data;
    childData;

    handleClick() {
        this.data = "Data passed to child!";
        this.childData = '';
    }

    handleChildData(event) {
        this.childData = event.detail;
    }
}