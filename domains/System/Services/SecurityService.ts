/**
 * Created by Piggat on 8/9/2017.
 */
export class SecurityService {
    /**
     * Return current userId from context
     * @param httpContext
     * @returns {any}
     */
    public static getCurrentCustomerId(httpContext):number {
        if (httpContext) {
            if (httpContext.req.accessToken && httpContext.req.accessToken.principalType == 'Customer')
            {
                return httpContext.req.accessToken.userId;
            }
        }

        return 0;
    }
}