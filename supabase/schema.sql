-- ==============================================================================
-- KAUSHAL SETU — Minimal Supabase Database Schema
-- Aligned with India's Official Statistical System & iGOT Karmayogi
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. States & UTs
CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'state',
    nodal_department TEXT NOT NULL DEFAULT 'Directorate of Economics & Statistics'
);

-- 2. Users / Demo Profiles
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    cadre_id TEXT NOT NULL,
    role TEXT NOT NULL,
    state_id TEXT REFERENCES states(id),
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Competencies (Standard 5 Domains, Target 70%)
CREATE TABLE IF NOT EXISTS competencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    target_score NUMERIC DEFAULT 70,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Initial Assessment Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
    id TEXT PRIMARY KEY,
    competency_id TEXT REFERENCES competencies(id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT
);

-- 5. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id),
    type TEXT DEFAULT 'initial',
    overall_score NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Assessment Answers
CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id TEXT REFERENCES assessment_questions(id),
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

-- 7. User Competencies (Active Scores)
CREATE TABLE IF NOT EXISTS user_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    competency_id TEXT REFERENCES competencies(id),
    score NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    assessed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, competency_id)
);

-- 8. iGOT Resources
CREATE TABLE IF NOT EXISTS igot_resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    competency_id TEXT REFERENCES competencies(id),
    difficulty TEXT NOT NULL,
    duration_hours NUMERIC NOT NULL,
    igot_url TEXT NOT NULL,
    description TEXT,
    provider TEXT DEFAULT 'iGOT Karmayogi'
);

-- 9. Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES igot_resources(id),
    status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
    progress_percent NUMERIC NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, resource_id)
);

-- 10. Uploaded Learning Materials
CREATE TABLE IF NOT EXISTS uploaded_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_url TEXT,
    content_summary TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES uploaded_materials(id),
    title TEXT NOT NULL,
    competency_id TEXT REFERENCES competencies(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT,
    competency_id TEXT,
    difficulty TEXT
);

-- 13. Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Quiz Answers
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(id),
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

-- ==============================================================================
-- Seed Baseline Competencies (Target 70%)
-- ==============================================================================
INSERT INTO competencies (id, name, domain, target_score, description) VALUES
('data_analysis', 'Data Analysis', 'Census & Household Survey Validation', 70, 'NSSO Schedule Scrutiny, Outlier Detection, and Microdata Validation.'),
('statistical_methods', 'Statistical Methods', 'Stratified Sampling & Multi-stage Probability', 70, 'Standard Error Estimation, Weights Computation, and Hypothesis Testing.'),
('data_visualization', 'Data Visualization', 'State Indicator Dashboards & District Profiles', 70, 'Geospatial Mapping, Administrative Infographics, and Executive Reporting.'),
('statistical_computing', 'Statistical Computing', 'Python / R for Microdata Automation', 70, 'Scripting, Large Microdata Transformation, and Pipeline Automation.'),
('ai_digital_skills', 'AI & Digital Skills', 'Automated Census Imputation & ML Modeling', 70, 'Machine learning for statistical imputation, quality audits, and data governance.')
ON CONFLICT (id) DO NOTHING;

-- Seed States
INSERT INTO states (id, name, type, nodal_department) VALUES
('UP', 'Uttar Pradesh', 'state', 'Directorate of Economics & Statistics (DES), UP'),
('MH', 'Maharashtra', 'state', 'Directorate of Economics & Statistics (DES), Maharashtra'),
('KA', 'Karnataka', 'state', 'Directorate of Economics & Statistics (DES), Karnataka'),
('RJ', 'Rajasthan', 'state', 'Directorate of Economics & Statistics (DES), Rajasthan')
ON CONFLICT (id) DO NOTHING;

-- Seed 4 Demo Users (No performance data seeded!)
INSERT INTO users (id, email, full_name, cadre_id, role, state_id, department) VALUES
('usr_up_01', 'officer.up@stats.gov.in', 'Ramesh Kumar', 'MOSPI-UP-84920', 'Statistical Officer', 'UP', 'Directorate of Economics & Statistics'),
('usr_mh_02', 'officer.mh@stats.gov.in', 'Priya Patil', 'MOSPI-MH-71204', 'Statistical Officer', 'MH', 'Directorate of Economics & Statistics'),
('usr_ka_03', 'analyst.ka@stats.gov.in', 'Anand Rao', 'MOSPI-KA-38192', 'Data Analyst', 'KA', 'Directorate of Economics & Statistics'),
('usr_rj_04', 'officer.rj@stats.gov.in', 'Vikram Singh', 'MOSPI-RJ-59301', 'Statistical Officer', 'RJ', 'Directorate of Economics & Statistics')
ON CONFLICT (id) DO NOTHING;
