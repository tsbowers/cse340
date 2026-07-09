-- ========================================
-- Organization Table (Reference)
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Service Project Table (Corrected)
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL, -- Fixed to match your INSERT statements
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id) 
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert Sample Data (15 Projects for 3 Orgs)
-- ========================================

-- Organization 1 Projects
INSERT INTO service_project (organization_id, title, description, project_location, project_date) VALUES 
(1, 'Community Food Drive', 'Collect and distribute food to families in need.', 'Brasília, DF', '2026-07-15'),
(1, 'Soup Kitchen Volunteering', 'Help cook and serve meals at the local shelter.', 'São Paulo, SP', '2026-08-01'),
(1, 'Holiday Hamper Assembly', 'Pack holiday food baskets for low-income seniors.', 'Rio de Janeiro, RJ', '2026-12-20'),
(1, 'School Lunch Program Support', 'Prepare healthy weekday lunches for public school students.', 'Belo Horizonte, MG', '2026-09-10'),
(1, 'Community Garden Harvest', 'Gather fresh produce from the city garden for local food banks.', 'Curitiba, PR', '2026-10-05');

-- Organization 2 Projects
INSERT INTO service_project (organization_id, title, description, project_location, project_date) VALUES 
(2, 'Park Clean-up Day', 'Remove litter and plant flowers in the community park.', 'Salvador, BA', '2026-07-22'),
(2, 'Beach Microplastics Sweep', 'Sift sand to remove hazardous microplastics from the coastline.', 'Fortaleza, CE', '2026-08-15'),
(2, 'Tree Planting Initiative', 'Plant 500 native saplings in deforested urban zones.', 'Manaus, AM', '2026-11-12'),
(2, 'Riverbank Restoration', 'Stabilize erosion zones and clear debris along the river.', 'Recife, PE', '2026-09-18'),
(2, 'Urban Recycling Workshop', 'Teach residents how to properly separate and compost waste.', 'Porto Alegre, RS', '2026-10-24');

-- Organization 3 Projects
INSERT INTO service_project (organization_id, title, description, project_location, project_date) VALUES 
(3, 'After-School Tutoring', 'Provide math and reading help to elementary students.', 'Goiânia, GO', '2026-08-10'),
(3, 'Senior Tech Literacy Class', 'Teach elderly citizens how to safely use smartphones and Zoom.', 'Campinas, SP', '2026-08-25'),
(3, 'Resume Building Workshop', 'Assist job seekers in drafting professional resumes.', 'Belém, PA', '2026-09-05'),
(3, 'Youth Soccer Coaching', 'Mentor and coach youth soccer clinics over the weekend.', 'Natal, RN', '2026-07-30'),
(3, 'English as a Second Language (ESL) Café', 'Host casual conversational circles for immigrants.', 'Florianópolis, SC', '2026-10-14');