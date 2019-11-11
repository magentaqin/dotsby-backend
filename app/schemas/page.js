const pageIdRef = '/page/page_id'

const pageIdSchema = {
  id: pageIdRef,
  type: 'number',
  minimum: 1,
  description: 'auto increment page id',
}


const getPageSchema = (config) => {
  return {
    id: config.id,
    type: 'object',
    required: config.required,
    properties: {
      page_id: {
        $ref: pageIdRef,
      },
      page_title: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        format: 'ascii_printable',
        description: 'title of page',
      },
      is_root_path: {
        type: 'boolean',
        description: 'whether this page is the index page',
      },
      path: {
        type: 'string',
        minLength: 1,
        maxLength: 32,
        format: 'ascii_printable',
        description: 'page path',
      },
      content: {
        type: 'string',
        minLength: 1,
        format: 'ascii_printable',
        description: 'page content',
      },
    },
  };
}

module.exports = {
  getPageSchema,
  pageIdRef,
  pageIdSchema,
}
