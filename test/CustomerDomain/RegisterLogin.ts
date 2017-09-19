import {PolimServerApp, RequestMethod, SECRET} from "../../testHelpers/PolimApp";
import {DataHelper} from "../../testHelpers/DataHelper";
import {CustomerActor} from "../../testHelpers/Actors/CustomerActor";
import {RandomUtils} from "../../libs/RandomUtils";
import {accessSync} from "fs";
let assert = require('assert');
/**
 * Created by Piggat on 8/3/2017.
 */
describe('#API POST /Customers', function () {
    it('sẽ không tạo được tài khoản nếu không có địa chỉ email', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu không có username', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu không có password', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            username: DataHelper.createUsername(fullName)
        };
        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        console.log('password:');
        console.log(response.status);
        assert.equal(response.status, 422);
    });
    it('sẽ không tạo được tài khoản nếu không có header x-secret-token', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', null , externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu không có header external-id', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu không có header access-token', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abc', SECRET.SEUDO);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        console.log(response.status);
        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu trùng email', async function () {
        let customer = await CustomerActor.randomCustomer();
        let email = customer.Customer.email;
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: email,
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu trùng username', async function () {
        let customer = await CustomerActor.randomCustomer();
        let username = customer.Customer.username;
        console.log(`username: ${username}`);
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            username: username,
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu trùng email, chỉ phân biệt chữ hoa chữ thường', async function () {
        let customer = await CustomerActor.randomCustomer();
        let email = customer.Customer.email;
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            email: email,
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        assert.notEqual(response.status, 200);
    });
    it('sẽ không tạo được tài khoản nếu username có ký tự hoa', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            username: DataHelper.createUsername(fullName).toUpperCase(),
            email: `${DataHelper.createUsername(fullName)}@gmail.com`,
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        let data = await response.json();
        assert.equal(sampleData.username.toLowerCase(), data.username);
    });
    it('sẽ không tạo được tài khoản nếu người dùng nhập email có ký tự hoa', async function () {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let externalId = RandomUtils.randomInt(1, 9999);
        let sampleData = {
            username: DataHelper.createUsername(fullName),
            email: `${DataHelper.createUsername(fullName)}@gmail.com`.toUpperCase(),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient('abcd', SECRET.SEUDO, externalId);
        let response = await client.request('Customers', RequestMethod.POST, sampleData);
        let data = await response.json();
        assert.equal(sampleData.email.toLowerCase(), data.email);
    });
});