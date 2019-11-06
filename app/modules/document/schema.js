const { Validator } = require('jsonschema');

const v = new Validator();

const createDocumentQuerySchema = {
  "type": "object",
  "required": [
    "document_token",
    "version",
    "doc_title",
    "sections"
  ],
  "properties": {
    "document_token": {
      "type": "string",
      "minLength": 1,
      "maxLength": 32,
      "format": "ascii_printable",
      "description": "auto generated document_token"
    },
    "version": {
      "type": "number",
      "minimum": 0,
      "description": "version of document"
    },
    "doc_title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "format": "ascii_printable",
      "description": "title of document"
    },
    "sections": {
      "type": "array",
      "description": "sections of document",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "section_title",
          "pages"
        ],
        "properties": {
          "section_title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 50,
            "format": "ascii_printable",
            "description": "title of section"
          },
          "pages": {
            "type": "array",
            "description": "pages of section",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": [
                "page_title",
                "path",
                "content"
              ],
              "properties": {
                "page_title": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 50,
                  "format": "ascii_printable",
                  "description": "title of page"
                },
                "is_root_path": {
                  "type": "boolean",
                  "description": "whether this page is the index page"
                },
                "path": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 32,
                  "format": "ascii_printable",
                  "description": "page path"
                },
                "content": {
                  "type": "string",
                  "minLength": 1,
                  "format": "ascii_printable",
                  "description": "page content"
                }
              }
            }
          }
        }
      }
    }
  }
}


const errors = v.validate(sampleDocument, createDocumentQuerySchema)
console.log(errors)
