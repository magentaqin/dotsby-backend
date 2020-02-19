/* eslint-disable no-plusplus */

function flatHtmlString(htmlString) {
  const tagRegx = /<([^>]+)>/ig
  return htmlString ? htmlString.replace(tagRegx, '') : htmlString;
}

function extract(htmlString) {
  const titleRegx = /<h1>.*?<\/h1>/;
  const headerRegx = /<h[1-6]>.*?<\/h[1-6]>/;
  const htmlRegx = /<.*>.*?<\/.*>/g;
  const htmlSet = htmlString.match(htmlRegx);
  console.log('HTMLSET', htmlSet)
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
          if (level === 6 && model.lv0 !== current) {
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