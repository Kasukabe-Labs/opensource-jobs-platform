CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
  companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    companyName VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logoUrl VARCHAR(255),
    websiteUrl VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW (),
    updated_at TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW (),
    UNIQUE (user_id, company_id)
  )