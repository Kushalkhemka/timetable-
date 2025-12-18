const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// ============================
// Exams API
// ============================

// List exams
app.get('/api/exams', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ exams: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list exams' });
  }
});

// Create exam
app.post('/api/exams', async (req, res) => {
  try {
    const { name, term, department, start_date, end_date } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const { data, error } = await supabase
      .from('exams')
      .insert({ name, term, department, start_date, end_date })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ exam: data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Delete exam
app.delete('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

// Get sessions for an exam
app.get('/api/exams/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('exam_id', id)
      .order('exam_date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Create or bulk create sessions
app.post('/api/exams/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const sessions = Array.isArray(payload) ? payload : [payload];
    const cleaned = sessions.map((s) => ({
      exam_id: id,
      exam_date: s.exam_date,
      start_time: s.start_time,
      end_time: s.end_time,
      course_code: s.course_code,
      course_name: s.course_name,
      section: s.section,
      room: s.room,
      invigilator_id: s.invigilator_id,
      invigilator_name: s.invigilator_name,
      notes: s.notes,
    }));
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert(cleaned)
      .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create sessions' });
  }
});

// Delete a single session
app.delete('/api/exam-sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { error } = await supabase
      .from('exam_sessions')
      .delete()
      .eq('id', sessionId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Manual cleanup endpoint
app.post('/api/cleanup', async (req, res) => {
  try {
    await cleanupOldTimetables();
    res.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Cleanup failed', details: error.message });
  }
});

// Cleanup function to remove old timetables
async function cleanupOldTimetables() {
  try {
    console.log('🧹 Starting timetable cleanup...');
    
    // Delete failed timetables older than 1 hour
    const { error: failedError } = await supabase
      .from('timetables')
      .delete()
      .eq('status', 'failed')
      .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
    if (failedError) {
      console.error('Error cleaning failed timetables:', failedError);
    }
    
    // Delete generating timetables older than 2 hours (stuck generations)
    const { error: generatingError } = await supabase
      .from('timetables')
      .delete()
      .eq('status', 'generating')
      .lt('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());
    
    if (generatingError) {
      console.error('Error cleaning generating timetables:', generatingError);
    }
    
    console.log('✅ Timetable cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run cleanup every hour
setInterval(cleanupOldTimetables, 60 * 60 * 1000);

// Simple in-memory syllabus cache keyed by course code
const syllabusCache = new Map();

// Fetch syllabus topics by course code from Supabase (subjects -> curricula -> topics)
async function getSyllabusByCourseCode(courseCode) {
  try {
    const code = String(courseCode || '').trim();
    if (!code) return null;
    if (syllabusCache.has(code)) return syllabusCache.get(code);

    // 1) Find subject by code
    const { data: subjects, error: subjErr } = await supabase
      .from('subjects')
      .select('name, department, code')
      .eq('code', code)
      .limit(1);
    if (subjErr || !subjects || subjects.length === 0) {
      syllabusCache.set(code, null);
      return null;
    }
    const subject = subjects[0];

    // 2) Find latest active/approved curriculum by subject name and department
    const { data: curricula, error: curErr } = await supabase
      .from('curricula')
      .select('id, subject_name, department, status')
      .eq('subject_name', subject.name)
      .eq('department', subject.department)
      .in('status', ['active', 'approved'])
      .order('created_at', { ascending: false })
      .limit(1);
    if (curErr || !curricula || curricula.length === 0) {
      syllabusCache.set(code, null);
      return null;
    }
    const curriculum = curricula[0];

    // 3) Fetch ordered topics for this curriculum
    const { data: topics, error: topicsErr } = await supabase
      .from('topics')
      .select('name, hours, week_number, order_index')
      .eq('curriculum_id', curriculum.id)
      .order('order_index', { ascending: true });
    if (topicsErr) {
      syllabusCache.set(code, null);
      return null;
    }

    const syllabus = {
      subject_code: subject.code,
      subject_name: subject.name,
      department: subject.department,
      curriculum_status: curriculum.status,
      topics: (topics || []).map(t => ({
        name: t.name,
        hours: t.hours,
        week_number: t.week_number,
        order_index: t.order_index
      }))
    };

    syllabusCache.set(code, syllabus);
    return syllabus;
  } catch (e) {
    return null;
  }
}

async function buildSyllabusMapForCourses(courseCodes) {
  const unique = Array.from(new Set(Array.from(courseCodes).filter(Boolean)));
  const entries = await Promise.all(
    unique.map(async (code) => [code, await getSyllabusByCourseCode(code)])
  );
  return new Map(entries);
}

// Function to save timetable data to Supabase
async function saveTimetableToDatabase(timetableName, xmlFilename, records, sections, generationLog, generationParams) {
  try {
    // Check if timetable with same name exists and delete it
    const { data: existingTimetables } = await supabase
      .from('timetables')
      .select('id')
      .eq('name', timetableName);

    if (existingTimetables && existingTimetables.length > 0) {
      console.log(`🗑️ Deleting existing timetable: ${timetableName}`);
      
      // Delete existing timetable and all related data
      for (const existingTimetable of existingTimetables) {
        // Delete classes first (foreign key constraint)
        await supabase
          .from('timetable_classes')
          .delete()
          .eq('timetable_id', existingTimetable.id);
        
        // Delete sections
        await supabase
          .from('timetable_sections')
          .delete()
          .eq('timetable_id', existingTimetable.id);
        
        // Delete timetable
        await supabase
          .from('timetables')
          .delete()
          .eq('id', existingTimetable.id);
      }
    }

    // Create new timetable record
    const { data: timetable, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        name: timetableName,
        xml_filename: xmlFilename,
        generation_params: generationParams,
        status: 'completed',
        generated_at: new Date().toISOString(),
        total_sections: Object.keys(sections).length,
        total_classes: records.length,
        generation_log: generationLog
      })
      .select()
      .single();

    if (timetableError) {
      console.error('Error creating timetable:', timetableError);
      return null;
    }

    const timetableId = timetable.id;

    // Create sections and classes
    for (const [sectionName, sectionData] of Object.entries(sections)) {
      // Create section
      const { data: section, error: sectionError } = await supabase
        .from('timetable_sections')
        .insert({
          timetable_id: timetableId,
          section_name: sectionName
        })
        .select()
        .single();

      if (sectionError) {
        console.error('Error creating section:', sectionError);
        continue;
      }

      // Create classes for this section
      const sectionRecords = records.filter(r => r['Students'] === sectionName);
      if (sectionRecords.length > 0) {
        const classInserts = sectionRecords.map(record => ({
          timetable_id: timetableId,
          section_id: section.id,
          class_id: record['Class ID'],
          course: record['Course'],
          part: record['Part'],
          students: record['Students'],
          day: record['Day'],
          period: record['Period'],
          room: record['Room'],
          instructor: record['Instructor'],
          instructor_name: record['Instructor Name']
        }));

        const { error: classesError } = await supabase
          .from('timetable_classes')
          .insert(classInserts);

        if (classesError) {
          console.error('Error creating classes:', classesError);
        }
      }
    }

    return timetableId;
  } catch (error) {
    console.error('Error saving timetable to database:', error);
    return null;
  }
}

// Get latest timetables endpoint
app.get('/api/latest-timetable', async (req, res) => {
  try {
    const { data: timetables, error } = await supabase
      .from('timetables')
      .select(`
        *,
        timetable_sections (
          id,
          section_name,
          timetable_classes (
            *
          )
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({ error: 'No timetables found' });
    }

    const timetable = timetables[0];
    
    // Restructure data to match frontend expectations
    const sections = {};
    
    // Precollect all course codes from stored snapshot
    const storedCourses = new Set();
    timetable.timetable_sections.forEach(section => {
      section.timetable_classes.forEach(cls => {
        if (cls.course) storedCourses.add(cls.course);
      });
    });

    // 1) Build from stored section snapshot
    const syllabusMap = await buildSyllabusMapForCourses(storedCourses);
    
    timetable.timetable_sections.forEach(section => {
      const grid = {};
      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
      const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);
      
      for (const d of days) {
        grid[d] = {};
        for (const p of periods) grid[d][p] = null;
      }
      
      section.timetable_classes.forEach(cls => {
        grid[cls.day] = grid[cls.day] || {};
        const syllabus = syllabusMap.get(cls.course) || null;
        grid[cls.day][cls.period] = {
          'Class ID': cls.class_id,
          'Course': cls.course,
          'Part': cls.part,
          'Students': cls.students,
          'Day': cls.day,
          'Period': cls.period,
          'Room': cls.room,
          'Instructor': cls.instructor,
          'Instructor Name': cls.instructor_name,
          'Syllabus': syllabus ? syllabus.topics : null
        };
      });
      
      sections[section.section_name] = { grid };
    });

    // 2) Live overlay: include any current timetable_classes linked to this timetable_id
    //    This ensures newly inserted rows without section linkage are visible immediately.
    try {
      const { data: liveRows, error: liveError } = await supabase
        .from('timetable_classes')
        .select('*')
        .eq('timetable_id', timetable.id);

      if (!liveError && Array.isArray(liveRows)) {
        const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
        const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);

        // Prefetch any additional course codes present only in liveRows
        const liveCourses = new Set(liveRows.map(r => r.course).filter(Boolean));
        const liveSyllabusMap = await buildSyllabusMapForCourses(liveCourses);

        for (const row of liveRows) {
          const sectionName = row.students || 'UNKNOWN';
          if (!sections[sectionName]) {
            // Initialize empty grid for any ad-hoc section
            const grid = {};
            for (const d of days) {
              grid[d] = {};
              for (const p of periods) grid[d][p] = null;
            }
            sections[sectionName] = { grid };
          }
          const grid = sections[sectionName].grid;
          grid[row.day] = grid[row.day] || {};
          const syllabus = (liveSyllabusMap.get(row.course) || syllabusMap.get(row.course)) || null;
          grid[row.day][row.period] = {
            'Class ID': row.class_id,
            'Course': row.course,
            'Part': row.part,
            'Students': row.students,
            'Day': row.day,
            'Period': row.period,
            'Room': row.room,
            'Instructor': row.instructor,
            'Instructor Name': row.instructor_name,
            'Syllabus': syllabus ? syllabus.topics : null
          };
        }
      }
    } catch (e) {
      // Non-fatal; proceed with stored snapshot
      console.warn('Live overlay failed:', e?.message || e);
    }

    res.set('Cache-Control', 'no-store');
    res.json({
      sections,
      raw: timetable.timetable_sections.flatMap(s => s.timetable_classes),
      log: timetable.generation_log,
      metadata: {
        id: timetable.id,
        name: timetable.name,
        created_at: timetable.created_at,
        total_sections: timetable.total_sections,
        total_classes: timetable.total_classes
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get teacher timetables endpoint (using stored data)
app.get('/api/teacher-timetables', async (req, res) => {
  try {
    // First, get the latest completed timetable
    const { data: timetables, error: timetableError } = await supabase
      .from('timetables')
      .select('id, name, generated_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (timetableError) {
      return res.status(500).json({ error: 'Database error', details: timetableError.message });
    }

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({ error: 'No timetables found' });
    }

    const timetable = timetables[0];

    // Check if teacher timetables exist for this timetable
    const { data: teacherTimetables, error: teacherError } = await supabase
      .from('teacher_timetables')
      .select(`
        *,
        teacher_timetable_classes (*)
      `)
      .eq('timetable_id', timetable.id);

    if (teacherError) {
      return res.status(500).json({ error: 'Database error', details: teacherError.message });
    }

    // If no teacher timetables exist, populate them
    if (!teacherTimetables || teacherTimetables.length === 0) {
      console.log('No teacher timetables found, populating from timetable data...');
      
      // Call the populate function
      const { error: populateError } = await supabase.rpc('populate_teacher_timetables', {
        timetable_uuid: timetable.id
      });

      if (populateError) {
        console.error('Error populating teacher timetables:', populateError);
        return res.status(500).json({ error: 'Failed to populate teacher timetables', details: populateError.message });
      }

      // Fetch the newly populated teacher timetables
      const { data: newTeacherTimetables, error: newTeacherError } = await supabase
        .from('teacher_timetables')
        .select(`
          *,
          teacher_timetable_classes (*)
        `)
        .eq('timetable_id', timetable.id);

      if (newTeacherError) {
        return res.status(500).json({ error: 'Database error', details: newTeacherError.message });
      }

      return res.json(await formatTeacherTimetablesResponse(newTeacherTimetables, timetable));
    }

    res.json(await formatTeacherTimetablesResponse(teacherTimetables, timetable));
  } catch (error) {
    console.error('Error fetching teacher timetables:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Helper function to format teacher timetables response
async function formatTeacherTimetablesResponse(teacherTimetables, timetable) {
  const formattedTimetables = {};
  let totalClasses = 0;

    // Precollect course codes across all teachers
    const allCourses = new Set();
    teacherTimetables.forEach(teacher => {
      (teacher.teacher_timetable_classes || []).forEach(cls => {
        if (cls.course) allCourses.add(cls.course);
      });
    });
    const tSyllabusMap = await buildSyllabusMapForCourses(allCourses);

    teacherTimetables.forEach(teacher => {
    const grid = {};
    const courses = new Set();
    const sections = new Set();

    // Initialize grid
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);
    
    for (const d of days) {
      grid[d] = {};
      for (const p of periods) {
        grid[d][p] = null;
      }
    }

    // Populate grid with classes
    teacher.teacher_timetable_classes.forEach(cls => {
      const syllabus = tSyllabusMap.get(cls.course) || null;
      grid[cls.day][cls.period] = {
        'Class ID': cls.class_id,
        'Course': cls.course,
        'Part': cls.part,
        'Students': cls.students,
        'Day': cls.day,
        'Period': cls.period,
        'Room': cls.room,
        'Instructor': teacher.instructor_id,
        'Instructor Name': teacher.instructor_name,
        'Section': cls.section_name,
        'Syllabus': syllabus ? syllabus.topics : null
      };
      
      courses.add(cls.course);
      sections.add(cls.section_name);
      totalClasses++;
    });

    formattedTimetables[teacher.instructor_id] = {
      instructor_id: teacher.instructor_id,
      instructor_name: teacher.instructor_name,
      grid: grid,
      total_classes: teacher.total_classes,
      courses: Array.from(courses),
      sections: Array.from(sections)
    };
  });

  return {
    teacher_timetables: formattedTimetables,
    metadata: {
      timetable_id: timetable.id,
      timetable_name: timetable.name,
      total_teachers: teacherTimetables.length,
      total_classes: totalClasses,
      generated_at: timetable.generated_at
    }
  };
}

// Get specific teacher timetable endpoint (using stored data)
app.get('/api/teacher-timetable/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    // Get the latest completed timetable
    const { data: timetables, error: timetableError } = await supabase
      .from('timetables')
      .select('id, name, generated_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (timetableError) {
      return res.status(500).json({ error: 'Database error', details: timetableError.message });
    }

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({ error: 'No timetables found' });
    }

    const timetable = timetables[0];

    // Get teacher timetable from stored data
    const { data: teacherTimetable, error: teacherError } = await supabase
      .from('teacher_timetables')
      .select(`
        *,
        teacher_timetable_classes (*)
      `)
      .eq('timetable_id', timetable.id)
      .eq('instructor_id', instructorId)
      .single();

    if (teacherError) {
      if (teacherError.code === 'PGRST116') {
        return res.status(404).json({ error: 'No classes found for this instructor' });
      }
      return res.status(500).json({ error: 'Database error', details: teacherError.message });
    }

    // Format the response
    const grid = {};
    const courses = new Set();
    const sections = new Set();

    // Initialize grid
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);
    
    for (const d of days) {
      grid[d] = {};
      for (const p of periods) {
        grid[d][p] = null;
      }
    }

    // Prefetch syllabus for this teacher's courses
    const thisCourses = new Set((teacherTimetable.teacher_timetable_classes || []).map(c => c.course).filter(Boolean));
    const oneSyllabusMap = await buildSyllabusMapForCourses(thisCourses);

    // Populate grid with classes
    teacherTimetable.teacher_timetable_classes.forEach(cls => {
      const syllabus = oneSyllabusMap.get(cls.course) || null;
      grid[cls.day][cls.period] = {
        'Class ID': cls.class_id,
        'Course': cls.course,
        'Part': cls.part,
        'Students': cls.students,
        'Day': cls.day,
        'Period': cls.period,
        'Room': cls.room,
        'Instructor': teacherTimetable.instructor_id,
        'Instructor Name': teacherTimetable.instructor_name,
        'Section': cls.section_name,
        'Syllabus': syllabus ? syllabus.topics : null
      };
      
      courses.add(cls.course);
      sections.add(cls.section_name);
    });

    const formattedTimetable = {
      instructor_id: teacherTimetable.instructor_id,
      instructor_name: teacherTimetable.instructor_name,
      grid: grid,
      total_classes: teacherTimetable.total_classes,
      courses: Array.from(courses),
      sections: Array.from(sections)
    };

    res.json({
      teacher_timetable: formattedTimetable,
      metadata: {
        timetable_id: timetable.id,
        timetable_name: timetable.name,
        generated_at: timetable.generated_at
      }
    });
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


app.post('/api/generate', upload.single('xml'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Missing xml file' });
    }

    const xmlPath = req.file.path;
    const xmlFilename = req.file.originalname;
    const projectRoot = path.resolve(process.cwd(), '..');
    const pythonScript = path.join(projectRoot, 'scheduler_flexible_teachers.py');

    // Create initial timetable record
    const timetableName = req.body.name || `Timetable_${new Date().toISOString().split('T')[0]}`;
    const generationParams = {
      generations: 2000,
      population: 120,
      xml_filename: xmlFilename
    };

    // Check if timetable with same name exists and delete it first
    const { data: existingTimetables } = await supabase
      .from('timetables')
      .select('id')
      .eq('name', timetableName);

    if (existingTimetables && existingTimetables.length > 0) {
      console.log(`🗑️ Deleting existing timetable before generation: ${timetableName}`);
      
      // Delete existing timetable and all related data
      for (const existingTimetable of existingTimetables) {
        // Delete classes first (foreign key constraint)
        await supabase
          .from('timetable_classes')
          .delete()
          .eq('timetable_id', existingTimetable.id);
        
        // Delete sections
        await supabase
          .from('timetable_sections')
          .delete()
          .eq('timetable_id', existingTimetable.id);
        
        // Delete timetable
        await supabase
          .from('timetables')
          .delete()
          .eq('id', existingTimetable.id);
      }
    }

    // Create timetable record with 'generating' status
    const { data: timetable, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        name: timetableName,
        xml_filename: xmlFilename,
        generation_params: generationParams,
        status: 'generating',
        generation_log: 'Starting generation...'
      })
      .select()
      .single();

    if (timetableError) {
      console.error('Error creating initial timetable record:', timetableError);
    }

    const py = spawn('python3', [pythonScript, xmlPath, '--generations', '3000', '--population', '120', '--save_html'], {
      cwd: projectRoot
    });

    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => { stdout += d.toString(); });
    py.stderr.on('data', (d) => { stderr += d.toString(); });

    py.on('close', async (code) => {
      try {
        if (code !== 0) {
          // Update timetable status to failed
          if (timetable) {
            await supabase
              .from('timetables')
              .update({ 
                status: 'failed', 
                error_message: stderr,
                generation_log: stdout
              })
              .eq('id', timetable.id);
          }
          return res.status(500).json({ error: 'Scheduler failed', details: stderr });
        }

        // Find the most recent generated CSV file
        const files = await fs.promises.readdir(projectRoot);
        const csvFiles = files.filter((f) => f.startsWith('DTU_flexible_teacher_timetable_') && f.endsWith('.csv'));
        if (csvFiles.length === 0) {
          // Update timetable status to failed
          if (timetable) {
            await supabase
              .from('timetables')
              .update({ 
                status: 'failed', 
                error_message: 'CSV not found after scheduler run',
                generation_log: stdout
              })
              .eq('id', timetable.id);
          }
          return res.status(500).json({ error: 'CSV not found after scheduler run' });
        }
        
        csvFiles.sort((a, b) => fs.statSync(path.join(projectRoot, b)).mtimeMs - fs.statSync(path.join(projectRoot, a)).mtimeMs);
        const latestCsv = path.join(projectRoot, csvFiles[0]);

        const records = await new Promise((resolve, reject) => {
          const out = [];
          fs.createReadStream(latestCsv)
            .pipe(parse({ columns: true, skip_empty_lines: true }))
            .on('data', (row) => out.push(row))
            .on('end', () => resolve(out))
            .on('error', (err) => reject(err));
        });

        // Group by Students (section)
        const bySection = {};
        for (const r of records) {
          if (!bySection[r['Students']]) bySection[r['Students']] = [];
          bySection[r['Students']].push(r);
        }

        // Structure days -> periods
        const response = Object.fromEntries(
          Object.entries(bySection).map(([section, rows]) => {
            const grid = {};
            const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
            const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);
            for (const d of days) {
              grid[d] = {};
              for (const p of periods) grid[d][p] = null;
            }
            for (const r of rows) {
              grid[r['Day']] = grid[r['Day']] || {};
              grid[r['Day']][r['Period']] = r;
            }
            return [section, { grid }];
          })
        );

        // Save to database
        let savedTimetableId = null;
        if (timetable) {
          savedTimetableId = await saveTimetableToDatabase(
            timetableName,
            xmlFilename,
            records,
            response,
            stdout,
            generationParams
          );
          
          // Populate teacher timetables after successful save
          if (savedTimetableId) {
            try {
              console.log('Populating teacher timetables...');
              const { error: populateError } = await supabase.rpc('populate_teacher_timetables', {
                timetable_uuid: savedTimetableId
              });
              
              if (populateError) {
                console.error('Error populating teacher timetables:', populateError);
              } else {
                console.log('Teacher timetables populated successfully');
              }
            } catch (populateError) {
              console.error('Error populating teacher timetables:', populateError);
            }
          }
        }

        // Cleanup temp xml
        fs.promises.unlink(xmlPath).catch(() => {});

        res.json({ 
          sections: response, 
          raw: records, 
          log: stdout,
          timetable_id: savedTimetableId,
          metadata: {
            name: timetableName,
            total_sections: Object.keys(response).length,
            total_classes: records.length,
            generated_at: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error in generation process:', error);
        res.status(500).json({ error: 'Generation process failed', details: error.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
});

app.listen(config.server.port, () => {
  console.log(`Timetable backend listening on :${config.server.port}`);
  console.log(`Supabase URL: ${config.supabase.url}`);
});
