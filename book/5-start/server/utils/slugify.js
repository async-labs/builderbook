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

async function createUniqueSlug(Model, slug, count) {
  const user = await Model.findOne({ slug: `${slug}-${count}` }, 'id');

  if (!user) {
    return `${slug}-${count}`;
  }

  return createUniqueSlug(Model, slug, count + 1);
}

export default async function generateSlug(Model, name, filter = {}) {
  const origSlug = slugify(name);

  const user = await Model.findOne(Object.assign({ slug: origSlug }, filter), 'id');

  if (!user) {
    return origSlug;
  }

  return createUniqueSlug(Model, origSlug, 1);
}
