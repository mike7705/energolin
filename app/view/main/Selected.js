/**
 * This view is an example list of people.
 */
Ext.define('TPcalc.view.main.Selected', {
    extend: 'Ext.grid.Grid',
    xtype: 'selectedlist',
    id: 'selectedGrid',

    controller: 'main',
    requires: [
        'TPcalc.store.Selected'
    ],
    store: {
        type: 'selected'
    },
    selType: 'cellmodel',
    features: [{
        ftype: 'cellediting',
        clicksToEdit: 1
    }],
    plugins:[{
        type: 'gridsummaryrow'
    }],
    autoDestroy:true,
    style: {'margin-top':'20px'},
    title: 'Выберите необходимые для строительства объекты',
    //hidden: false,
    //border:true,
    width: 800,
    maxWidth:800,
    minHeight:350,
    //autoHeight:true,
    //scrollable: true,
    items: [
        {
         xtype: 'toolbar',
         docked: 'top',
         items: [
             {
                 xtype: 'button',
                 id: 'building-button',
                 iconCls: 'icon-add',
                 text: 'Добавить',
                 scope: this,
                 margin: '0 20 0 0',
                 cls: 'bg-dialog',
                 handler: function(btn) {
                     var panel = Ext.create('Ext.Panel', {
                         id: 'selectedpanel',
                         floated: true,
                         modal: true,
                         centered: true,
                         closable: true,
                         //width: 700,
                         //height: 500,
                         autoDestroy:true,

                         padding: 20,
                         title: 'Выберите объекты',
                         layout: 'vbox',
                         items: [{
                             html: 'Выберите дополнительные объекты, необходимые\ ' +
                                 'для реализации проекта технологического присоединения\ ' +
                                 'принимающего оборудования. Укажите их количество или длину (см ед. измерения).',
                         },
                             {
                                 xtype: 'mainlist',
                             },
                         ]
                     });
                     panel.show();
                 }
             },
             {
                 iconCls: 'icon-delete',
                 text: 'Удалить строку',
                 itemId: 'delete',
                 style: {'border': '1px solid blue;'},
                 //scope: this,
                 handler: 'onDeleteClick'
             }
         ]
        },

    ],
    columns: [
        {
            hidden: true,
            dataIndex: 'id'
        },
        {
            text:'Наименование',
            dataIndex: 'name',
            flex:1,
            editor: false,
            renderer: function (value,record,dataIndex,cell,column) {
                //cell.setCls('cell-wrap');
                return value;
            },
            summaryRenderer: function (value) {
                return 'Итого:';
            }
        },
        {
            text:'Цена, руб',
            dataIndex: 'price',
            width:100,
            editor: false,
            renderer: function (value,rowId) {
                if (value !== undefined){
                    //console.log(value);
                    let cost = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
                    return cost;
                }
            },
            summaryRenderer: function (value) {
                return'';
            }
        },
        {
            text:'Ед. измерения',
            dataIndex: 'measurement',
            width:100,
            editor: false
        },
        {
            text:'Кол-во',
            dataIndex: 'quantity',
            align: 'center',
            editor:{
                xtype: 'numberfield',
                allowBlank: false,
                minValue:0,
                maxValue: 8900,
                required: true,
                validationMessage: 'Неправильный формат числа. Пример: 11 или 123.4',
                decimalSeparator: '.',
                allowDecimals: true,
                pattern: '[0-9.]*',
            },
            summaryRenderer: function () {
                return '';
            }
        },
        {
            text:'Стоимость',
            dataIndex: 'fullprice',
            summary: 'sum',
            align: 'right',
            width:150,
            editor: false,
            renderer: function (value,rowId) {
                if (value !== undefined){
                    //console.log(value);
                    let cost = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
                    return cost;
                }
            },
            summaryRenderer: function (value,rowId) {
                if (value !== undefined){
                    //console.log(value);
                    let cost = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
                    return cost;
                }
            }
        },

    ],
    initComponent: function() {
        Ext.apply(this, {
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    xtype: 'button',
                    iconCls: 'icon-edit',
                    text: 'Редактировать',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    iconCls: 'icon-delete',
                    text: 'Удалить',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                }]
            }],
        });
    },

    onSelectChange: function(selModel, selections) {
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function() {
        this.store.sync();
    },

    onDeleteClick: function() {
        //console.log(this);
        var selection = this.getView().getSelectionModel().getSelection()[0];
    //console.log(selection);
        if (selection) {
            this.store.remove(selection);
        }
    },

    onAddClick: function() {
        // eslint-disable-next-line no-undef
        var rec = new Writer.Person({
                name: '',
                last: '',
                email: ''
            }),
            edit = this.findPlugin('cellediting');

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: rec,
            column: 1
        });
    },
});
Ext.onReady(function () {
    // setup the state provider, all state information will be saved to a cookie
    //Ext.state.Provider.setProvider(Ext.create('Ext.state.CookieProvider'));
    var didReset, o, store, main;

    Ext.Ajax.request({
        url: 'app.php/example/reset',
        success: function(response, opts) {
            //var obj = Ext.decode(response.responseText);
            //console.dir('reset ok...');
            didReset = true;
            var store = Ext.data.StoreManager.lookup('mainSelectedDataStore');
            store.load();
            //main.down('#form').setActiveRecord(null);
        },
        failure: function(response, opts) {
            //console.log('reset failed');
            didReset = false;
        }
    });
})
