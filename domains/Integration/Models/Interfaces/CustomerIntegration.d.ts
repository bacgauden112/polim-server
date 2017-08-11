declare namespace Models {
export interface CustomerIntegration extends ModelInstance{
    id? : number;
    customerId? : number;
    integrationId? : number;
    externalId? : number;
    accessToken? : string;
    }
}