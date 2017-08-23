import {CustomerActor} from "../../testHelpers/Actors/CustomerActor";
let assert = require('assert');
/**
 * Created by Piggat on 8/3/2017.
 */
describe('#CustomerActor', function() {
    describe('randomCustomer', function() {
        it('tạo được một đối tượng Customer Actor với tài khoản khách hàng ngẫu nhiên', async function() {
            let customer = await CustomerActor.randomCustomer();
            assert.ok(customer.UserName);
        });
    });

    describe('backdoorLogin', function() {
        it('tạo được accesstoken cho khách hàng ngẫu nhiên', async function() {
            let customer = await CustomerActor.randomCustomer();
            await customer.backdoorLogin();

            assert.ok(customer.AccessToken);
        });
    })
});