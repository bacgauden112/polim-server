/**
 * Created by Piggat on 8/3/2017.
 */
export class RandomUtils {
    /**
     * return random int number
     * @param min
     * @param max
     * @returns {number}
     */
    public static randomInt(min: number, max: number): number {
        if (min == null || typeof min === 'undefined') {
            throw new Error('randomInt must have min parameter');
        }

        if (max == null || typeof max === 'undefined') {
            throw new Error('randomInt must have max parameter');
        }

        if (min > max) {
            throw new Error('');
        }
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * Sinh chuỗi ký tự ngẫu nhiên
     * @param numberOfChar
     * @returns {string}
     */
    public static randomString(numberOfChar: number):string {
        let alphabetNumber = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let chars = [];

        for (let ii = 0; ii < numberOfChar; ii++) {
            chars.push(alphabetNumber.charAt(RandomUtils.randomInt(0, alphabetNumber.length -1)));
        }

        return chars.join('');
    }

    /**
     * Lấy phần tử ngẫu nhiên trong mảng
     * @param array
     */
    public static randomArray<T>(array: T[]) {
        return array[RandomUtils.randomInt(0, array.length)];
    }
}