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

  getSubjectsByCategoryId: async (categoryId, sort, skip = 0, limit = 10) => {
    const items = await Subject.find({ category: categoryId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    const count = await Subject.countDocuments()
    return { count, items }
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