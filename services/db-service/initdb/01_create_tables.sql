CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE jobs(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  salary INTEGER,
  category VARCHAR(100) NOT NULL,
  company VARCHAR(255) NOT NULL,
  companyWebsite VARCHAR(255) NOT NULL,
  companyLogo VARCHAR(255),
  jobUrl VARCHAR(255) NOT NULL UNIQUE,
  postedAt DATE,
  scrapedAt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
