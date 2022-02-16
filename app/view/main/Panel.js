Ext.define('TPcalc.view.main.Panel', {
    extend: 'Ext.grid.Grid',
    title: 'Infinite Grid',
    xtype: 'example',
height: 400,
    store: {
        type: 'Panel'
    },

    scrollable: true,

    requires: [
        'Ext.grid.filters.Plugin',
        'TPcalc.store.Panel'
    ],

    plugins: {
        gridfilters: true
    },

    columns: [{
        text: 'First Name',
        width: 130,
        dataIndex: 'firstName'
    }, {
        text: 'Last Name',
        width: 130,
        dataIndex: 'lastName'
    }, {
        text: 'Title',
        flex: 1,
        dataIndex: 'title'
    }, {
        text: 'Address',
        flex: 1,
        dataIndex: 'address'
    }, {
        text: 'Company',
        flex: 1,
        dataIndex: 'company'
    }],
    listeners: {
        /*
        initialize: function (sender, eOpts) {
            console.log(sender);
            console.log(eOpts);
        }

         */
    }
});