var server = require('../../server/server');
var ds = server.dataSources.db;
var lbTables = ['Customer'];
ds.automigrate(lbTables, function(er) {
    if (er) throw er;
    console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
    ds.disconnect();
});