import sanitizeHtml from 'sanitize-html';

export default function (html, opts) {
  if (opts) {
    return sanitizeHtml(html, opts);
  }

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'details', 'summary']),
  });
}
