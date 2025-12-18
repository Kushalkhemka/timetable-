-- Database setup script for curriculum management
-- Run this in your Supabase SQL editor

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curricula table
CREATE TABLE IF NOT EXISTS curricula (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  total_hours INTEGER NOT NULL,
  hours_per_week INTEGER NOT NULL,
  prerequisites TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  hours INTEGER NOT NULL,
  subtopics TEXT[] DEFAULT '{}',
  difficulty VARCHAR(50) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  week_number INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON subjects(is_active);
CREATE INDEX IF NOT EXISTS idx_curricula_department ON curricula(department);
CREATE INDEX IF NOT EXISTS idx_curricula_status ON curricula(status);
CREATE INDEX IF NOT EXISTS idx_topics_curriculum_id ON topics(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(curriculum_id, order_index);

-- Insert sample CSE subjects
INSERT INTO subjects (name, department, code, credits) VALUES
('Data Structures and Algorithms', 'Computer Science Engineering (CSE)', 'CS201', 4),
('Database Management Systems', 'Computer Science Engineering (CSE)', 'CS202', 4),
('Computer Networks', 'Computer Science Engineering (CSE)', 'CS203', 3),
('Operating Systems', 'Computer Science Engineering (CSE)', 'CS204', 4),
('Software Engineering', 'Computer Science Engineering (CSE)', 'CS205', 3),
('Machine Learning', 'Computer Science Engineering (CSE)', 'CS206', 4),
('Web Development', 'Computer Science Engineering (CSE)', 'CS207', 3),
('Object Oriented Programming', 'Computer Science Engineering (CSE)', 'CS208', 4),
('Computer Graphics', 'Computer Science Engineering (CSE)', 'CS209', 3),
('Artificial Intelligence', 'Computer Science Engineering (CSE)', 'CS210', 4),
('Data Mining', 'Computer Science Engineering (CSE)', 'CS211', 3),
('Computer Vision', 'Computer Science Engineering (CSE)', 'CS212', 4),
('Natural Language Processing', 'Computer Science Engineering (CSE)', 'CS213', 3),
('Distributed Systems', 'Computer Science Engineering (CSE)', 'CS214', 4),
('Cybersecurity', 'Computer Science Engineering (CSE)', 'CS215', 3)
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON subjects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON curricula FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON topics FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON curricula FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON topics FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON subjects FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON curricula FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON topics FOR UPDATE USING (true);
