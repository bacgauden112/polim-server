import {KeySecretAPIClient} from "../../domains/Integration/Services/SeuDo/KeySecretAPIClient";
/**
 * Created by Piggat on 8/7/2017.
 */
let assert = require('assert');

describe('#KeySecretAPIClient', function() {
    it('function getBaseString should be return correct baseString', function () {
        let seudoClient = new KeySecretAPIClient('key', 'secret');
        seudoClient.generateNonce = function() {
            return '123456';
        };
        seudoClient.getTimestamp = function() {
            return 123456;
        };

        let data:any = {'test': 'data', data: 'test'};

        data.consumer_key = 'key';
        data.nonce = seudoClient.generateNonce();
        data.timestamp = seudoClient.getTimestamp();
        data.signature_method = 'HMAC-SHA1';

        let baseString = seudoClient.getBaseString('https://seudo.vn/testapi','POST', data);
        assert.equal(baseString, 'POST&https%3A%2F%2Fseudo.vn%2Ftestapi&consumer_key%3Dkey%26data%3Dtest%26nonce%3D123456%26signature_method%3DHMAC-SHA1%26test%3Ddata%26timestamp%3D123456');

        data.data = 'Là một đoạn text có dấu';
        baseString = seudoClient.getBaseString('https://seudo.vn/testapi','POST', data);
        assert.equal(baseString,'POST&https%3A%2F%2Fseudo.vn%2Ftestapi&consumer_key%3Dkey%26data%3DL%C3%A0%20m%E1%BB%99t%20%C4%91o%E1%BA%A1n%20text%20c%C3%B3%20d%E1%BA%A5u%26nonce%3D123456%26signature_method%3DHMAC-SHA1%26test%3Ddata%26timestamp%3D123456');
    });

    it('function sign request should have the right signature', function() {
        let seudoClient = new KeySecretAPIClient('key', 'secret');
        seudoClient.generateNonce = function() {
            return '123456';
        };
        seudoClient.getTimestamp = function() {
            return 123456;
        };

        let data:any = {'test': 'data', data: 'test'};

        let signature = seudoClient.getSignature('https://seudo.vn/testapi', 'POST', data);
        assert.equal(signature, 'VcOT7SGjoItyZ2B5bVUvlIBfTHo=');
    })
});