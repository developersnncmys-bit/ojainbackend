import * as factory from '../utils/handlerFactory.js'
import Category from '../models/Category.js'

export const getCategories = factory.getAll(Category, { searchFields: ['name', 'slug'] })
export const getCategory = factory.getOne(Category, 'Category')
export const createCategory = factory.createOne(Category)
export const updateCategory = factory.updateOne(Category, 'Category')
export const deleteCategory = factory.deleteOne(Category, 'Category')
