/**
 * Created by Piggat on 8/4/2017.
 */
import {BaseIntegration} from "./Base/BaseIntegration";
import {IAddress, IFee, IPurchasing, IServiceFee} from "./Base/IPurchasing";
import {IExchangeRate} from "./Base/IPurchasing";
import {IOrderFeature, IGroup, IFeature} from "./Base/IPurchasing";
/**
 * Mockup service, dùng cho việc test
 */
export class MockupService extends BaseIntegration implements IPurchasing {
    //region -- IPurchasing implement --
    async getExchange(customerId, appliedTime = new Date()): Promise<IExchangeRate> {
        let rate = 3000 * appliedTime.getSeconds() * appliedTime.getMinutes() * 0.01 + 1;
        return {
            rate: rate,
            baseCurrency: 'CNY',
            targetCurrency: 'VND'
        };
    }

    async getOrderFeature(customerId, appliedTime = new Date()): Promise<IOrderFeature> {
        let groups: IGroup = {
            code: "INTERNATIONAL",
            name: "Vận chuyển quốc tế",
            isRequired: true,
            isMultiChoice: true
        };

        let features1: IFeature = {
            code: "BUYING",
            name: "Mua hàng",
            icon: null,
            enabled: false,
            pending: false,
            default: true,
            groupCode: null,
            requires: null
        };
        let features2: IFeature = {
            code: "CHECKING",
            name: "Kiểm hàng",
            icon: null,
            enabled: true,
            pending: false,
            default: true,
            groupCode: null,
            requires: null
        };
        let features3: IFeature = {
            code: "WOOD_CRATING",
            name: "Đóng gỗ",
            icon: null,
            enabled: true,
            pending: false,
            default: false,
            groupCode: null,
            requires: null
        };
        let features4: IFeature = {
            code: "SHIPPING_CHINA_VIETNAM",
            name: "Vận chuyển thường",
            icon: null,
            enabled: true,
            pending: false,
            default: true,
            groupCode: "INTERNATIONAL",
            requires: null
        };
        let features5: IFeature = {
            code: "EXPRESS_CHINA_VIETNAM",
            name: "Chuyển phát nhanh",
            icon: null,
            enabled: true,
            pending: false,
            default: false,
            groupCode: "INTERNATIONAL",
            requires: null
        };
        let features6: IFeature = {
            code: "SAVING_TRANSPORT",
            name: "Chuyển phát tiết kiệm",
            icon: null,
            enabled: true,
            pending: true,
            default: false,
            groupCode: "INTERNATIONAL",
            requires: null
        };
        let features7: IFeature = {
            code: "APPROVED_TRANSPORT_STRAIGHT",
            name: "Chuyển thẳng nhà khách",
            icon: null,
            enabled: true,
            pending: true,
            default: false,
            groupCode: null,
            requires: null
        };

        return {
            groups: [groups],
            features: [
                features1,
                features2,
                features3,
                features4,
                features5,
                features6,
                features7,
            ]
        };
    }

    async getFee(customerId, data): Promise<IFee> {
        let serviceFees: Array<IServiceFee> = [
            {
                code: "BUYING",
                name: "Mua Hàng",
                rawAmount: 645120,
                amount: 548352,
                currency: "VND"
            },
            {
                code: "CHECKING",
                name: "Kiểm Hàng",
                rawAmount: 120000,
                amount: 102000,
                currency: "VND"
            },
            {
                code: "FIXED",
                name: "Phí cố định",
                rawAmount: 5000,
                amount: 0,
                currency: "VND"
            }
        ];
        return {
            total: 53760000,
            currency: "VND",
            serviceFees: serviceFees
        };
    }
    async getAddress(customerId): Promise<IAddress[]> {
        return [
            {
                id: 1,
                streetAddress: "Số 1A tổ 2 Giáp Nhất, phường Nhân Chính",
                districtId: "VN.HI.TX",
                provinceId: "VN.HI",
                contactName: "Nguyễn Xuân Kiên",
                contactPhone: "091234567890",
                isDefault: true,
                type: 1
            },
            {
                id: 2,
                streetAddress: "Số 29A tổ 4 Giáp Nhị, phường Hoàng Liệt",
                districtId: "VN.HI.HM",
                provinceId: "VN.HI",
                contactName: "Đặng Quang Anh",
                contactPhone: "09998110287",
                isDefault: false,
                type: 1
            }
        ];
    }

    async createAddress(customerId, datas): Promise<any> {
        return {
            result: 'success!'
        };
    }

    async deleteAddress(customerId, id): Promise<any> {
        return {
            result: "delete success!"
        };
    }

    async editAddress(customerId, id, data): Promise<any> {
        return {
            "id": 9999,
            "streetAddress": "Số 28 Ngõ 422 Đường Kim Giang",
            "districtId": "VN.HI.HM",
            "provinceId": "VN.HI",
            "contactName": "Thanh 2",
            "contactPhone": "0869137463",
            "isDefault": false
        };
    }
    //endregion
}