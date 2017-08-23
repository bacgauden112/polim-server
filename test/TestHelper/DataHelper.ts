import {DataHelper} from "../../testHelpers/DataHelper";
import {SharedUtils} from "../../libs/SharedUtils";
/**
 * Created by Piggat on 8/4/2017.
 */
let assert = require('assert');
describe('#DataHelper', function() {
    describe('createUsername', function() {
        it('trả về tên được viết thường toàn bộ, không dấu, sử dụng dấu _ thay dấu cách', function() {
            let username = DataHelper.createUsername('Nguyễn Xuân Kiên');
            assert.equal(username.startsWith('nguyen_xuan_kien'), true);

            username = DataHelper.createUsername('Trần Văn Hoàn');
            assert.equal(username.startsWith('tran_van_hoan'), true);
        });

        it('hai lần liên tiếp trả về tên khác nhau', async function() {
            let username1 = DataHelper.createUsername('Nguyễn Xuân Kiên');
            await SharedUtils.delay(100);
            let username2 = DataHelper.createUsername('Nguyễn Xuân Kiên');

            assert.notEqual(username2, username1);
        });
    });
});