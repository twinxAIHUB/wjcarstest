import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createAdmin() {
  try {
    // Create the user with admin client to bypass email verification
    const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: 'test.admin@example.com',
      password: 'Admin123!@#',
      email_confirm: true,
      user_metadata: { 
        is_admin: true,
        is_super_admin: true
      }
    })

    if (createUserError || !user) {
      throw createUserError || new Error('No user returned from creation')
    }

    console.log('User created:', user.id)

    // Create admin_users table if it doesn't exist
    const { error: createTableError } = await supabaseAdmin.rpc('create_admin_table').catch(() => ({
      error: null // Function might not exist, which is fine
    }))

    if (createTableError) {
      console.log('Creating table directly...')
      const { error: sqlError } = await supabaseAdmin.from('admin_users').select('id').limit(1)
      
      if (sqlError?.message?.includes('relation "admin_users" does not exist')) {
        const { error: createError } = await supabaseAdmin.from('admin_users').insert({
          id: user.id,
          email: user.email || '',
          is_super_admin: true
        })
        
        if (createError) {
          // Try to clean up the created user
          await supabaseAdmin.auth.admin.deleteUser(user.id)
          throw createError
        }
      }
    }

    // Add user to admin_users table
    const { error: adminError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        id: user.id,
        email: user.email || '',
        is_super_admin: true
      })

    if (adminError) {
      // Try to clean up the created user
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      throw adminError
    }

    console.log('Admin created successfully:', {
      id: user.id,
      email: user.email
    })
  } catch (error) {
    console.error('Failed to create admin:', error)
  }
}

createAdmin() 