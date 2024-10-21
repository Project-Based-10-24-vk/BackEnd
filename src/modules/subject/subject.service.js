const Subject = require('./subject.model')

const subjectService = {
  getSubjects: async () => {
    const items = await Subject.find()
    return { items }
  },

  getSubjectById: async (id) => {
    const subject = await Subject.findById(id)
    return subject
  },

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

  getSubjectsByCategoryId: async (categoryId) => {
    const subjects = await Subject.find({ category: categoryId })
    return subjects
  },
}

module.exports = subjectService

