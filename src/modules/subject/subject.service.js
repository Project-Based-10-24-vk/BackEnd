const Subject = require('./subject.model')

const subjectService = {
  getSubjects: async () => {
    const items = await Subject.find().lean().exec()
    const count = await Subject.countDocuments()
    return { count, items }
  },

  getSubjectById: async (id) => {
    return await Subject.findById(id).lean().exec()
  },

  // Admin access

  createSubject: async (data) => {
    const subject = new Subject(data)
    await subject.save()
    return subject
  },

  updateSubject: async (id, data) => {
    const subject = await Subject.findByIdAndUpdate(id, data, { new: true })
    return subject
  },

  deleteSubject: async (id) => {
    const subject = await Subject.findByIdAndDelete(id)
    return subject
  },

}

module.exports = subjectService
