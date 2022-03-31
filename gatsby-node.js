const path = require(`path`);
const locales = require(`./config/i18n`);
const {
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`);

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  deletePage(page);
  Object.keys(locales).map((lang) => {
    const localizedPath = locales[lang].default
      ? page.path
      : `${locales[lang].path}${page.path}`;
    return createPage({
      ...page,
      path: removeTrailingSlash(localizedPath),
      context: {
        locale: lang,
        slug: page.path,
        title: locales[lang].defaultTitle,
        description: locales[lang].defaultDescription,
        dateFormat: locales[lang].dateFormat,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    const name = path.basename(node.fileAbsolutePath, `.mdx`);
    const isDefault = name === `index`;
    const defaultKey = findKey(locales, (o) => o.default === true);
    const lang = isDefault ? defaultKey : name.split(`.`)[1];
    const hidden = node.frontmatter.hidden ? true : false;
    createNodeField({ node, name: `locale`, value: lang });
    createNodeField({ node, name: `isDefault`, value: isDefault });
    createNodeField({ node, name: `isHidden`, value: hidden });
    createNodeField({
      node,
      name: `dateFormat`,
      value: locales[lang].dateFormat,
    });
    createNodeField({ node, name: `dupa`, value: 'dupa blada' });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postTemplate = require.resolve(`./src/templates/post.js`);
  const tagTemplate = require.resolve(`./src/templates/taglist.js`);
  const result = await graphql(`
    {
      blog: allFile(
        filter: { sourceInstanceName: { eq: "blog" }, extension: { eq: "mdx" } }
      ) {
        edges {
          node {
            relativeDirectory
            childMdx {
              fields {
                locale
                isDefault
                isHidden
                dateFormat
              }
              frontmatter {
                title
                tags
                date
              }
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    return;
  }
  var postlist = {};
  for (let i = 0; i < result.data.blog.edges.length; ++i) {
    let lang = result.data.blog.edges[i].node.childMdx.fields.locale;
    if (!postlist[lang]) {
      postlist[lang] = [];
    }
    postlist[lang].push(result.data.blog.edges[i]);
  }

  for (let lang in postlist) {
    postlist[lang].sort(mdxSortFunction);
  }

  for (let lang in postlist) {
    createPagesPerLang(
      postlist[lang],
      lang,
      createPage,
      postTemplate,
      tagTemplate
    );
  }
};

function createPagesPerLang(
  posts,
  lang,
  createPage,
  postTemplate,
  tagTemplate
) {
  const postsPerPage = 15;
  const numPages = Math.ceil(posts.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createMainPage(
      createPage,
      locales[lang].default,
      lang,
      i,
      numPages,
      postsPerPage
    );
  });

  var allTags = {};
  posts.forEach(({ node: post }, i) => {
    var slug;
    var title;
    const tags = post.childMdx.frontmatter.tags;
    const locale = post.childMdx.fields.locale;
    const dateFormat = post.childMdx.fields.dateFormat;
    const isDefault = post.childMdx.fields.isDefault;
    const siteTitle = locales[locale].defaultTitle;
    tags.forEach((tag) => {
      if (!allTags[tag]) {
        allTags[tag] = true;
        slug = `/tag/${tag}/`;
        title = tag;
        createPage({
          path: isDefault ? slug : `/${locale}${slug}`,
          component: tagTemplate,
          context: {
            title,
            tag,
            locale,
            dateFormat,
            slug,
          },
        });
      }
    });

    slug = post.relativeDirectory;
    title = post.childMdx.frontmatter.title;
    const previous = i > 0 ? createPrevNext(posts[i - 1]) : null;
    const next = i + 1 < posts.length ? createPrevNext(posts[i + 1]) : null;
    createPage({
      path: localizedSlug({ isDefault, locale, slug }),
      component: postTemplate,
      context: {
        locale,
        title,
        dateFormat,
        previous,
        next,
        slug,
        siteTitle,
        tags,
      },
    });
  });
}

function createMainPage(
  createPage,
  isDefault,
  locale,
  i,
  numPages,
  postsPerPage
) {
  const slug = i === 0 ? '/' : `${i + 1}`;
  const path = removeTrailingSlash(localizedSlug({ isDefault, locale, slug }));
  createPage({
    path,
    component: require.resolve(`./src/templates/paging.js`),
    context: {
      limit: postsPerPage,
      title: locales[locale].defaultTitle,
      description: locales[locale].defaultDescription,
      dateFormat: locales[locale].dateFormat,
      skip: i * postsPerPage,
      slug,
      locale,
      numPages,
      currentPage: i + 1,
    },
  });
}

function mdxSortFunction(a, b) {
  a = new Date(a.node.childMdx.frontmatter.date);
  b = new Date(b.node.childMdx.frontmatter.date);
  return a > b ? -1 : a < b ? 1 : 0;
}

function createPrevNext(post) {
  return {
    slug: '/' + post.node.relativeDirectory,
    title: post.node.childMdx.frontmatter.title,
  };
}
