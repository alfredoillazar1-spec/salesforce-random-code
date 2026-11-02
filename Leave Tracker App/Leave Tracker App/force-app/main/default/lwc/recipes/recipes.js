import { LightningElement, wire } from 'lwc';
import fetchContacts from '@salesforce/apex/SpooncularController.fetchContacts';

import getRandomRecipe from '@salesforce/apex/SpooncularController.getRandomRecipe';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    {label: 'Phone', fieldName: 'Phone', type: 'phone' },
    {label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class Recipes extends LightningElement {
    columnList = columns;
    dataList = [];

    @wire(fetchContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.dataList = data;
        } else if (error) {
            console.log(error);
        }

    }


    @wire(getRandomRecipe) 
    wiredRecipes({ error, data }) {
        if (data) {
            console.log('Random Recipe: ' +  data);
        } else if (error) {
            console.log(error);
        }
    }
}