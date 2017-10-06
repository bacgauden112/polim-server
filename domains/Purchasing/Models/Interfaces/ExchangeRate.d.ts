declare namespace Models {
    export interface ExchangeRate extends ModelInstance{
        id? : number;
        appliedFrom: Date,
        appliedTo: Date,
        targetCurrency? : string;
        baseCurrency? : string;
        rate? : number;
        creator? : string;
        modifier? : string;
        createdAt? : Date;
        modifiedAt? : Date;
    }
}