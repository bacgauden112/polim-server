declare namespace Models {
export interface Customer extends ModelInstance{
    id? : number;
    email? : string;
    password? : string;
    firstName? : string;
    lastName? : string;
    fullName? : string;
    gender? : number;
    birthday? : Date;
    emailVerified? : number;
    state? : string;
    avatar? : string;
    registeredDate? : Date;
    needChangePass? : number;
    lastLogin? : Date;
    lastChangedPass? : Date;
    verificationToken? : string;
    oldPasswords? : string;
    code? : string;
    lastUsingService? : Date;
    mobile? : string;
    realBalance? : number;
    bankAccountName? : string;
    bankAccountNo? : string;
    bankName? : string;
    bankBranch? : string;
    firstUsingService? : Date;
    }
}