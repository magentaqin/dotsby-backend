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

/* eslint-disable no-plusplus */
const flatHtmlString = (htmlString) => {
  const tagRegx = /<([^>]+)>/ig
  return htmlString ? htmlString.replace(tagRegx, '') : htmlString;
}

const pairParagraphWithAnchor = (htmlString) => {
  const titleRegx = /<h1>.*?<\/h1>/;
  const headerRegx = /<h[1-6]>.*?<\/h[1-6]>/;
  const htmlRegx = /<.*>.*?<\/.*>/g;
  const htmlSet = htmlString.match(htmlRegx);
  const result = [];
  let i = 0;
  let j = 0;
  let k = 0;
  let previ = -2;

  // if paragraph exists.
  // set lv6-lv0/anchor) to (previ, i) header. set paragraph to (i, nextHeaderIndex).
  // set paragraph to (i, nextHeaderIndex)
  while (i < htmlSet.length) {
    const item = htmlSet[i];
    const flattenedItem = flatHtmlString(item)
    const model = {
      lv0: null,
      lv1: null,
      lv2: null,
      lv3: null,
      lv4: null,
      lv5: null,
      lv6: null,
      anchor: null,
      paragraph: '',
    };
    k = i + 1;
    if (!headerRegx.test(item)) {
      j = i - 1;
      model.paragraph += flattenedItem;
      // handle anchor header and title
      let level = 6;
      while (j > previ) {
        const current = htmlSet[j]
        const flattenedCurrent = flatHtmlString(current)
        if (headerRegx.test(current)) {
          if (titleRegx.test(current)) {
            model.lv0 = flattenedCurrent;
          } else {
            model[`lv${level}`] = flattenedCurrent;
          }
          if (level === 6 && !titleRegx.test(current)) {
            model.anchor = flattenedCurrent;
          }
        }
        level--;
        j--;
      }

      // accumulate paragraph
      while (!headerRegx.test(htmlSet[k]) && k < htmlSet.length) {
        const flattenedText = flatHtmlString(htmlSet[k])
        model.paragraph += flattenedText
        k++;
      }
      result.push(model)

      previ = i;
    }
    i = k;
  }

  // no paragraph content exists
  if (!result.length) {
    htmlSet.forEach(item => {
      const model = {
        lv0: null,
        lv1: null,
        lv2: null,
        lv3: null,
        lv4: null,
        lv5: null,
        lv6: null,
        anchor: null,
        paragraph: '',
      };
      const flattenedItem = flatHtmlString(item)
      if (titleRegx.test(item)) {
        model.lv0 = flattenedItem;
      } else {
        model.lv6 = flattenedItem;
        model.anchor = flattenedItem;
      }
      result.push(model)
    })
  }
  return result
}


module.exports = {
  extractErrMsg,
  formatTitle,
  pairParagraphWithAnchor,
}
