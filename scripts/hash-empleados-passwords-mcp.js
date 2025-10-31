const { createClient } = require("@supabase/supabase-js")
const { hash } = require("bcryptjs")

const supabaseUrl = "https://hfrwfgxldukxrjaxmwno.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcndmZ3hsZHVreHJqYXhtd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODIyOTQsImV4cCI6MjA3NjY1ODI5NH0.Tf4TL7eZuji2hTDLObgInP13JMaFwni-1GXWYTPyYRo"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function hashPasswords() {
  try {
    console.log("Obteniendo usuarios con contraseñas sin hashear...")
    
    const { data: users, error: fetchError } = await supabase
      .from("usuarios")
      .select("*")

    if (fetchError) {
      throw new Error(`Error al obtener usuarios: ${fetchError.message}`)
    }

    if (!users || users.length === 0) {
      console.log("No se encontraron usuarios")
      return
    }

    console.log(`Encontrados ${users.length} usuarios`)
    
    const usersToHash = users.filter(
      (user) => !user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")
    )

    if (usersToHash.length === 0) {
      console.log("Todas las contraseñas ya están hasheadas")
      return
    }

    console.log(`Hasheando ${usersToHash.length} contraseñas...`)

    const updates = []

    for (const user of usersToHash) {
      try {
        const hashedPassword = await hash(user.password, 10)

        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ password: hashedPassword })
          .eq("id_usuario", user.id_usuario)

        if (updateError) {
          console.error(`Error al actualizar ${user.email}: ${updateError.message}`)
          updates.push({ email: user.email, status: "error", error: updateError.message })
        } else {
          console.log(`✓ ${user.email} - Contraseña hasheada`)
          updates.push({ email: user.email, status: "success" })
        }
      } catch (error) {
        console.error(`Error al hashear contraseña de ${user.email}:`, error.message)
        updates.push({ email: user.email, status: "error", error: error.message })
      }
    }

    const successCount = updates.filter((u) => u.status === "success").length
    const errorCount = updates.filter((u) => u.status === "error").length

    console.log("\n=== Resumen ===")
    console.log(`Total procesados: ${updates.length}`)
    console.log(`Exitosos: ${successCount}`)
    console.log(`Errores: ${errorCount}`)

    if (errorCount > 0) {
      console.log("\nErrores:")
      updates
        .filter((u) => u.status === "error")
        .forEach((u) => console.log(`  - ${u.email}: ${u.error}`))
    }
  } catch (error) {
    console.error("Error general:", error.message)
    process.exit(1)
  }
}

hashPasswords()

