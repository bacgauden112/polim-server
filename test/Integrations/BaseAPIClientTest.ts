import {BaseAPIClient} from "../../domains/Integration/Services/Base/BaseAPIClient";
import {RequestMethod} from "../../testHelpers/PolimApp";
/**
 * Created by Piggat on 8/17/2017.
 */
let assert = require('assert');
describe('#Base API Client', function() {
    it('sẽ timeout theo thời gian ', async function() {
        let client = new BaseAPIClient();
        client.Timeout = 1;
        try {
            let response = await client.request('https://google.com', RequestMethod.GET, {});
        }
        catch (err) {
            assert.equal(err.name, 'FetchError');
            assert.equal(err.type, 'request-timeout');
        }
    });
});