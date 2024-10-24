const subjectService = require('./subject.service')

const subjectsFind = async (req, res) => {
  const subjects = await subjectService.getSubjects()
  res.status(200).json(subjects)
}

const subjectFindById = async (req, res) => {
  const { id } = req.params
  const subject = await subjectService.getSubjectById(id)

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(200).json(subject)
}

const subjectCreate = async (req, res) => {
  const data = req.body
  const subject = await subjectService.createSubject(data)
  res.status(201).json(subject)
}

const subjectUpdate = async (req, res) => {
  const { id } = req.params
  const subject = await subjectService.updateSubject(id, req.body)

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(200).json(subject)
}

const subjectDelete = async (req, res) => {
  const { id } = req.params
  const subject = await subjectService.deleteSubject(id)

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(204).send()
}

const subjectsFindByCategoryId = async (req, res) => {
  const { id } = req.params
  const subjects = await subjectService.getSubjectsByCategoryId(id)
  
  res.status(200).json(subjects)
}

module.exports = {
  subjectsFind,
  subjectFindById,
  subjectCreate,
  subjectUpdate,
  subjectDelete,
  subjectsFindByCategoryId,
}
