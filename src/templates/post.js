import React from "react"
import { graphql } from "gatsby"
import MDXRenderer from "gatsby-mdx/mdx-renderer"
import { MDXProvider } from '@mdx-js/react'
import { Header } from "../components/header"
import BackgroundImage from 'gatsby-background-image'
import MdxLink from "../components/mdx/mdxLink"
import MdxYoutube from "../components/mdx/mdxYoutube"
import MdxMap from "../components/mdx/mdxMap"
import MdxSphere from "../components/mdx/mdxSphere"
import Readmore from '../components/readmore'
import ReadProgressLine from '../components/progress'
import Img from 'gatsby-image'

class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    const { data: { mdx }, pageContext } = this.props;
    const components = {
      a: ({ children, ...props }) => {
        // if (props.className == "gatsby-resp-image-link"){
        //   return <MdxImg>{children}</MdxImg>
        // }
        return <MdxLink {...props} />
      },
      gpx: ({ children }) => {
        return <MdxMap url={this.props.location.href} >{children}</MdxMap>
      },
      sphere: ({ children }) => {
        return <MdxSphere url={this.props.location.href} >{children}</MdxSphere>
      },
      youtube: MdxYoutube,
      wrapper: ({ children, ...props }) => {
        return <>{children}</>
      }
      // img: MdxImg
      // ".gatsby-resp-image-wrapper": MdxImg
      // span: MdxImg
    }
    return (
      <div className="site-wrapper">
        <Header
          title={pageContext.title}
          description={pageContext.description}
        />
        <main className="site-main outer">
          <BackgroundImage Tag="div"
            className="site-cover"
            title=""
            fluid={mdx.frontmatter.caption.childImageSharp.fluid}
            style={{
              // Defaults are overwrite-able by setting one or each of the following:
              width: '100%',
              // height: '100%',
              position: 'absolute'
            }}
          />
          <div className="inner">
            <article className="post-full post">
              <header className="post-full-header">
                <section className="post-full-meta">
                  <time className="post-full-meta-date" dateTime={mdx.frontmatter.dateShort}>{mdx.frontmatter.dateFull}</time>
                  <span className="date-divider">/</span>
                  <ul className="tags">
                    {mdx.frontmatter.tags.map(tag => (
                      <li key={tag}><a href={`/tag/${tag}`}>{tag}</a></li>
                    ))}
                  </ul>
                </section>
                <h1 className="post-full-title">{mdx.frontmatter.title}</h1>
              </header>
              <figure className="post-full-image">
                <Img fluid={mdx.frontmatter.caption.childImageSharp.fluid} />
              </figure>
              <section className="post-full-content">
                <div className="post-content">
                  <MDXProvider components={components}>
                    <MDXRenderer>
                      {mdx.code.body}
                    </MDXRenderer>
                  </MDXProvider>
                </div>
              </section>
            </article>
          </div>
        </main>
        <Readmore
          previous={pageContext.previous}
          next={pageContext.next} />
        <ReadProgressLine 
          {...this.props}/>
      </div>
    )
  }
}

export default Post
// export default withMDXScope(Post);


export const query = graphql`
  query Post($locale: String!, $title: String!,  $dateFormat: String!) {
    mdx(
      frontmatter: { title: { eq: $title } }
      fields: {
        locale: { eq: $locale } 
    }
    ) {
      frontmatter {
        title
        tags
        dateFull: date(formatString: "DD MMMM YYYY", , locale: $locale)
        dateShort: date(formatString: $dateFormat, , locale: $locale)
        caption {
              childImageSharp {
                fluid(quality: 90, maxWidth: 1920) {
                 ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
      }
      code {
        body
      }
    }
  }
`
