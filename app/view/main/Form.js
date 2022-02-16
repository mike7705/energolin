// custom Vtype for vtype:'Select'
let SelectVal = Ext.create('Ext.data.validator.Presence',{
    message: 'Это поле обязательное. Необходимо выбрать значение.'
});
let InputNumber = Ext.create('Ext.data.validator.Number',{
    decimalSeparator: ',',
    message: 'Введите значение мощности энергопринимающих устройств (кВт)'
});

/*
*   Source data
 */
Ext.define('TPcalc.view.main.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'mainform',
    requires: [
        'Ext.Button',
        'Ext.Component',
        'Ext.Widget',
        'Ext.dom.Element',
        'Ext.field.Panel',
        'Ext.data.Connection',
        'Ext.tip.ToolTip'
    ],

    controller: 'main',
    viewModel: 'main',
    title: 'Исходные данные',
    bodyPadding: 5,
    width: 800,

    layout: 'auto',
    defaults: {
        anchor: '100%'
    },
    defaultType: 'textfield',
    items: [
        {
            xtype: 'selectfield',
            label: 'Выберите территориальное расположения объекта',
            name: 'city-select',
            id: 'city-select-id',
            required: true,
            validators: [ SelectVal ],
            tooltip: new Ext.tip.ToolTip({
                width: 300,
                hideDelay: 0,
                html: '<p>Выберите территориальное расположение объекта</p>'
            }),
            options: [
                {
                    text: 'Территория городских населенных пунктов',
                    value: 'city'
                },
                {
                    text: 'Территория, не относящаяся к городским населенным пунктам',
                    value: 'village'
                }],
            listeners: {
                change: 'resetByValue'
            }
        },
        {
            xtype: 'numberfield',
            label: 'Мощность, кВт (без учета ранее присоединенных в данной точке энергопринимающих устройств)',
            id: 'power-input',
            name: 'power-input',
            minValue: 1,
            maxValue: 8900,
            required: true,
            validationMessage: 'Неправильный формат числа. Пример: 11 или 123.4',
            decimalSeparator: '.',
            allowDecimals: true,
            tooltip: new Ext.tip.ToolTip({
                width: 300,
                html: '<p><b>Планируемая мощность</b></p><p>Введите мощность присоединяемого объекта</p>'
            }),
            pattern: '[0-9.]*',
            //decimals: 2,
            listeners: {
                change: 'resetByValue'
            }
        },
        {
            xtype: 'checkboxfield',
            name : 'reliability',
            id : 'reliability-check',
            label: 'Требуется ли присоединение по двум источникам (II категория надежности)?',
            //value: 'reliability',
            inline: true,
            labelWidth: 'auto',
            style: {
                'font-size':'14px !important'
            },
            margin: '20 10 10 0',
            checked: false,
            listeners: {
                change: 'resetByValue'
            }
        },
        {
            xtype: 'selectfield',
            name: 'voltage-select',
            id: 'voltage-select-id',
            allowBlank: false,
            label: 'Выберите значение напряжения, кВ',
            required: true,
            validators: [ SelectVal ],
            tooltip: new Ext.tip.ToolTip({
                width: 300,
                html: '<p>Выберите уровень напряжения присоединяемого объекта</p>'
            }),
            options: [
                {
                    text: '0.4 кВ и ниже',
                    value: '0,4'
                },
                {
                    text: '1-20 кВ',
                    value: '1-20'
                },
                {
                    text: '35 кВ',
                    value: '35'
                },
                {
                    text: '110 кВ и выше',
                    value: '110'
                }],
            listeners: {
                change: 'resetByValue'
            }
        },
        {
            xtype: 'selectfield',
            label: 'Выберите методику расчета',
            allowBlank: false,
            name: 'count-method-select',
            id: 'count-method-select-id',
            required: true,
            validators: [ SelectVal ],
            tooltip: new Ext.tip.ToolTip({
                width: 300,
                html: '<p>Выберите методику расчета стоимости технологического присоединения</p>'
            }),
            options: [
                {
                    text: 'Стандартизированная ставка',
                    value: 'std'
                },
                {
                    text: 'Ставка за единицу мощности',
                    value: 'pwr'
                }],
            listeners: {
                change: 'resetByValue'
            }
        },
        {
            xtype: 'radiogroup',
            label: 'Необходимо строительство?',
            vertical: true,
            id: 'needBuilding-radio',
            height: 100,
            required: true,
            validators: [ SelectVal ],
            items: [
                { label: 'Нет', name: 'nb', value: '0' },
                { label: 'Да', name: 'nb', value: '1' }
            ],
            tooltip: new Ext.tip.ToolTip({
                width: 300,
                html: '<p>Есть ли необходимость в строительстве дополнительных объектов (воздушных или кабельных линий, подстанций и др) для реализации проекта технологического присоединения?</p>'
            }),
            listeners: {
                change: 'resetByValue'
            }
        }
    ],
    // Reset and Submit buttons

    buttons: [
        {
            xtype: 'button',
            text: 'Очистить форму',
            handler: function() {
                let selectedForm = Ext.getCmp('selectedGrid');
                selectedForm.hide();
                this.up('formpanel').reset();
                cleanData();
            },
        },
        {
            text: 'Рассчитать',
            formBind: true, //only enabled once the form is valid
            //disabled: true,
            handler: function (sender, result, e, eOpts) {
                let selectedForm = Ext.getCmp('selectedGrid');

                let tmpObject;
                let form = this.up('formpanel');
                form.validate();
                if (form.isValid()) {
                    // make sure the form contains valid data before submitting
                    let calcConditions = form.getValues();
                    const initialData = {
                        'pwr':{
                            'name':'Ставка на покрытие расходов на технологическое присоединение энергопринимающих\ ' +
                                'устройств потребителей электрической энергии, объектов электросетевого хозяйства,\ ' +
                                'принадлежащих сетевым организациям и иным лицам, на подготовку и выдачу сетевой\ ' +
                                'организацией технических условий заявителю и проверку сетевой организацией выполнения технических условий ',
                            'price': '1084.79',
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
                    selectedForm.show();

                    let storedQuantity = (calcConditions['count-method-select'] == 'pwr')? parseFloat(calcConditions['power-input']) : initialData[calcConditions['count-method-select']].quantity;
                    tmpObject = {
                        'name': initialData[calcConditions['count-method-select']].name,
                        'measurement': initialData[calcConditions['count-method-select']].measurement,
                        'price': initialData[calcConditions['count-method-select']].price,
                        'quantity': storedQuantity,
                        'fullprice' : parseFloat(initialData[calcConditions['count-method-select']].price * storedQuantity).toFixed(2)
                    };
                    //tmpObject.save();
                    selectedForm.getStore().insert(0,tmpObject);
                    selectedForm.refresh();
                    //console.info(selectedForm);
                } else {
                    selectedForm.hide();
                }
            }
        }
    ],
    renderTo: Ext.getBody()
});