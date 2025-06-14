import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createFirstAdmin(email: string, password: string) {
  try {
    // 1. Create the user in auth
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) throw signUpError
    if (!user) throw new Error('No user returned from signUp')

    // 2. Add the user to admin_users table as super admin
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: user.id,
          email: user.email,
          is_super_admin: true,
        }
      ])

    if (adminError) throw adminError

    console.log('Successfully created first admin user:', email)
    return user
  } catch (error) {
    console.error('Error creating first admin:', error)
    throw error
  }
}

// Get email and password from command line arguments
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: ts-node create-first-admin.ts <email> <password>')
  process.exit(1)
}

createFirstAdmin(email, password)
  .then(() => process.exit(0))
  .catch(() => process.exit(1)) 