export interface Company{
    companyName: string;
    location: string;
    description: string;
    logoUrl: string;
    tags: string[];
    websiteUrl: string;
    created_at?: Date;
    updated_at?: Date;
}