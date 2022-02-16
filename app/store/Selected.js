Ext.define('TPcalc.store.Selected', {
    extend: 'Ext.data.Store',
    storeId: 'mainSelectedDataStore',
    alias: 'store.selected',
    model: 'TPcalc.model.Selected',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'ajax',
        api: {
            read: 'app.php/users/view',
            create: 'app.php/users/create',
            update: 'app.php/users/update',
            destroy: 'app.php/users/destroy'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            rootProperty: 'data',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            rootProperty: 'data'
        },
        listeners: {
            exception: function(proxy, response, operation) {
                Ext.MessageBox.show({
                    //title: 'REMOTE EXCEPTION',
                    //msg: operation.getError(),
                    //icon: Ext.MessageBox.ERROR,
                    //buttons: Ext.Msg.OK
                });
            }
        },
        //totalCount:false,
        //successProperty: false,
        //totalProperty: false
    },
    listeners: {
        write: function(proxy, operation) {
            if (operation.action === 'destroy') {
                //main.child('#form').setActiveRecord(null);
            }

            console.log(operation.action + operation.getResultSet().message);
        }
    }
});
Ext.create('TPcalc.store.Selected');