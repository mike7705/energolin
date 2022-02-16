/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'TPcalc.Application',

    name: 'TPcalc',

    requires: [
        // This will automatically load all classes in the TPcalc namespace
        // so that application classes do not need to require each other.
        'TPcalc.*',
    ],

    // The name of the initial view to create.
    mainView: 'TPcalc.view.main.Main'
});
