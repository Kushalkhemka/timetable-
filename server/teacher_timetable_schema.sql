-- Teacher Timetable Tables for Supabase
-- This creates separate tables for storing teacher timetables for better performance

-- Create teacher_timetables table to store teacher timetable metadata
CREATE TABLE IF NOT EXISTS teacher_timetables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timetable_id UUID REFERENCES timetables(id) ON DELETE CASCADE,
    instructor_id VARCHAR(100) NOT NULL,
    instructor_name VARCHAR(255) NOT NULL,
    total_classes INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    total_sections INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_timetable_classes table to store individual teacher class records
CREATE TABLE IF NOT EXISTS teacher_timetable_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_timetable_id UUID REFERENCES teacher_timetables(id) ON DELETE CASCADE,
    class_id VARCHAR(100),
    course VARCHAR(255),
    part VARCHAR(100),
    students VARCHAR(255),
    day VARCHAR(50),
    period VARCHAR(50),
    room VARCHAR(255),
    section_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_timetables_timetable_id ON teacher_timetables(timetable_id);
CREATE INDEX IF NOT EXISTS idx_teacher_timetables_instructor_id ON teacher_timetables(instructor_id);
CREATE INDEX IF NOT EXISTS idx_teacher_timetables_created_at ON teacher_timetables(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_timetable_classes_teacher_id ON teacher_timetable_classes(teacher_timetable_id);
CREATE INDEX IF NOT EXISTS idx_teacher_timetable_classes_day_period ON teacher_timetable_classes(day, period);

-- Create updated_at trigger for teacher_timetables
CREATE TRIGGER update_teacher_timetables_updated_at 
    BEFORE UPDATE ON teacher_timetables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE teacher_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_timetable_classes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on teacher_timetables" ON teacher_timetables FOR ALL USING (true);
CREATE POLICY "Allow all operations on teacher_timetable_classes" ON teacher_timetable_classes FOR ALL USING (true);

-- Create a function to populate teacher timetables from existing timetable data
CREATE OR REPLACE FUNCTION populate_teacher_timetables(timetable_uuid UUID)
RETURNS VOID AS $$
DECLARE
    teacher_record RECORD;
    class_record RECORD;
    teacher_timetable_uuid UUID;
BEGIN
    -- Delete existing teacher timetables for this timetable
    DELETE FROM teacher_timetable_classes 
    WHERE teacher_timetable_id IN (
        SELECT id FROM teacher_timetables WHERE timetable_id = timetable_uuid
    );
    DELETE FROM teacher_timetables WHERE timetable_id = timetable_uuid;
    
    -- Insert teacher timetables
    FOR teacher_record IN 
        SELECT DISTINCT 
            tc.instructor as instructor_id,
            tc.instructor_name,
            COUNT(*) as total_classes,
            COUNT(DISTINCT tc.course) as total_courses,
            COUNT(DISTINCT ts.section_name) as total_sections
        FROM timetable_classes tc
        JOIN timetable_sections ts ON tc.section_id = ts.id
        WHERE tc.timetable_id = timetable_uuid
        GROUP BY tc.instructor, tc.instructor_name
    LOOP
        -- Insert teacher timetable record
        INSERT INTO teacher_timetables (
            timetable_id, instructor_id, instructor_name, 
            total_classes, total_courses, total_sections
        ) VALUES (
            timetable_uuid, teacher_record.instructor_id, teacher_record.instructor_name,
            teacher_record.total_classes, teacher_record.total_courses, teacher_record.total_sections
        ) RETURNING id INTO teacher_timetable_uuid;
        
        -- Insert teacher timetable classes
        FOR class_record IN
            SELECT tc.*, ts.section_name
            FROM timetable_classes tc
            JOIN timetable_sections ts ON tc.section_id = ts.id
            WHERE tc.timetable_id = timetable_uuid 
            AND tc.instructor = teacher_record.instructor_id
        LOOP
            INSERT INTO teacher_timetable_classes (
                teacher_timetable_id, class_id, course, part, students,
                day, period, room, section_name
            ) VALUES (
                teacher_timetable_uuid, class_record.class_id, class_record.course, 
                class_record.part, class_record.students, class_record.day, 
                class_record.period, class_record.room, class_record.section_name
            );
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
