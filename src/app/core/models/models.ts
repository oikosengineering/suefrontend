export interface Professional_Title {
    long: string;
    short: string;
}

export interface Address {
    street_name: string;
    postcode: string;
    city: string;
    privince: string;
    country: string;
}

export interface Birthplace {
    city: string;
    province: string;
}

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    professional_title: Professional_Title;
    address: Address;
    gender: string;
    fiscal_code: string;
    birth_date: string;
    birthplace: Birthplace;
    pec: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
}

export interface Jwt {
    iss: string;
    nbf: string;
    iat: string;
    exp: string;
    sub: string;
    user: User;
    type: string;
}

export interface EvtSignIn {
    token: string;
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    type: string;
}
