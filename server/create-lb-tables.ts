/**
 * Created by anhdq on 27/07/2017.
 */
var server = require('./server');
var ds = server.dataSources.db;
var lbTables = ['CustomerUser', 'CustomerAccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
    if (er) throw er;
    console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
    ds.disconnect();
});