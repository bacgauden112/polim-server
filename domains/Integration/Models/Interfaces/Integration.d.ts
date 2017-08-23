declare namespace Models {
export interface Integration extends ModelInstance{
    id? : number;
    integrationName? : string;
    integrationCode? : string;
    secretKey? : string;
    classPath? : string;
    }
}