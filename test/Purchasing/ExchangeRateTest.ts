import {CustomerActor} from "../../testHelpers/Actors/CustomerActor";
import {PolimServerApp, RequestMethod} from "../../testHelpers/PolimApp";
/**
 * Created by Piggat on 8/10/2017.
 */
let assert = require('assert');

describe('#Exchange rate', function() {
    it('trả về tỉ giá mockup đối với user mock', async function () {
        let customer:CustomerActor = await CustomerActor.mockCustomer();
        await customer.backdoorLogin();

        let response = await customer.request('PurchaseOrders/exchangeRate');
        assert.equal(response.status, 200);

        let data = await response.json();
        assert.deepEqual(data, {
            rate: 3000,
            baseCurrency: 'CNY',
            targetCurrency: 'VND'
        });
    });

    it('sẽ không trả về tỉ giá nếu như chưa đăng nhập', async function() {
        let client = PolimServerApp.getClient();
        let response = await client.request('PurchaseOrders/exchangeRate', RequestMethod.GET);
        assert.notEqual(response.status, 200);
    })
});