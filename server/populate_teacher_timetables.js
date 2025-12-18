#!/usr/bin/env node

/**
 * Script to populate teacher timetables for existing timetables
 * Usage: node populate_teacher_timetables.js [timetable_id]
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

async function populateTeacherTimetables(timetableId = null) {
  try {
    console.log('🚀 Starting teacher timetable population...');
    
    let timetables;
    
    if (timetableId) {
      // Populate specific timetable
      const { data, error } = await supabase
        .from('timetables')
        .select('id, name')
        .eq('id', timetableId)
        .eq('status', 'completed')
        .single();
        
      if (error) {
        console.error('❌ Error fetching timetable:', error.message);
        return;
      }
      
      timetables = [data];
    } else {
      // Populate all completed timetables
      const { data, error } = await supabase
        .from('timetables')
        .select('id, name')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('❌ Error fetching timetables:', error.message);
        return;
      }
      
      timetables = data;
    }
    
    if (!timetables || timetables.length === 0) {
      console.log('ℹ️  No completed timetables found');
      return;
    }
    
    console.log(`📋 Found ${timetables.length} timetable(s) to process`);
    
    for (const timetable of timetables) {
      console.log(`\n🔄 Processing timetable: ${timetable.name} (${timetable.id})`);
      
      // Check if teacher timetables already exist
      const { data: existingTeachers, error: checkError } = await supabase
        .from('teacher_timetables')
        .select('id')
        .eq('timetable_id', timetable.id)
        .limit(1);
        
      if (checkError) {
        console.error('❌ Error checking existing teacher timetables:', checkError.message);
        continue;
      }
      
      if (existingTeachers && existingTeachers.length > 0) {
        console.log('⏭️  Teacher timetables already exist, skipping...');
        continue;
      }
      
      // Call the populate function
      const { error: populateError } = await supabase.rpc('populate_teacher_timetables', {
        timetable_uuid: timetable.id
      });
      
      if (populateError) {
        console.error('❌ Error populating teacher timetables:', populateError.message);
        continue;
      }
      
      // Verify the population
      const { data: teacherCount, error: countError } = await supabase
        .from('teacher_timetables')
        .select('id', { count: 'exact' })
        .eq('timetable_id', timetable.id);
        
      if (countError) {
        console.error('❌ Error counting teacher timetables:', countError.message);
        continue;
      }
      
      console.log(`✅ Successfully populated ${teacherCount.length} teacher timetables`);
    }
    
    console.log('\n🎉 Teacher timetable population completed!');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const timetableId = args[0] || null;

// Run the population
populateTeacherTimetables(timetableId);
