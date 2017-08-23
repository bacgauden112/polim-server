import {RandomUtils} from "../../../libs/RandomUtils";
/**
 * Created by Piggat on 8/4/2017.
 */
let firstNameStore = [
    'Kiên', 'Hào', 'Huệ', 'Anh', 'Huy', 'Tiệp', 'Vũ', 'Nội', 'Quang', 'Ngân', 'Hoàn', 'Bách', 'Chiến', 'Dũng',
    'Cường', 'Phương', 'Việt', 'Trung', 'Hoàng', 'Mạnh'
];

let middleNameStore = [
    'Trung', 'Hoàng', 'Mạnh', 'Diệp', 'Quang', 'Văn', 'Văn', 'Văn', 'Văn', 'Xuân'
];

let lastNameStore = [
    'Nguyễn','Nguyễn','Nguyễn','Nguyễn','Trần','Trần','Trần','Trần', 'Hoàng', 'Phạm', 'Bùi'
];

export class NameService {
    public firstName():string {
        return RandomUtils.randomArray(middleNameStore) + RandomUtils.randomArray(firstNameStore);
    }

    public lastName():string {
        return RandomUtils.randomArray(lastNameStore);
    }
}