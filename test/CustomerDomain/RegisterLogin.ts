import {PolimServerApp, RequestMethod} from "../../testHelpers/PolimApp";
import {DataHelper} from "../../testHelpers/DataHelper";
import {CustomerActor} from "../../testHelpers/Actors/CustomerActor";
let assert = require('assert');
/**
 * Created by Piggat on 8/3/2017.
 */
describe('#API POST /Customers', function() {
    it('sẽ không tạo được tài khoản nếu không có địa chỉ email', async function() {
        let firstName = DataHelper.Faker.Name.firstName();
        let lastName = DataHelper.Faker.Name.lastName();
        let fullName = lastName + ' ' + firstName;
        let sampleData = {
            username: DataHelper.createUsername(fullName),
            password: 'abc123$$$'
        };

        let client = PolimServerApp.getClient();
        let response = await client.request('Customers', RequestMethod.POST, sampleData);

        assert.notEqual(response.code, 200);
    });
    it('sẽ không tạo được tài khoản nếu không có username');
    it('sẽ không tạo được tài khoản nếu không có password');
    it('sẽ không tạo được tài khoản nếu trùng email');
    it('sẽ không tạo được tài khoản nếu trùng username');
    it('sẽ không tạo được tài khoản nếu trùng username, chỉ phân biệt chữ hoa chữ thường');
    it('sẽ không tạo được tài khoản nếu trùng email, chỉ phân biệt chữ hoa chữ thường');
});