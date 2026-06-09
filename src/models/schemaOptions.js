// Shared schema options: timestamps + clean JSON output (id instead of _id).
const transform = (doc, ret) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
  return ret
}

export const baseOptions = {
  timestamps: true,
  toJSON: { transform },
  toObject: { transform },
}
