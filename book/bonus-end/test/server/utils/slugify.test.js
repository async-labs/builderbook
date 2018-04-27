import generateSlug from '../../../server/utils/slugify';

const MockUser = {
  slugs: ['john-jonhson-jr', 'john-jonhson-jr-1', 'john'],
  findOne({ slug }) {
    if (this.slugs.includes(slug)) {
      return Promise.resolve({ id: 'id' });
    }

    return Promise.resolve(null);
  },
};

describe('slugify', () => {
  test('no duplication', () => {
    expect.assertions(1);

    return generateSlug(MockUser, 'John Jonhson.').then((slug) => {
      expect(slug).toBe('john-jonhson');
    });
  });

  test('one duplication', () => {
    expect.assertions(1);

    return generateSlug(MockUser, 'John.').then((slug) => {
      expect(slug).toBe('john-1');
    });
  });

  test('multiple duplications', () => {
    expect.assertions(1);

    return generateSlug(MockUser, 'John Jonhson Jr.').then((slug) => {
      expect(slug).toBe('john-jonhson-jr-2');
    });
  });
});
