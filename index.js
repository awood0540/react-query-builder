import { render } from 'react-dom';
import './index.css';
import * as React from 'react';
import { QueryBuilderComponent } from '@syncfusion/ej2-react-querybuilder';
import { getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RadioButtonComponent, CheckBox } from '@syncfusion/ej2-react-buttons';
import { DropDownList } from '@syncfusion/ej2-react-dropdowns';
import { Slider } from '@syncfusion/ej2-react-inputs';
import { expenseData } from './data-source';
import { PropertyPane } from './property-pane';
import { SampleBase } from './sample-base';

export class Template extends SampleBase {
    constructor() {
        super();
        this.txtAreaElem = document.getElementById('ruleContent');
        this.filter = [
            {
                field: 'Category', label: 'Category', type: 'string',
            },
            {
                field: 'PaymentMode', label: 'Payment Mode', type: 'string', template: {
                    create: () => {
                        this.elem = document.createElement('input');
                        this.elem.setAttribute('type', 'text');
                        return this.elem;
                    },
                    destroy: (args) => {
                        this.dropDownObj = getComponent(document.getElementById(args.elementId), 'dropdownlist');
                        if (this.dropDownObj) {
                            this.dropDownObj.destroy();
                        }
                    },
                    write: (args) => {
                        let ds = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallet'];
                        this.dropDownObj = new DropDownList({
                            dataSource: ds,
                            value: args.values ? args.values : ds[0],
                            change: (e) => {
                                this.qryBldrObj.notifyChange(e.itemData.value, e.element);
                            }
                        });
                        this.dropDownObj.appendTo('#' + args.elements.id);
                    }
                },
                operators: [
                    { key: 'Equal', value: 'equal' },
                    { key: 'Not Equal', value: 'notequal' }
                ]
            },
            {
                field: 'TransactionType', label: 'Transaction Type', type: 'boolean', template: {
                    create: () => {
                        this.elem = document.createElement('input');
                        this.elem.setAttribute('type', 'checkbox');
                        return this.elem;
                    },
                    destroy: (args) => {
                        getComponent(document.getElementById(args.elementId), 'checkbox').destroy();
                    },
                    write: (args) => {
                        this.checked = args.values === 'IsExpensive' ? true : false;
                        this.boxObj = new CheckBox({
                            label: 'Is Expensive',
                            checked: this.checked,
                            change: (e) => {
                                this.qryBldrObj.notifyChange(e.checked ? 'expensive' : 'income', e.event.target);
                            }
                        });
                        this.boxObj.appendTo('#' + args.elements.id);
                    }
                },
                operators: [
                    { key: 'Equal', value: 'equal' },
                    { key: 'Not Equal', value: 'notequal' }
                ]
            },
            { field: 'Description', label: 'Description', type: 'string' },
            { field: 'Date', label: 'Date', type: 'date' },
            {
                field: 'Amount', label: 'Amount', type: 'number', template: {
                    create: () => {
                        this.elem = document.createElement('div');
                        this.elem.setAttribute('class', 'ticks_slider');
                        return this.elem;
                    },
                    destroy: (args) => {
                        getComponent(document.getElementById(args.elementId), 'slider').destroy();
                    },
                    write: (args) => {
                        let slider = new Slider({
                            value: args.values,
                            min: 0,
                            max: 100,
                            type: 'MinRange',
                            tooltip: { isVisible: true, placement: 'Before', showOn: 'Hover' },
                            change: (e) => {
                                this.qryBldrObj.notifyChange(e.value, args.elements);
                            }
                        });
                        slider.appendTo('#' + args.elements.id);
                    }
                },
                operators: [
                    { key: 'Equal', value: 'equal' },
                    { key: 'Not equal', value: 'notequal' },
                    { key: 'Greater than', value: 'greaterthan' },
                    { key: 'Less than', value: 'lessthan' },
                    { key: 'Less than or equal', value: 'lessthanorequal' },
                    { key: 'Greater than or equal', value: 'greaterthanorequal' }
                ]
            }
        ];
        this.importRules = {
            'condition': 'and',
            'rules': [{
                    'label': 'Category',
                    'field': 'Category',
                    'type': 'string',
                    'operator': 'equal',
                    'value': ['Clothing']
                },
                {
                    'condition': 'or',
                    'rules': [{
                            'label': 'TransactionType',
                            'field': 'TransactionType',
                            'type': 'boolean',
                            'operator': 'equal',
                            'value': 'Income'
                        },
                        {
                            'label': 'PaymentMode',
                            'field': 'PaymentMode',
                            'type': 'string',
                            'operator': 'equal',
                            'value': 'Cash'
                        }]
                }, {
                    'label': 'Amount',
                    'field': 'Amount',
                    'type': 'number',
                    'operator': 'equal',
                    'value': 10
                }
            ]
        };
        this.state = {
            textareaValue: ''
        };
    }
    updateRule(args) {
        this.txtAreaElem = document.getElementById('ruleContent');
        if (this.radioButton.checked) {
            this.txtAreaElem.value = this.qryBldrObj.getSqlFromRules(args.rule);
        }
        else {
            this.txtAreaElem.value = JSON.stringify(args.rule, null, 4);
        }
    }
    changeValue() {
        this.txtAreaElem = document.getElementById('ruleContent');
        this.validRule = this.qryBldrObj.getValidRules(this.qryBldrObj.rule);
        if (this.radioButton.checked) {
            this.txtAreaElem.value = this.qryBldrObj.getSqlFromRules(this.validRule);
        }
        else {
            this.txtAreaElem.value = JSON.stringify(this.validRule, null, 4);
        }
    }
    onCreated() {
        let queryBuilder = getComponent(document.getElementById('querybuilder'), 'query-builder');
        this.setState({
            textareaValue: JSON.stringify(queryBuilder.getValidRules(queryBuilder.rule), null, 4)
        });
    }
    // Handler used to reposition the tooltip on page scroll
    onScroll() {
        let tooltip = document.getElementsByClassName('e-handle e-control e-tooltip');
        let i;
        let len = tooltip.length, tooltipObj;
        for (i = 0; i < len; i++) {
            tooltipObj = tooltip[i].ej2_instances[0];
            tooltipObj.refresh(tooltipObj.element);
        }
    }
    render() {
        if (!isNullOrUndefined(document.getElementById('right-pane'))) {
            document.getElementById('right-pane').addEventListener('scroll', this.onScroll);
        }
        return (<div className='control-pane querybuilder-pane'>
                <div className='col-lg-8 control-section'>
                    <QueryBuilderComponent id='querybuilder' dataSource={expenseData} columns={this.filter} width='100%' rule={this.importRules} ref={(scope) => { this.qryBldrObj = scope; }} ruleChange={this.updateRule.bind(this)} created={this.onCreated.bind(this)}>
                    </QueryBuilderComponent>
                </div>
                <div className='col-lg-4 property-section'>
                    <PropertyPane title='Properties'>
                        <table id='qbproperypane' title='Properties'>
                            <tr><td>
                                <div className="row">
                                    <RadioButtonComponent label='JSON' name='rule' value='sql' checked={true} change={this.changeValue.bind(this)} ref={(scope) => { this.radioButton = scope; }}>
                                    </RadioButtonComponent>
                                </div>
                            </td>
                                <td>
                                    <div className="row">
                                        <RadioButtonComponent label='SQL' name='rule' value='sql' change={this.changeValue.bind(this)} ref={(scope) => { this.radioButton = scope; }}>
                                        </RadioButtonComponent>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <textarea id='ruleContent' readOnly={true} value={this.state.textareaValue}/>
                                </td>
                            </tr>
                        </table>
                    </PropertyPane>
                </div>


            </div>);
    }
}

render(<Template />, document.getElementById('sample'));