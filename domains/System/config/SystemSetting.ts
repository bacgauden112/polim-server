export class SystemSetting {
    private static _configs: any = {};

    public static async init(systemConfigModel): Promise<void> {
        let configs = await systemConfigModel.find(
            {
                where: {
                    app : 'SERVER'
                }
            }
        );

        for (let config of configs) {
            SystemSetting._configs[config.key] = config.value;
        }
    }

    public static get(key, defaultValue) {
        if (SystemSetting._configs.hasOwnProperty(key) && SystemSetting._configs != null) {
            return SystemSetting._configs[key];
        }
        return defaultValue;
    }
}