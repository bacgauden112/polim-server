import {BaseDomainService} from "../../domains/Base/BaseDomainService";
/**
 * Created by Piggat on 7/28/2017.
 */
let assert = require('assert');
class MockupService extends BaseDomainService {

}

describe('#Hàm static getInstance của Base Service', function() {
    it('trả về đối tượng của lớp đã thừa kế khi gọi getInstance từ lớp thừa kế', function() {
        let service = MockupService.getInstance<MockupService>();
        assert.equal(service.constructor.name, 'MockupService' );
    });

    it('luôn chỉ trả về một instance service duy nhất khi gọi hàm getInstance', function() {
        let service1 = MockupService.getInstance<MockupService>();
        let service2 = MockupService.getInstance<MockupService>();
        assert.equal(service2, service1);
    });
});