-- CREATE INDEX idx_salary ON jobs(salary);
-- CREATE INDEX idx_category ON jobs(category);
-- CREATE INDEX idx_company ON jobs(company);
-- CREATE INDEX idx_location ON jobs(location);
-- CREATE INDEX idx_location_category ON jobs(location, category);
-- CREATE INDEX idx_location_salary ON jobs(location, salary);
-- CREATE INDEX idx_jobs_search ON jobs USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_companies_location ON companies (location);

CREATE INDEX idx_companies_name ON companies (companyName);