-- Timetable Generation Tables for Supabase
-- Project Reference: ketlvbjlukqcolfkwyge

-- Create timetables table to store generation metadata
CREATE TABLE IF NOT EXISTS timetables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    xml_filename VARCHAR(255),
    generation_params JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'generating',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_at TIMESTAMP WITH TIME ZONE,
    total_sections INTEGER DEFAULT 0,
    total_classes INTEGER DEFAULT 0,
    generation_log TEXT,
    error_message TEXT
);

-- Create timetable_sections table to store section data
CREATE TABLE IF NOT EXISTS timetable_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timetable_id UUID REFERENCES timetables(id) ON DELETE CASCADE,
    section_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetable_classes table to store individual class records
CREATE TABLE IF NOT EXISTS timetable_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timetable_id UUID REFERENCES timetables(id) ON DELETE CASCADE,
    section_id UUID REFERENCES timetable_sections(id) ON DELETE CASCADE,
    class_id VARCHAR(100),
    course VARCHAR(255),
    part VARCHAR(100),
    students VARCHAR(255),
    day VARCHAR(50),
    period VARCHAR(50),
    room VARCHAR(255),
    instructor VARCHAR(100),
    instructor_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timetables_created_at ON timetables(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timetables_status ON timetables(status);
CREATE INDEX IF NOT EXISTS idx_timetable_sections_timetable_id ON timetable_sections(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_classes_timetable_id ON timetable_classes(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_classes_section_id ON timetable_classes(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_classes_day_period ON timetable_classes(day, period);

-- Create updated_at trigger for timetables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timetables_updated_at 
    BEFORE UPDATE ON timetables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_classes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on timetables" ON timetables FOR ALL USING (true);
CREATE POLICY "Allow all operations on timetable_sections" ON timetable_sections FOR ALL USING (true);
CREATE POLICY "Allow all operations on timetable_classes" ON timetable_classes FOR ALL USING (true);



-- ============================
-- Exam Scheduling Tables
-- ============================

-- Main exam entity
CREATE TABLE IF NOT EXISTS exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    term VARCHAR(100),
    department VARCHAR(150),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual exam sessions (one paper sitting)
CREATE TABLE IF NOT EXISTS exam_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_code VARCHAR(50),
    course_name VARCHAR(255),
    section VARCHAR(100),
    room VARCHAR(100),
    invigilator_id VARCHAR(120),
    invigilator_name VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_exam_id ON exam_sessions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_date_time ON exam_sessions(exam_date, start_time);

-- Triggers to maintain updated_at
CREATE TRIGGER update_exams_updated_at 
    BEFORE UPDATE ON exams 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

-- Permissive policies (tighten later)
CREATE POLICY "Allow all operations on exams" ON exams FOR ALL USING (true);
CREATE POLICY "Allow all operations on exam_sessions" ON exam_sessions FOR ALL USING (true);

