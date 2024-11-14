const { v4: uuidv4 } = require('uuid')
const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const uploadFile = async (filePath, buffer, mimetype) => {
  const { error } = await supabase.storage.from('S2S').upload(filePath, buffer, {
    contentType: mimetype,
    upsert: true
  })
  if (error) throw new Error(error.message)
  return `${supabaseUrl}/storage/v1/object/public/S2S/${filePath}`
}

const supabaseService = {
  uploadAttachment: async (userId, attachment) => {
    const extension = attachment.originalname.split('.').pop()
    const baseName = attachment.originalname.replace(/\.[^/.]+$/, '')
    const uniqueId = uuidv4()
    const sanitizedFileName = `${baseName.replace(/\s+/g, '_').replace(/[^\w\-.]/g, '')}_${uniqueId}.${extension}`

    const filePath = `${userId}/attachments/${sanitizedFileName}`

    const url = await uploadFile(filePath, attachment.buffer, attachment.mimetype)
    return { url, extension }
  },

  uploadAvatar: async (userId, avatar) => {
    const extension = avatar.originalname.split('.').pop()
    const sanitizedFileName = `avatar_${userId}.${extension}`

    const folderPath = `${userId}/avatar/`
    const filePath = `${folderPath}${sanitizedFileName}`

    const { data: files, error: listError } = await supabase.storage.from('S2S').list(folderPath)

    if (listError) {
      throw new Error(listError.message)
    }

    if (files && files.length > 0) {
      for (const file of files) {
        await supabase.storage.from('S2S').remove([`${folderPath}${file.name}`])
      }
    }

    const url = await uploadFile(filePath, avatar.buffer, avatar.mimetype)
    return { url, extension }
  },

  removeFromStorage: async (url) => {
    const filePath = url.split('/S2S/')[1]
    const { error } = await supabase.storage.from('S2S').remove([filePath])

    if (error) {
      throw new Error(`Failed to delete file from storage: ${error.message}`)
    }
  }
}

module.exports = supabaseService
