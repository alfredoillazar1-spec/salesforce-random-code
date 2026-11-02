import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {
    @api parentData;

    handleClick() {
        const passData = new CustomEvent("sendbackthedata", {detail : "Pass data from child"});
        this.dispatchEvent(passData);
    }
}