const sampleDocument = {
  document_token: '1qazxsw2',
  version: 0.1,
  doc_title: 'Sample Doc',
  is_private: false,
  sections: [
    {
      section_title: 'User Section',
      pages: [
        {
          page_title: 'User Section Description',
          is_root_path: true,
          path: '/user',
          content: '<h1>This part is written by John.</h1>',
        },
        {
          page_title: 'Login',
          path: '/user/login',
          content: '<h1>Login Api</h1>',
        },
      ],
    },
    {
      section_title: 'Account Section',
      path: '/account',
      pages: [
        {
          page_title: 'Create Account',
          path: '/account/create',
          content: '<h1>Create Account Api</h1>',
        },
        {
          page_title: 'Get Account Info',
          path: '/account/info',
          content: '<h1>Get Account Info Api</h1>',
        },
      ],
    },
  ],
}

const sampleDocumentInfo = {
  document_id: 1,
  document_token: '1qazxsw2',
  version: 0.1,
  doc_title: 'Sample Doc',
  is_private: false,
  sections: [
    {
      section_id: 1,
      section_title: 'User Section',
      pages: [
        {
          page_id: 1,
          page_title: 'User Section Description',
          is_root_path: true,
          path: '/user',
        },
        {
          page_id: 2,
          page_title: 'Login',
          path: '/user/login',
        },
      ],
    },
    {
      section_title: 'Account Section',
      path: '/account',
      section_id: 2,
      pages: [
        {
          page_id: 3,
          page_title: 'Create Account',
          path: '/account/create',
        },
        {
          page_id: 4,
          page_title: 'Get Account Info',
          path: '/account/info',
        },
      ],
    },
  ],
}

const sampleApiContent = {
  title: 'Get Document Token',
  request_url: '/document/token',
  method: 'get',
  request_headers: [
    {
      name: 'Authorization',
      displayName: 'Authorization',
      type: 'string',
      required: true,
      description: 'Token fetching through Login Api',
      key: 'Authorization',
    },
  ],
  query_params: [],
  body: [],
  responses: [
    {
      key: '200',
      status: '200',
      headers: [],
      data: [
        {
          name: 'application/json',
          displayName: 'application/json',
          type: '{\n'
            + '  "type": "object",\n'
            + '  "title": "Get Document Token",\n'
            + '  "required": [\n'
            + '    "document_token"\n'
            + '  ],\n'
            + '  "properties": {\n'
            + '    "document_token": {\n'
            + '      "type": "number",\n'
            + '      "minimum": 1,\n'
            + '      "description": "auto increment document id"\n'
            + '    }\n'
            + '  }\n'
            + '}\n',
          required: true,
          key: 'application/json',
        },
      ],
    },
  ],
}

const samplePageInfo = [
  {
    page_id: 1,
    page_title: 'User Section Description',
    is_root_path: true,
    path: '/user',
    // content: '<h1>This part is written by John.</h1>',
    apiContent: sampleApiContent,
  },
  {
    page_id: 2,
    is_root_path: false,
    page_title: 'Login',
    path: '/user/login',
    content: '<h1>Login Api</h1>',
  },
  {
    page_id: 3,
    is_root_path: false,
    page_title: 'Create Account',
    path: '/account/create',
    content: '<h1>Create Account Api</h1>',
  },
  {
    page_id: 4,
    page_title: 'Get Account Info',
    is_root_path: false,
    path: '/account/info',
    content: '<h1>Get Account Info Api</h1>',
  },
]

module.exports = {
  sampleDocument,
  sampleDocumentInfo,
  samplePageInfo,
}
