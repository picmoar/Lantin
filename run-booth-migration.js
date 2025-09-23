// Migration script to add discover_booth_id column
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lmefkkwrlknuyvrvzwvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZWZra3dybGtudXl2cnZ6d3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODQwNjYsImV4cCI6MjA3MTY2MDA2Nn0.arhW3F-uh3osTBeNpzjrzYyDb7OThMroCqcXE6cvmSk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔄 Running discover_booth_id migration...')

async function runMigration() {
  try {
    // Read the SQL migration file
    const sql = fs.readFileSync('./sql/add_discover_booth_id_column.sql', 'utf8')
    console.log('📁 Read migration file successfully')

    console.log('🚨 IMPORTANT: This migration needs to be run with administrative privileges.')
    console.log('📋 Please copy and paste the following SQL into your Supabase dashboard:')
    console.log('🔗 Go to: https://supabase.com/dashboard > Your Project > SQL Editor')
    console.log('')
    console.log('--- BEGIN SQL MIGRATION ---')
    console.log(sql)
    console.log('--- END SQL MIGRATION ---')
    console.log('')

    // Test that we can still access the artists table
    const { data, error } = await supabase
      .from('artists')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Error accessing artists table:', error.message)
    } else {
      console.log('✅ Artists table is accessible')
      console.log('🎯 After running the SQL migration, your booth selection feature will work correctly!')
    }

  } catch (error) {
    console.error('❌ Migration script error:', error)
  }
}

runMigration()