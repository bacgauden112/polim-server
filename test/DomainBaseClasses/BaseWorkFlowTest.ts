/**
 * Created by Piggat on 7/28/2017.
 */
import {BaseWorkFlow} from "../../libs/WorkFlow/BaseWorkFlow";
import {WorkFlowStep} from "../../libs/WorkFlow/WorkFlowStep";

let assert = require('assert');
let MockupWorkFlow = new BaseWorkFlow('status', true);
MockupWorkFlow.addStep(new WorkFlowStep('TODO'), 0);
MockupWorkFlow.addStep(new WorkFlowStep('DOING'), 1);
MockupWorkFlow.addStep(new WorkFlowStep('DONE'), 2);

MockupWorkFlow.at('TODO').canGoTo('DOING');
MockupWorkFlow.at('DOING').canGoTo('DONE');
MockupWorkFlow.at('DOING').canGoTo('TODO');
MockupWorkFlow.at('DONE').canGoTo('DOING');

describe('Đối tượng WorkFlow', function() {
    it('có thể tạo thành dữ liệu dạng json và sau đó load lại mà không sai biệt', function() {
        // let oldWorkFlow = JSON.stringify(MockupWorkFlow.toJSON());
        // console.info(oldWorkFlow);
        let newWorkFlow = BaseWorkFlow.fromJSON(MockupWorkFlow.toJSON());

        assert.equal(JSON.stringify(newWorkFlow.toJSON()), JSON.stringify(MockupWorkFlow.toJSON()));
    });
});