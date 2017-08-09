import {PolimFaker} from "./Faker/PolimFaker";
import {StringNormalizer} from "../libs/StringNormalizer";
/**
 * Created by Piggat on 8/4/2017.
 */
export class DataHelper {
    private static _faker:PolimFaker;

    public static get Faker():PolimFaker {
        if (DataHelper._faker == null) {
            DataHelper._faker = new PolimFaker
        }

        return DataHelper._faker;
    }

    /**
     * Tạo ra một username hợp lệ từ tên
     * @param name
     * @returns {string}
     */
    public static createUsername(name:string):string {
        let unsigned = StringNormalizer.unsign(name);
        unsigned = unsigned.split(/\s/).join('_');
        unsigned = unsigned.toLowerCase();
        let d = new Date();
        return unsigned + d.getTime();
    }
}