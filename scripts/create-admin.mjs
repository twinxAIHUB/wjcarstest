import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local file
const envPath = resolve(__dirname, '../.env.local')
console.log('Loading env from:', envPath)
dotenv.config({ path: envPath })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

console.log('Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service Role Key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...')

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
    // Check if the user already exists
    const { data: existingUser, error: searchError } = await supabaseAdmin
      .auth
      .admin
      .listUsers()

    if (searchError) {
      console.error('Error searching for existing users:', searchError)
      throw searchError
    }

    const userEmail = 'test.admin@example.com'
    const existingAdmin = existingUser?.users?.find(u => u.email === userEmail)

    let user
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.id)
      user = existingAdmin
    } else {
      // Create the user with admin client to bypass email verification
      const { data: { user: newUser }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: 'Admin123!@#',
        email_confirm: true,
        user_metadata: { 
          is_admin: true,
          is_super_admin: true
        }
      })

      if (createUserError || !newUser) {
        console.error('Error creating user:', createUserError)
        throw createUserError || new Error('No user returned from creation')
      }

      console.log('User created:', newUser.id)
      user = newUser
    }

    // Try to create admin record
    try {
      const { error: adminError } = await supabaseAdmin
        .from('admin_users')
        .insert({
          id: user.id,
          email: user.email || '',
          is_super_admin: true
        })

      if (adminError) {
        // If table doesn't exist, create it and try again
        if (adminError.message?.includes('relation "admin_users" does not exist')) {
          console.log('Creating admin_users table...')
          await supabaseAdmin.from('admin_users').insert({
            id: user.id,
            email: user.email || '',
            is_super_admin: true
          }).select()
        } else {
          console.error('Error creating admin record:', adminError)
          if (!existingAdmin) {
            // Only try to clean up if we created the user in this run
            await supabaseAdmin.auth.admin.deleteUser(user.id)
          }
          throw adminError
        }
      }

      console.log('Admin record created successfully')
    } catch (error) {
      console.error('Failed to create admin record:', error)
      if (!existingAdmin) {
        // Only try to clean up if we created the user in this run
        await supabaseAdmin.auth.admin.deleteUser(user.id)
      }
      throw error
    }

    console.log('\nYou can now log in with:')
    console.log('Email: test.admin@example.com')
    console.log('Password: Admin123!@#')
  } catch (error) {
    console.error('Failed to create admin:', error)
    process.exit(1)
  }
}

createAdmin() 