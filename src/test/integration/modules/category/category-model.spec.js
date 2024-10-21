const mongoose = require('mongoose')
const Category = require('~/modules/category/category.model')

describe('Category Model Test', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  it('should create & save category successfully', async () => {
    const validCategory = new Category({
      name: 'testcategory',
      appearance: {
        icon: 'mocked-path-to-icon',
        color: '#66C42C'
      }
    })
    const savedCategory = await validCategory.save()
    expect(savedCategory._id).toBeDefined()
    expect(savedCategory.name).toBe('testcategory')
    expect(savedCategory.appearance.icon).toBe('mocked-path-to-icon')
    expect(savedCategory.appearance.color).toBe('#66c42c')
  })

  it('should fail to create category without required fields', async () => {
    const categoryWithoutRequiredField = new Category({ name: '' })
    let err
    try {
      await categoryWithoutRequiredField.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.name).toBeDefined()
  })

  it('should fail to create category with invalid color format', async () => {
    const categoryWithInvalidColor = new Category({
      name: 'testcategory',
      appearance: {
        icon: 'mocked-path-to-icon',
        color: 'invalid-color'
      }
    })
    let err
    try {
      await categoryWithInvalidColor.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors['appearance.color']).toBeDefined()
    expect(err.errors['appearance.color'].message).toBe('Color must be in hex format')
  })

  it('should convert name to lowercase', async () => {
    const categoryWithUppercaseName = new Category({
      name: 'TestCategory',
      appearance: {
        icon: 'mocked-path-to-icon',
        color: '#66C42C'
      }
    })
    const savedCategory = await categoryWithUppercaseName.save()
    expect(savedCategory.name).toBe('testcategory')
  })

  it('should convert color to lowercase', async () => {
    const categoryWithUppercaseColor = new Category({
      name: 'testcategory',
      appearance: {
        icon: 'mocked-path-to-icon',
        color: '#66C42C'
      }
    })
    const savedCategory = await categoryWithUppercaseColor.save()
    expect(savedCategory.appearance.color).toBe('#66c42c')
  })
})
