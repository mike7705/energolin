function convertPrice(v,record) {
    if (v !== undefined){
        //console.log('value');
        //console.log(v);
        let s = parseFloat(v.replace(/[^0-9.,]/gim, ''));
        //console.log(parseFloat(record.price.replace(/,/g, '')));
        //console.log(s);
        return s;
    } else return 0;

};
Ext.define('TPcalc.model.Selected', {
    extend: 'TPcalc.model.Base',

    fields: [
        {
            name: 'id',
            type: 'int',
            convert:null
        },
        {
            name: 'group',
            type: 'int',
            convert:null
        },
        {
            name:'name',
            type:'string',
            convert: null
        },
        {
            name:'price',
            type: 'float',
        },
        {
            name:'quantity',
            type: 'float'
        },
        {
            name:'measurement',
            type:"string",
            convert:null
        },
        {
            name: 'fullprice',
            type: 'float',
            //convert: null
        }
    ],
});
