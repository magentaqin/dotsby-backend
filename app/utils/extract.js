const extractErrMsg = (validationResult) => {
  let errMsg = 'Please pass at least one parameter.';
  const error = validationResult.errors[0]

  if (error) {
    const { message, property } = error
    errMsg = `${property} ${message}`
  }
  return errMsg;
}

const replacer = (match) => {
  const left = match.slice(0, 4);
  const right = match.slice(-5);
  const text = match.slice(4, -5);
  const id = text.toLowerCase().split(' ').join('-');
  const hashLink = `<a href="#${id}" class="hash-link">#</a>`;
  return `${left + text}<a class="anchor" id="${id}"></a>${hashLink}${right}`;
}

const formatTitle = (htmlContent) => {
  const regx = /<h[2-6]>.*?<\/h[2-6]>/g;
  return htmlContent.replace(regx, replacer);
}

module.exports = {
  extractErrMsg,
  formatTitle,
}
