declare namespace Models {
export interface CustomerIntegration extends ModelInstance{
    id? : number;
    customerId? : Number;
    integrationId? : Number;
    externalId? : Number;
    accessToken? : string;
    }
}