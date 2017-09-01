/**
 * Created by Piggat on 8/4/2017.
 */
import {BaseIntegration} from "./Base/BaseIntegration";
import {IPurchasing} from "./Base/IPurchasing";
import {IExchangeRate} from "./Base/IPurchasing";
import {IOrderFeature, IGroup, IFeature} from "./Base/IPurchasing";
/**
 * Mockup service, dùng cho việc test
 */
export class MockupService extends BaseIntegration implements IPurchasing {
    //region -- IPurchasing implement --
    async getExchange(customerId, appliedTime = new Date()): Promise<IExchangeRate> {
        return {
            rate: 3000,
            baseCurrency: 'CNY',
            targetCurrency: 'VND'
        }
    }

    async getOrderFeature(customerId, appliedTime = new Date()): Promise<IOrderFeature> {
        let groups: IGroup = {
            code: "INTERNATIONAL",
            name: "Vận chuyển quốc tế",
            isRequired: true,
            isMultiChoice: true
        }

        let features1: IFeature = {
            code: "BUYING",
            name: "Mua hàng",
            icon: null,
            enabled: false,
            pending: false,
            default: true,
            groupcode: null,
            requires: null
        }
        let features2: IFeature = {
            code: "CHECKING",
            name: "Kiểm hàng",
            icon: null,
            enabled: true,
            pending: false,
            default: true,
            groupcode: null,
            requires: null
        }
        let features3: IFeature = {
            code: "WOOD_CRATING",
            name: "Đóng gỗ",
            icon: null,
            enabled: true,
            pending: false,
            default: false,
            groupcode: null,
            requires: null
        }
        let features4: IFeature = {
            code: "SHIPPING_CHINA_VIETNAM",
            name: "Vận chuyển thường",
            icon: null,
            enabled: true,
            pending: false,
            default: true,
            groupcode: "INTERNATIONAL",
            requires: null
        }
        let features5: IFeature = {
            code: "EXPRESS_CHINA_VIETNAM",
            name: "Chuyển phát nhanh",
            icon: null,
            enabled: true,
            pending: false,
            default: false,
            groupcode: "INTERNATIONAL",
            requires: null
        }
        let features6: IFeature = {
            code: "SAVING_TRANSPORT",
            name: "Chuyển phát tiết kiệm",
            icon: null,
            enabled: true,
            pending: true,
            default: false,
            groupcode: "INTERNATIONAL",
            requires: null
        }
        let features7: IFeature = {
            code: "APPROVED_TRANSPORT_STRAIGHT",
            name: "Chuyển thẳng nhà khách",
            icon: null,
            enabled: true,
            pending: true,
            default: false,
            groupcode: null,
            requires: null
        }

        return {
            groups: [groups],
            features: [
                features1,
                features2
            ]
        }
    }

    //endregion
}