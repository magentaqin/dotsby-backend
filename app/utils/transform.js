const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html')

const transformToHTML = (data) => new Promise((resolve, reject) => {
  remark()
    .use(recommended)
    .use(html)
    .process(data, (err, file) => {
      if (err) {
        reject(err);
      }
      resolve(file.contents);
    });
})

module.exports = {
  transformToHTML,
}