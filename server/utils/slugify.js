const slugify = text =>
  text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Replace & with 'and'
    .replace(/&/g, '-and-')
    // Remove all non-word chars
    .replace(/(?!\w)[\x00-\xC0]/g, '-') // eslint-disable-line
    // Replace multiple - with single -
    .trim('-')
    .replace(/\-\-+/g, '-') // eslint-disable-line
    // Remove - from start & end
    .replace(/-$/, '')
    .replace(/^-/, '');

function createUniqueSlug(Model, slug, count) {
  return Model.findOne({ slug: `${slug}-${count}` }, 'id').then((user) => {
    if (!user) {
      return Promise.resolve(`${slug}-${count}`);
    }

    return createUniqueSlug(Model, slug, count + 1);
  });
}

export default function generateSlug(Model, name, filter = {}) {
  const origSlug = slugify(name);

  return Model.findOne(Object.assign({ slug: origSlug }, filter), 'id').then((user) => {
    if (!user) {
      return Promise.resolve(origSlug);
    }

    return createUniqueSlug(Model, origSlug, 1);
  });
}
