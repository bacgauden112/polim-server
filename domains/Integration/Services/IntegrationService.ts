import {BaseDomainService} from "../../Base/BaseDomainService";
import CustomerIntegration = Models.CustomerIntegration;
import {IPurchasing} from "./Base/IPurchasing";
import {BaseIntegration} from "./Base/BaseIntegration";
import Integration = Models.Integration;
import {IntegrationFactory} from "./IntegrationFactory";
import IntegrationDomain from "../IntegrationDomain";
/**
 * Created by Piggat on 8/10/2017.
 */
export class IntegrationService extends BaseDomainService{
    protected _domain:IntegrationDomain;

    constructor() {
        super(new IntegrationDomain);
    }

    /**
     * Return all integrations of one customer
     * @param customerId
     * @returns {Promise<CustomerIntegration[]>}
     */
    public async getCustomerIntegrations(customerId: number):Promise<CustomerIntegration[]> {
        let customerIntegrationModel = this._domain.CustomerIntegration;
        return await customerIntegrationModel.find({
            where: {
                customerId: customerId
            }
        });
    }

    /**
     * Lấy về integration theo secret
     * @param secret
     * @returns {Promise<any|Promise<any>>}
     */
    public async getIntegrationBySecret(secret:string):Promise<Integration> {
        let integrationModel = this._domain.Integration;
        return await integrationModel.findOne({
            where: {
                secretKey: secret
            }
        });
    }

    /**
     * Check if service is purchasing service
     * @param service
     * @returns {boolean}
     */
    protected static isPurchasing(service): service is IPurchasing {
        return service.getExchange !== undefined;
    }

    /**
     * Get purchasing service
     * @param service
     * @returns {IPurchasing}
     */
    public static getPurchasing(service:BaseIntegration) {
        if (IntegrationService.isPurchasing(service)) {
            return service;
        }

        return service.getImplementation('IPurchasing');
    }

    /**
     * Lấy về Purchasing Service theo customer
     * @param customerId
     */
    public static async getPurchasingService(customerId): Promise<IPurchasing> {
        let integrations =
            await IntegrationService.getInstance<IntegrationService>().getCustomerIntegrations(customerId);

        let purchasingService:IPurchasing = null;

        for (let integration of integrations) {
            let service = await IntegrationFactory.createIntegrationService(integration.integrationId);
            let extractedService = IntegrationService.getPurchasing(service);

            if (extractedService!=null) {
                purchasingService = extractedService;
                break;
            }
        }

        return purchasingService;
    }
}