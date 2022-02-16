/**
 * This view is an example list of people.
 */
Ext.define('TPcalc.view.main.List', {
    extend: 'Ext.grid.Grid',
    xtype: 'mainlist',
    id: 'mainGrid',
    height:500,
    controller: 'main',
    requires: [
        'TPcalc.store.Personnel'
    ],
    style: {'margin-top':'20px'},
    title: 'Выберите необходимые для строительства объекты',
    hidden: false,
    store: {
        type: 'personnel',
    },
    autoHeight:true,
    autoDestroy:true,
    scrollable:true,
    columns: [
        {
            text: 'Напряжение',
            dataIndex: 'B',
            width: 150,
            renderer: function (value,rowId ) {
                if (value!=='' && value.indexOf(",")){
                    var voltage = value.substr(value.indexOf(",")+1);
                    //console.log(voltage);
                    return voltage;
                } else {
                    return '';
                }
            }
        },
        {
            text: 'Наименование',
            dataIndex: 'C',
            width: 500,
            flex: 1,
            renderer: function (value,record,dataIndex,cell,column) {
                cell.setCls('cell-wrap');
                return value;
            }
        },
        {
            text: 'Единица измерения',
            dataIndex: 'D',
            width: 100
        },
        {
            text: 'Стоимость',
            dataIndex: 'E',
            width: 200,
            renderer: function (value,rowId) {
                if (value !== undefined){
                    //console.log(value);
                    var cost = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
                    return cost;
                }
            }
        }
    ],
    features: [{
        id: 'group',
        ftype: 'grouping',
        groupHeaderTpl: '{name}',
        startCollapsed: true,
        //hideGroupedHeader: true,
        //enableGroupingMenu: false,
        //remoteRoot: 'summaryData'
    }],
    listeners: {
        select: 'onItemSelected',
    }
});
