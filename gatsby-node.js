const path = require(`path`)
const locales = require(`./config/i18n`)
const {
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`)

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  deletePage(page)
  Object.keys(locales).map(lang => {
    const localizedPath = locales[lang].default ? page.path : `${locales[lang].path}${page.path}`

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
    })
  })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const name = path.basename(node.fileAbsolutePath, `.mdx`)
    const isDefault = name === `index`
    const defaultKey = findKey(locales, o => o.default === true)
    const lang = isDefault ? defaultKey : name.split(`.`)[1]
    const hidden = node.frontmatter.hidden ? true : false
    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefault`, value: isDefault })
    createNodeField({ node, name: `isHidden`, value: hidden })
    createNodeField({ node, name: `dateFormat`, value: locales[lang].dateFormat })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const postTemplate = require.resolve(`./src/templates/post.js`)
  const tagTemplate = require.resolve(`./src/templates/taglist.js`)
  const result = await graphql(`
    {
      blog: allFile(filter: { sourceInstanceName: { eq: "blog" }  extension:{ eq:"mdx"} }) {
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
  `)

  if (result.errors) {
    return
  }
  var postList = result.data.blog.edges
  postList.sort(function (a, b) {
    a = new Date(a.node.childMdx.frontmatter.date);
    b = new Date(b.node.childMdx.frontmatter.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  const posts = postList
  var allTags = {
    pl: {},
    en: {}
  }
  posts.forEach(({ node: post }, index) => {
    var slug;
    var title;
    const tags = post.childMdx.frontmatter.tags
    const locale = post.childMdx.fields.locale
    const dateFormat = post.childMdx.fields.dateFormat
    const isDefault = post.childMdx.fields.isDefault
    const siteTitle = locales[locale].defaultTitle;
    tags.forEach(tag => {
      if (!allTags[locale][tag]) {
        allTags[locale][tag] = true
        slug = `/tag/${tag}/`
        title = tag
        createPage({
          path: isDefault ? slug : `/${locale}${slug}`,
          component: tagTemplate,
          context: {
            title,
            tag,
            locale,
            dateFormat,
            slug
          },
        })
      }
    })

    slug = post.relativeDirectory
    title = post.childMdx.frontmatter.title
    let _prev, _next = null;
    for (let i=index-1; i>0; --i){
      if (posts[i] && posts[i].node.childMdx.fields.locale == locale && !posts[i].node.childMdx.fields){
        _prev = {
          slug: '/' + posts[i].node.relativeDirectory,
          title: posts[i].node.childMdx.frontmatter.title
        }
        break;
      }
    }
    for (let i = index + 1; i < posts.length; ++i) {
      if (posts[i] && posts[i].node.childMdx.fields.locale == locale && !posts[i].node.childMdx.fields) {
        _next = {
          slug: '/' + posts[i].node.relativeDirectory,
          title: posts[i].node.childMdx.frontmatter.title
        }
        break;
      }
    }
    const previous = _prev;
    const next = _next;
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
        tags
      },
    })
  })
}