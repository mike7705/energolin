Ext.define('TPcalc.model.Personnel', {
    extend: 'TPcalc.model.Base',

    fields: ['A', 'B', 'C', 'D',
        {name:'E',type: 'float', convert: function (v,record) {
                if (v!==undefined){
                    v = parseFloat(v.replace(',',''));
                    //console.log(v);
                    return v;
                }
                return 0;
            }},
        'F', 'id']
});
