/**
 * Portal domain and UI type definitions
 */

export type Role = 'admin' | 'customer';
export type View = 'overview' | 'documents' | 'schedule' | 'pricing' | 'guide';
export type Currency = 'KZT' | 'USD' | 'EUR' | 'RUB';
export type Language = 'en' | 'ru' | 'kk';
export type DocumentStatus = 'Missing' | 'Uploaded' | 'Approved';
export type DocumentGroup = 'Client provided' | 'Approve documents' | 'Documents of company formation';

// The entity types below mirror the future API payloads; point them at src/api/types.gen.ts once the backend exists.
export interface DocumentItem {
    id: number;
    name: string;
    category: 'Required' | 'Travel';
    status: DocumentStatus;
    fileName?: string;
    uploadedAt?: string;
    flightNumber?: string;
    arrivalTime?: string;
    departureTime?: string;
    hotelName?: string;
    documentGroup?: DocumentGroup;
}

export interface ScheduleItem {
    id: number;
    date: string;
    time: string;
    title: string;
    location: string;
}

export interface ServiceItem {
    id: number;
    name: string;
    price: number;
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    dob: string;
    visaType: string;
    requestType: string;
    email: string;
    password: string;
    currency: Currency;
    progress: number;
    documents: DocumentItem[];
    schedule: ScheduleItem[];
    services: ServiceItem[];
    arrivalDate?: string;
    departureDate?: string;
    paid?: number;
}
