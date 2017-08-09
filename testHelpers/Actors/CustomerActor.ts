import {PolimServerApp} from "../PolimApp";
import {BaseActor} from "./BaseActor";
import {RandomUtils} from "../../libs/RandomUtils";
/**
 * Created by Piggat on 8/3/2017.
 * Lớp actor dành cho thao tác của customer
 */
export class CustomerActor extends BaseActor{
    private _username;
    private _password;
    private _customer;

    constructor(username: string, password: string) {
        super();
        this._username = username;
        this._password = password;
    }

    public get UserName() {
        return this._username;
    }

    /**
     * Đăng nhập vào tài khoản của khách bằng biện pháp can thiệp database
     */
    public async backdoorLogin() {
        let app = PolimServerApp.getInstance();

        let tokenModel = app.Server.models.AccessToken;
        let accessToken = await tokenModel.create({
            id: RandomUtils.randomString(64),
            ttl: 1209600,
            scopes: null,
            created: new Date(),
            principalType: 'Customer',
            userId: this._customer.id
        });

        this._accessToken = accessToken.id;
    }

    /**
     * Lấy về một khách hàng ngẫu nhiên có trong database
     * @returns {CustomerActor}
     */
    public static async randomCustomer(): Promise<CustomerActor> {
        let app:PolimServerApp = PolimServerApp.getInstance();
        let customerModel = app.Server.models.Customer;
        let count = await customerModel.count();

        let skip = RandomUtils.randomInt(1, count) - 1;

        let customers = await customerModel.find({limit: 1, skip: skip});

        if (customers.length === 0) {
            throw new Error('No customer existed in database');
        }

        let customer = customers[0];

        let actor = new CustomerActor(customer.username, "");
        actor._customer = customer;
        return actor;
    }
}