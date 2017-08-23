var server = require('./server');
var ds = server.dataSources.db;
process.argv.shift();
process.argv.shift();
var lbTables = process.argv;

ds.automigrate(lbTables, function(er) {
    if (er) throw er;
    console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
    ds.disconnect();
});
