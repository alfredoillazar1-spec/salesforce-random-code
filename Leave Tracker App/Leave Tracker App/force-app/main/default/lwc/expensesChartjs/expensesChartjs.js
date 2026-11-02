import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import getExpensesGroupByType from '@salesforce/apex/ExpenseController.getExpensesGroupByType';
/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class ExpensesChartjs extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;
    @api startDate;
    @api endDate;

    config = {
        type: 'doughnut',
        
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    async renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        let data ={
            datasets: [
                {
                    data: [
                    ],
                    backgroundColor: [
                    ],
                    label: 'Total Expenses by Type'
                }
            ],
            labels: []
        };


        try {
            await loadScript(this, chartjs);
            await getExpensesGroupByType({startDate : this.startDate, endDate : this.endDate}).then(result => {
                result.forEach(item => {
                    data.datasets[0].data.push(item.totalExpense);
                    data.datasets[0].backgroundColor.push(this.getRandomColor());
                    data.labels.push(item.Expense_Type__c);
                })
            }, error => {
                this.error = error;
            });
            
            this.config.data = data;
            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        } catch (error) {
            this.error = error;
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
