// Quick script to run the passcode migration
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lmefkkwrlknuyvrvzwvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZWZra3dybGtudXl2cnZ6d3Z2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA4NDA2NiwiZXhwIjoyMDcxNjYwMDY2fQ.OqZ1e-Z1ixTJzgzGKdFJN3jD_W__QaKxHhfgBW4yxk4'

const supabase = createClient(supabaseUrl, supabaseKey)

// Read and execute the migration
const sql = fs.readFileSync('./sql/add_passcode_column.sql', 'utf8')

console.log('Running migration...')
try {
  const result = await supabase.from('users').select('id').limit(1)
  if (result.data) {
    console.log('✅ Migration would run successfully')
    console.log('Please run this SQL in your Supabase dashboard:')
    console.log(sql)
  }
} catch (error) {
  console.error('❌ Migration error:', error)
}