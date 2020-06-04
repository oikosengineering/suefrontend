export interface Professional_Title {
    long: string;
    short: string;
}

export interface Address {
    street_name?: string;
    postcode?: string;
    city?: string;
    cityc_code?: string;
    county?: string;
    county_code?: string;
    country?: string;
}

export interface Birthplace {
    is_foreign?: boolean;
    county?: string;
    county_name?: string;
    city?: string;
    city_name?: string;
}

export interface Profile {
    id?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    professional_title?: string;
    address?: Address;
    gender?: string;
    fiscal_code?: string;
    birth_date?: string;
    birthplace?: Birthplace;
    pec?: string;
    document?: FiscalDocument;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
    role?: string;
    department?: string;
    professional_title?: string;
    address?: Address;
    gender?: string;
    fiscal_code?: string;
    vat?: string;
    birth_date?: string;
    birthplace?: Birthplace;
    phone?: string;
}

export interface Jwt {
    iss: string;
    nbf: number;
    iat: number;
    exp: number;
    sub: string;
    user: User;
    type: string;
}

export interface Deserializable<T> {
    deserialize(input: any): T;
}

export interface EvtSignIn {
    token: string;
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    professional_title?: string;
    type: string;
}

export interface iFakeUser {
    iss: string;
    nbf: number;
    iat: number;
    exp: number;
    sub: string;
    user: User;
    type: string;
}

export class FakeUser {
    constructor(public ifk: iFakeUser) {}
}

export interface Document {
    id?: number;
    name?: string;
    extension?: string;
    date?: string;
}

export interface Procedure {
    id?: string;
    status?: StatusType;
    number?: string;
    protocol?: string;
    user_id?: string;
    category?: string;
    delegated?: boolean;
    owner?: Owner;
    experts?: Expert[];
    qualification?: string;
    work_supplier?: WorkSupplier;
    details?: Detail;
    business_administrator?: Expert;
    supplier_business?: Business;
    referrer?: Referrer;
    referrer_type?: ReferrerType;
    supplier?: Business;
}

export interface Owner {
    type?: string;
    name?: string;
    vat?: string;
    address?: Address;
    contacs?: Contact[];
    email?: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Contact {
    type?: ContactType;
    name?: string;
    email?: string;
    phone?: string;
}

export enum ContactType {
   administrative,
   technical,
   accounting,
   other
}

export enum WorkSupplier {
    self,
    business
}

export enum GenderType {
    M,
    F
}

export enum ExpertType {
    person,
    business
}

export enum QualificationType {
    owner,
    company_representative,
    property_manager
}

export enum FlooringType {
    standard,
    high_quality
}

export enum StatusType {
    NEW,
    PROCESSED,
    PENDING,
    APPROVED,
    REJECTED
}

export enum ReferrerType {
    person,
    business
}

export interface Expert {
    first_name?: string;
    last_name?: string;
    fiscal_code?: string;
    professional_title?: Professional_Title;
    vat?: string;
    gender?: GenderType;
    address?: Address;
    email?: string;
    phone?: string;
    type?: ExpertType;
}

export interface Detail {
    reason?: string;
    description?: string;
    excataion_details?: ExcavationDetail;
    flooring_type?: FlooringType;
    building_site?: BuildingSite;
    duration?: number;
    start_date?: string;
    end_date?: string;
    insurance?: Insurance;
}

export interface ExcavationDetail {
    area_number?: number;
    geometry?: Geometry;
    related_addresses?: RelatedAddress[];
}

export interface RelatedAddress {
    street_name?: string;
    from_street_number?: string;
    to_street_number?: string;
}

export interface Geometry {
    type?: string;
    coordinates?: number[];
}

export interface BuildingSite {
    area_number?: string;
    geometry?: Geometry;
}

export interface Insurance {
    surety?: boolean;
    amount?: number;
}

export interface Business {
    name?: string;
    vat?: string;
    address?: Address;
    contacs?: Contact[];
    email?: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Referrer {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    fiscal_code?: string;
    gender?: string;
    birth_date?: string;
    birthplace?: Birthplace;
    document?: FiscalDocument;
    address?: Address;
    phone?: string;
}

export interface FiscalDocument {
    document_type?: string;
    document_number?: string;
}

export interface Country {
    code?: string;
    name?: string;
}

export interface Province {
    code?: string;
    name?: string;
}

export interface City {
    code?: string;
    name?: string;
}

export interface ListaPratiche {
    procedures?: Procedure[];
    meta?: pagination;
}

export interface pagination {
    total?: number;
    count?: number;
    per_page?: number;
    current_page?: number;
    total_pages?: number;
    links?: string[];
}
