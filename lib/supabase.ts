import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sgthcgbnngkjolcnmxdv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndGhjZ2Jubmdram9sY25teGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjM3ODg0OCwiZXhwIjoyMDQ3OTU0ODQ4fQ.My1l70DDksGPqj-Ujcmom8NmvVY0Lx0pWnQrHGn0AYU'

export const supabase = createClient(supabaseUrl, supabaseKey)

