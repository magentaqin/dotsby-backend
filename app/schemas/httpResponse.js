const errorResponseSchema = {
  type: 'object',
  required: [
    'code',
    'message'
  ],
  properties: {
    code: {
      type: 'string',
      minLength: 1,
      format: 'ascii_printable',
      description: 'title of section',
    },
    message: {
      type: 'string',
      minLength: 1,
      format: 'ascii_printable',
      description: 'title of section'
    }
  }
}

module.exports = {
  errorResponseSchema
}
