const mockedDocToPublish = {
  title: 'Sample Doc',
  sections: [
    {
      title: 'User Section',
      pages: [
        {
          title: 'User Section Description',
          is_root_path: true,
          path: '/user',
          content: '<h1>This part is written by John.</h1>',
        },
        {
          title: 'Login',
          path: '/user/login',
          content: '<h1>Login Api</h1>',
        },
      ],
    },
    {
      title: 'Account Section',
      path: '/account',
      pages: [
        {
          title: 'Create Account',
          path: '/account/create',
          content: '<h1>Create Account Api</h1>',
        },
        {
          title: 'Get Account Info',
          path: '/account/info',
          content: '<h1>Get Account Info Api</h1>',
        },
      ],
    },
  ],
};

const time = {
  created_at: '2013-02-04T18:35:24+00:00',
  updated_at: '2013-02-04T18:35:24+00:00',
}

const sampleDocumentInfo = {
  id: 1,
  document_id: '1qazxsw2',
  version: '0.1.0',
  title: 'Sample Doc',
  is_private: false,
  ...time,
  sections: [
    {
      id: 1,
      title: 'User Section',
      pages: [
        {
          id: 1,
          title: 'User Section Description',
          is_root_path: true,
          path: '/user',
          ...time,
        },
        {
          id: 2,
          title: 'Login',
          path: '/user/login',
          ...time,
        },
      ],
      ...time,
    },
    {
      title: 'Account Section',
      path: '/account',
      id: 2,
      ...time,
      pages: [
        {
          id: 3,
          title: 'Create Account',
          path: '/account/create',
          ...time,
        },
        {
          id: 4,
          title: 'Get Account Info',
          path: '/account/info',
          ...time,
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
          type: 'object',
          required: true,
          properties: [
            {
              name: 'data',
              displayName: 'data',
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
              key: 'data',
            },
          ],
          key: 'application/json',
        },
      ],
    },
    {
      key: '401',
      status: '401',
      headers: [],
      description: 'bad or expired token.\n',
      data: [
        {
          name: 'application/json',
          displayName: 'application/json',
          type: 'object',
          required: true,
          key: 'application/json',
          properties: [
            {
              name: 'data',
              displayName: 'data',
              type: 'object',
              required: true,
              properties: [
                {
                  name: 'code',
                  displayName: 'code',
                  type: 'string',
                  required: true,
                  key: 'code',
                },
                {
                  name: 'message',
                  displayName: 'message',
                  type: 'string',
                  required: true,
                  key: 'message',
                },
              ],
              key: 'data',
            },
          ],
        },
        {
          name: 'application/json',
          displayName: 'application/json',
          type: 'object',
          required: true,
          key: 'application/json',
          properties: [
            {
              name: 'data',
              displayName: 'data',
              type: 'object',
              required: true,
              properties: [
                {
                  name: 'code',
                  displayName: 'code',
                  type: 'string',
                  required: true,
                  key: 'code',
                },
                {
                  name: 'message',
                  displayName: 'message',
                  type: 'string',
                  required: true,
                  key: 'message',
                },
              ],
              key: 'dataw',
            },
          ],
        },
      ],
    },
  ],
}

const samplePageInfo = [
  {
    id: 1,
    title: 'User Section Description',
    is_root_path: true,
    path: '/user',
    // content: '<h1>This part is written by John.</h1>',
    apiContent: sampleApiContent,
    ...time,
  },
  {
    id: 2,
    is_root_path: false,
    title: 'Login',
    path: '/user/login',
    content: '<h1>Login Api</h1>',
    ...time,
  },
  {
    id: 3,
    is_root_path: false,
    title: 'Create Account',
    path: '/account/create',
    content: '<h1>Create Account Api</h1>',
    ...time,
  },
  {
    id: 4,
    title: 'Get Account Info',
    is_root_path: false,
    path: '/account/info',
    content: '<h1>Get Account Info Api</h1>',
    ...time,
  },
]

module.exports = {
  mockedDocToPublish,
  sampleDocumentInfo,
  samplePageInfo,
}
