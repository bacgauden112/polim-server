import {BaseIntegration} from "./Base/BaseIntegration";
import Integration = Models.Integration;
import {ErrorFactory} from "../../../server/utils/ErrorFactory";
import LoopBackBase = LoopBack.LoopBackBase;
/**
 * Created by Piggat on 8/8/2017.
 */
export class IntegrationFactory {
    private static _instances:any = {};

    /**
     * Tạo ra một BaseIntegration dựa vào integration (dùng path tương đối với Factory)
     * Nếu singleton là true thì sẽ lấy instance từ pool hoặc tạo mới và đưa vào pool
     * Nếu singleton là false thì sẽ không sử dụng pool chung này
     * @param integrationId
     * @param singleton
     * @returns {Promise<BaseIntegration>}
     */
    public static async createIntegrationService(integrationId: number, singleton:boolean = true):Promise<BaseIntegration> {
        //kiểm tra singleton trước để nếu đã có instance thì lập tức trả về ngay không cần xử lý thêm
        if (singleton) {
            if (IntegrationFactory._instances[integrationId]) {
                return IntegrationFactory._instances[integrationId];
            }
        }

        //region -- get integration info from id --
        let loopback:LoopBackBase = require('loopback');
        let integrationModel = loopback.getModel('Integration');
        let integration:Integration = await integrationModel.findById(integrationId);

        if (integration == null) {
            throw new Error('Ứng dụng dịch vụ chưa được hỗ trợ, liên hệ với hỗ trợ kỹ thuật để được giải đáp');
        }
        //endregion

        return IntegrationFactory.createIntegrationServiceFromIntegration(integration);
    }

    /**
     * Tạo ra một BaseIntegration dựa vào integration (dùng path tương đối với Factory)
     * Nếu singleton là true thì sẽ lấy instance từ pool hoặc tạo mới và đưa vào pool
     * Nếu singleton là false thì sẽ không sử dụng pool chung này
     * @param integration
     * @param singleton
     * @returns {Promise<any>}
     */
    public static async createIntegrationServiceFromIntegration(integration: Integration, singleton: boolean = true) {
        if (singleton) {
            if (IntegrationFactory._instances[integration.id]) {
                return IntegrationFactory._instances[integration.id];
            }
        }

        //region -- create instance from class path --
        let module = require(integration.classPath);
        let names = integration.classPath.split('/');
        let className = names[names.length - 1];
        let classType = module[className];
        let instance:BaseIntegration = new classType(integration.id, integration.integrationName,
            integration.integrationCode, integration.secretKey);
        //endregion

        await instance.loadSetting();

        if (singleton) {
            IntegrationFactory._instances[integration.id] = instance;
        }

        return instance;
    }
}