/**
 * Created by anhdq on 15/09/2017.
 */
import {ErrorFactory} from "../../../../server/utils/ErrorFactory";

export const IntegrationAPIError = ErrorFactory
    .createError('Không kết nối được tới dịch vụ tích hợp hoặc dịch vụ tích hợp đang gặp sự cố',400,'INTEGRATION_ERROR');