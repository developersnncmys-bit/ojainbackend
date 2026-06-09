import * as factory from '../utils/handlerFactory.js'
import Customer from '../models/Customer.js'

export const getCustomers = factory.getAll(Customer, { searchFields: ['name', 'email', 'city'] })
export const getCustomer = factory.getOne(Customer, 'Customer')
export const createCustomer = factory.createOne(Customer)
export const updateCustomer = factory.updateOne(Customer, 'Customer')
export const deleteCustomer = factory.deleteOne(Customer, 'Customer')
