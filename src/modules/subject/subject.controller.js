const subjectService = require('./subject.service')

const subjectsFind = async (req, res) => {
  const response = await subjectService.getSubjects()
  res.status(200).json(response)
}

const subjectFindById = async (req, res) => {
  const { id } = req.params
  const response = await subjectService.getSubjectById(id)

  if (!response) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(200).json(response)
}

// Admin access

const subjectCreate = async (req, res) => {
  const data = req.body
  const response = await subjectService.createSubject(data)
  res.status(201).json(response)
}

const subjectUpdate = async (req, res) => {
  const { id } = req.params
  const response = await subjectService.updateSubject(id, req.body)

  if (!response) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(200).json(response)
}

const subjectDelete = async (req, res) => {
  const { id } = req.params
  const response = await subjectService.deleteSubject(id)

  if (!response) {
    return res.status(404).json({ message: 'Subject not found' })
  }

  res.status(204).send()
}

module.exports = {
  subjectsFind,
  subjectFindById,
  subjectCreate,
  subjectUpdate,
  subjectDelete,
}
