Ext.define('TPcalc.store.Panel', {
    extend:'Ext.data.Store',
    viewModel: 'main',
    // Named Store
    storeId: 'forumStore',
    alias: 'store.Panel',
    fields: [
        'firstName', 'lastName', 'address', 'company', 'title', {
            name: 'id',
            type: 'int'
        }
    ],
    data: [
        {'firstName':'d','lastName':'a','address': 'a','company': 'a', 'title':'s', 'id': 1},
        {'firstName':'d','lastName':'a','address': 'a','company': 'a', 'title':'s', 'id': 1}
        ],
    // Remote Data
    /*
    proxy: {
        type: 'ajax',
        url: 'https://llbzr8dkzl.execute-api.us-east-1.amazonaws.com/production/user',
        reader: {
            rootProperty: 'users',
            totalProperty: 'totalCount'
        }
    },

     */
    pageSize: 25,
    autoLoad: true
});