import {RandomUtils} from "../../libs/RandomUtils";
/**
 * Created by Piggat on 8/3/2017.
 */

let assert = require('assert');
describe('#RandomUtils', function() {
    describe('randomInt(min,max)', function() {
        it('luôn trả về giá trị ngẫu nhiên >= min', function() {
            let rnd = RandomUtils.randomInt(4,50);
            assert.equal(true, rnd >= 4);

            rnd = RandomUtils.randomInt(22,30);
            assert.equal(true, rnd >= 4);
        });

        it('luôn trả về giá trị ngẫu nhiên <= max', function() {
            let rnd = RandomUtils.randomInt(4,50);
            assert.equal(true, rnd <= 50);

            rnd = RandomUtils.randomInt(13,26);
            assert.equal(true, rnd <= 26);
        });

        it('luôn trả về giá trị là số nguyên', function() {
            let rnd = RandomUtils.randomInt(1,30);
            assert.equal(Math.round(rnd), rnd);

            rnd = RandomUtils.randomInt(5,60);
            assert.equal(Math.round(rnd), rnd);
        });

        it('có exception khi không có giá trị min hoặc max truyền vào ', function() {
            assert.throws(()=> {
                RandomUtils.randomInt(null, null);
            });

            assert.throws(()=> {
                RandomUtils.randomInt(2, null);
            });

            assert.throws(()=> {
                RandomUtils.randomInt(null, 2);
            });
        });

        it('có exception khi giá trị min > max', function() {
            assert.throws(()=> {
                RandomUtils.randomInt(30, 2);
            });
        });
    });

    describe('randomString(numberOfChar)', function() {
        it('trả về chuỗi có số ký tự bằng giá trị độ dài truyền vào', function() {
            let length = RandomUtils.randomInt(1,30);
            for (let ii = 0; ii < 3; ii++) {
                let str = RandomUtils.randomString(length);
                assert.equal(str.length, length);
            }
        });

        it('chuỗi trả về của hai lần ngẫu nhiên liên tiếp về cơ bản sẽ không giống nhau', function() {
            let length = RandomUtils.randomInt(1,30);
            for (let ii = 0; ii < 3; ii++) {
                let str1 = RandomUtils.randomString(length);
                let str2 = RandomUtils.randomString(length);
                assert.notEqual(str1, str2);
            }
        });

        it('chuỗi trả về không có ký tự đặc biệt', function() {
            let length = RandomUtils.randomInt(1,30);
            let specials = [',','.',';','!','@'];
            for (let ii = 0; ii < 3; ii++) {
                let str = RandomUtils.randomString(length);
                for (let special of specials) {
                    let specialIndex = str.indexOf(special);
                    assert.equal(specialIndex, -1);
                }
            }
        })
    });
});