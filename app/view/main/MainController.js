/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('TPcalc.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    requires: ['Ext.Component'],
    onItemSelected: function (sender, record) {
        //console.log('record')
        //console.log(record)
        let pwr = Ext.getCmp('power-input').getValue()
        let disableField, countField
        let groupNames = [
            '',
            '',
            'Воздушные линии',
            'Кабельные линии',
            'Распределительные пункты',
            'Трансформаторные подстанции (за исключением РТП)',
            'Распределительные трансформаторные подстанции',
            'Трансформаторные подстанции',
            'Средства коммерческого учета электрической энергии'
        ]
        switch (Ext.getCmp('count-method-select-id').getValue()){
            case 'std':
                disableField = (parseInt(record[0].data.A) == 2 || parseInt(record[0].data.A) == 3) ? false : true
                break;
            default:
                disableField = true
        }
        //if(Ext.getCmp('count-method-select-id').getValue() === 'std')
        var panel = Ext.create('Ext.form.Panel', {
            floated: true,
            centered: true,
            closable: true,
            autoDestroy: true,
            id: 'form-add-' + record[0].id,
            //maxWidth: 600,
            //height: 100,
            padding: 6,
            modal:true,
            title: 'Добавить объект?',
            scope: this,
            name: 'addform',
            buttons: {
                submit: {
                    handler: function(sender,e) {
                        //this.onCreate;// Do something
                        var form = this.up('formpanel');//.getForm();
                        let countedFullPrice = 0
                        //console.log('values')
                        //console.log(form.getValues())
                        if (form.isValid()) {
                            let selectedCountMethod = Ext.getCmp('count-method-select-id')
                            let selectedCountMethodValue = selectedCountMethod.getValue()
                            let reliabilityValue = Ext.getCmp('reliability-check').isChecked()
                            //console.log(selectedCountMethod)
                            let selectedPower = Ext.getCmp('power-input').getValue()
                            console.log(selectedCountMethodValue)
                            console.log(selectedPower)
                            console.log(reliabilityValue)
                            console.log(form.getValues())
                            if (selectedCountMethodValue === 'std'){
                                console.log('standard')
                                if (parseInt(form.getValues().group) >= 5 && parseInt(form.getValues().group) <= 7) {
                                    console.log('>=5 && <= 7')
                                    countedFullPrice = (form.getValues().price * selectedPower * form.getValues().quantity).toFixed(2)
                                } else if (parseInt(form.getValues().group) >= 2 && parseInt(form.getValues().group) <= 3) {
                                    console.log('>=2 && <= 3')
                                    countedFullPrice = (form.getValues().price * form.getValues().quantity).toFixed(2)
                                    console.log(countedFullPrice)
                                    if (reliabilityValue) countedFullPrice *= 2
                                    console.log(countedFullPrice)
                                } else {
                                    console.log('4 && 8')
                                    countedFullPrice = (form.getValues().price * form.getValues().quantity).toFixed(2)
                                }
                            } else {
                                console.log('maxpower')
                                countedFullPrice = (form.getValues().price * selectedPower * form.getValues().quantity * 2).toFixed(2)
                                if (parseInt(form.getValues().group) >= 2 && parseInt(form.getValues().group) <= 3 && reliabilityValue) countedFullPrice *= 2
                            }

                            let values = Object.assign({},form.getValues(),{'fullprice': countedFullPrice});

                            let store = Ext.data.StoreManager.lookup('mainSelectedDataStore');
                            delete values.id;
                            //console.log(values);
                            let maxIndex = store.getCount();
                            store.insert(maxIndex, values);
                            store.load();
                            form.reset();
                        }

                        this.up('formpanel').destroy();
                    },
                    text: 'Добавить',
                    formBind: true,
                },

            },
            items: [
                {
                    xtype: 'textareafield',
                    label: 'Группа объектов',
                    name: 'group',
                    hidden: true,
                    value: record[0].data.A,//(groupNames[record[0].data.A] !== '')? groupNames[record[0].data.A] : '',
                    disabled: true,
                },
                {
                    xtype: 'textareafield',
                    label: 'Наименование',
                    maxRows: 2,
                    name: 'name',
                    value: record[0].data.C,
                    disabled:true,
                    renderer: function (value,record,dataIndex,cell,column) {
                        cell.setCls('cell-black');
                        return value;
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Стоимость, руб.',
                    name: 'price',
                    value: record[0].data.E,
                    disabled:true,

                },
                {
                    xtype: 'textfield',
                    label: 'Мощность, кВт',
                    name: 'power',
                    value: pwr,
                    disabled:true,

                },
                {
                    xtype: 'textfield',
                    label: 'Единица измерения',
                    name: 'measurement',
                    value: record[0].data.D,
                    disabled:true,
                    renderer: function (value,record,dataIndex,cell,column) {
                        cell.setCls('cell-black');
                        return value;
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'quantity',
                    required: true,
                    minValue: 0,
                    allowDecimals: true,
                    decimalSeparator: '.',
                    maxValue: 8900,
                    validationMessage: 'Неправильный формат числа. Пример: 11 или 123.4',
                    pattern: '[0-9.]*',
                    disabled: disableField,//disableField,
                    label: (disableField)? 'Укажите количество': 'Количество',
                    width: 200,
                    //scope: this,
                    value: (Ext.getCmp('count-method-select-id').getValue() === 'pwr')? pwr : ((disableField)? 1 : null)//(disableField)? ((Ext.getCmp('count-method-select-id').getValue() === 'std')? 1 : pwr) : ''
                }
            ],
        });

        panel.show();
    },

    resetByValue: function (sender,newValue,oldValue,eOpts){

        if (oldValue !== undefined && oldValue !== null && oldValue !== '' && oldValue != newValue){
            switch (sender.id) {
                case 'city-select-id':
                case 'count-method-select-id':
                case 'power-input':
                case 'needBuilding-radio':
                case 'reliability-check':
                    let selectedForm = Ext.getCmp('selectedGrid');
                    selectedForm.getStore().removeAll();
                    selectedForm.hide();
                    break;
                default:
            }
        }
    },
    onFormSubmitted: function (sender, result, e, eOpts) {
        let selectedForm = Ext.getCmp('selectedGrid');
        let form = sender.up('mainform');
        form.validate();
        if (form.isValid()){
            selectedForm.show();
            //console.log('form isValid=' + form.isValid());
            let store = Ext.data.StoreManager.lookup('mainDataStore');
            let storeSelected = Ext.data.StoreManager.lookup('mainSelectedDataStore');
            const initialData = {
                'pwr':{
                    'name':'Ставка на покрытие расходов на технологическое присоединение энергопринимающих\ ' +
                        'устройств потребителей электрической энергии, объектов электросетевого хозяйства,\ ' +
                        'принадлежащих сетевым организациям и иным лицам, на подготовку и выдачу сетевой\ ' +
                        'организацией технических условий заявителю и проверку сетевой организацией выполнения технических условий ',
                    'price':'1084.79',
                    'measurement':'рублей/кВт',
                    'quantity':'',
                    'fullprice':''
                },
                'std':{
                    'name': 'Стандартизированная тарифная ставка на покрытие расходов\ ' +
                        'на технологическое присоединение энергопринимающих устройств потребителей\ ' +
                        'электрической энергии, объектов электросетевого хозяйства, принадлежащих\ ' +
                        'сетевым организациям и иным лицам, на подготовку  и выдачу сетевой организацией\ ' +
                        'технических условий заявителю и проверку сетевой организацией выполнения технических условий заявителем',
                    'price':'25314.53',
                    'measurement': 'рублей за одно присоединение',
                    'quantity':'1',
                    'fullprice':'25314.53'
                }
            };


            //if (selectedForm) selectedForm.getViewModel().getView().refresh();
            //store.load();
            let countMethod = Ext.getCmp('count-method-select-id');
            let countMethodValue = (countMethod !== undefined && countMethod !== null) ? countMethod.getValue() : null;
            let placement = Ext.getCmp('city-select-id');
            let placementValue = (placement !== undefined && placement !== null) ? placement.getValue() : null;
            let power = Ext.getCmp('power-input');
            let powerValue = (power !== undefined && power !== null) ? power.getValue() : null;
            let radio = Ext.getCmp('needBuilding-radio');

            if (countMethodValue !== null && countMethodValue !== undefined && placementValue !== null && powerValue !== null){
                let tmp = Object.assign({},initialData[countMethodValue]);

                tmp.quantity = (countMethodValue == 'pwr')? powerValue : tmp.quantity;
                tmp.fullprice = (tmp.price * tmp.quantity).toFixed(2);
                //console.log(Ext.getCmp('selectedGrid'));
                //let storeSelectedMaxIndex = storeSelected.getCount();
                selectedForm.getStore().insert(0,tmp);
                selectedForm.getStore().load();

            }
        }
    },
    onConfirm: function (choice) {
        if (choice === 'yes') {

        }
    },
    onDeleteClick: function() {
        var grid = Ext.getCmp('selectedGrid');
        //console.log(grid);
        var selection = grid.getSelection();//grid.getViewModel().getView().getSelectionModel().getSelection()[0];
        //console.log(selection);
        if (selection && selection.id !== 10110) {
            grid.store.remove(selection);
        }
    },
});
function cleanData() {
    Ext.Ajax.request({
        url: 'app.php/example/reset',
        success: function(response, opts) {
            let obj = Ext.decode(response.responseText);
            //console.info('reset ok...');
            //console.info((obj.message != '')? obj.message : 'Сброс выполнен успешно');
        },
        failure: function(response, opts) {
            //console.log('reset failed by some unbelievable reason...');
        }
    });
}
