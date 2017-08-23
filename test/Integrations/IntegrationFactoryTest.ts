import {IntegrationFactory} from "../../domains/Integration/Services/IntegrationFactory";
import {BaseIntegration} from "../../domains/Integration/Services/Base/BaseIntegration";
import {BasePurchasing} from "../../domains/Integration/Services/Base/BasePurchasing";
import {IntegrationService} from "../../domains/Integration/Services/IntegrationService";
import {MockupService} from "../../domains/Integration/Services/MockupService";
/**
 * Created by Piggat on 8/8/2017.
 */
let assert = require('assert');
describe('#Integration Factory', function() {
    // it('có thể load các class động', function() {
    //     let sd = IntegrationFactory.c('./SeuDo/SeuDoService');
    //     console.error(sd.getSetting);
    // })

    it('Add implementation should add more function to class', function() {
        let test = new BaseIntegration(1,'','','');
        test.addImplementation('IPurchasing', new BasePurchasing(100,'','',''));

        let bp = IntegrationService.getPurchasing(test);
        assert.equal(bp._id,100);

        let mock = new MockupService(223,'','','');
        bp = IntegrationService.getPurchasing(mock);
        assert.equal(bp._id, 223);
    });
});