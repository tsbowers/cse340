-- =======================================================
-- 1. Create Organization Table
-- =======================================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- =======================================================
-- 2. Create Project Table
-- =======================================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- =======================================================
-- 3. Create Category Table (Assignment New)
-- =======================================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =======================================================
-- 4. Create Many-to-Many Junction Table (Assignment New)
-- =======================================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- =======================================================
-- 5. Insert Sample Data: Organizations
-- =======================================================
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- =======================================================
-- 6. Insert Sample Data: Projects
-- =======================================================
INSERT INTO project (organization_id, title, description, location, date)
VALUES
(1, 'Community Center Ramp', 'Building an accessibility ramp for the local center.', 'Downtown Hub', '2026-08-12'),
(1, 'Park Bench Restoration', 'Repairing and painting worn-out benches.', 'Central Park', '2026-08-19'),
(1, 'Roof Repair Initiative', 'Helping low-income families fix leaky roofs.', 'Eastside Neighborhood', '2026-09-02'),
(1, 'Library Bookcase Build', 'Constructing custom wooden shelving units.', 'Public Library', '2026-09-15'),
(1, 'Sidewalk Leveling', 'Fixing broken concrete pathways to prevent tripping.', 'West End Avenue', '2026-10-01'),

(2, 'Spring Seed Sowing', 'Planting initial heirloom vegetable seeds.', 'Community Plot A', '2026-08-15'),
(2, 'Compost Bin Construction', 'Building durable triple-bin composting units.', 'Northside Garden', '2026-08-25'),
(2, 'Drip Irrigation Install', 'Setting up water-saving irrigation lines.', 'Community Plot B', '2026-09-05'),
(2, 'Harvest Festival Prep', 'Sorting and packing fresh produce for distribution.', 'Downtown Market', '2026-09-20'),
(2, 'Winter Soil Prepping', 'Spreading mulch and cover crops for the colder season.', 'Northside Garden', '2026-10-10'),

(3, 'Senior Tech Support Day', 'Teaching elderly residents how to use smartphones.', 'Golden Age Home', '2026-08-14'),
(3, 'Food Bank Sorting', 'Organizing incoming non-perishable food items.', 'Main Street Food Bank', '2026-08-28'),
(3, 'School Supply Packing', 'Assembling backpacks full of supplies for kids.', 'City Hall Basement', '2026-09-08'),
(3, 'Animal Shelter Walking', 'Walking and socializing rescue dogs.', 'Happy Tails Shelter', '2026-09-22'),
(3, 'Highway Clean Up', 'Removing litter from the local state highway segment.', 'Mile Marker 42', '2026-10-05');

-- =======================================================
-- 7. Insert Sample Data: Categories (Assignment New)
-- =======================================================
INSERT INTO category (name) VALUES 
('Construction & Infrastructure'),
('Agriculture & Sustainability'),
('Community Service & Education');

-- =======================================================
-- 8. Link Projects to Categories (Assignment New)
-- =======================================================
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);