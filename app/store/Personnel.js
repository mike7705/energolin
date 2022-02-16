/**
 * This main store class.
 */
Ext.define('TPcalc.store.Personnel', {
    extend: 'Ext.data.Store',
    storeId: 'mainDataStore',
    alias: 'store.personnel',
    //required: ['Ext.JSON'],
    model: 'TPcalc.model.Personnel',

    autoLoad:true,
    filters: [
        function(item) {
            return item.data.E > 0;
        }
    ],
    proxy: {
        type: 'ajax',
        url: 'app/store/data3.json',
        reader: {
            type: 'json',
            //rootProperty: 'data.std.city.less150',
            rootProperty: function (data) {
                var cM = Ext.getCmp('count-method-select-id');
                var cMV = (cM !== undefined && cM !== null) ? cM.getValue() : null;
                //console.log(cMV);
                var place = Ext.getCmp('city-select-id');
                var placeValue = (place !== undefined && place !== null) ? place.getValue() : null;
                var pwr = Ext.getCmp('power-input');
                if (pwr !== undefined && pwr !== null){
                    var pV = (pwr.getValue() > 150) ? 'greater150' : 'less150';
                } else  pV = null;

                //data.pwr.city.greater150
                if (cMV !== null && placeValue !== null && pV !== null){
                    //console.log(data['data'][countMethodValue][placementValue][powerValue]);
                    return data['data'][cMV][placeValue][pV];
                } else return data;
            },
            totalProperty:false,
            successProperty:false,
        }
    },
    sorters: { property: 'A', direction: 'ASC' },
    groupField: 'F'
});

let mainDataStore = Ext.create('TPcalc.store.Personnel');

