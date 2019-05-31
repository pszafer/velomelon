import React from "react"
import Link from "../utils/link"
import LocalizedLink from "./localizedLink"
import { StaticQuery, graphql } from "gatsby"
import { LocaleContext } from "./layout"
import useTranslations from "./useTranslations"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'
import Us from "./flags/us"


function Header({title, description }) {
  const { localeInfo } = React.useContext(LocaleContext)
  if (localeInfo.slug == '/') {
    return (
      <BackgroundHeader
        className="site-header outer responsive-header-img">
        <div className="inner">
          <div className="site-header-content">
            <h1 className="site-title">
              <span className="site-title-text">{title}</span>
              <Logo className="site-logo" alt={title} logo="svg" />
            </h1>
            <h2 className="site-description">{description}</h2>
          </div>
          <Nav
            isHome={true}
            title={title} />
        </div>
      </BackgroundHeader>
    )
  }
  return (
    <header
      className="site-header outer">
      <div className="inner">
        <div className="site-header-content">
        </div>
        <Nav 
          isHome={false}
          title={title}/>
      </div>
    </header>
  )
  
}

const BackgroundHeader = ({ children, className }) => (
  <StaticQuery query={headerQuery}
    render={data => {
      return (
        <BackgroundImage Tag="header"
          className={className}
          title=""
          fluid={data.background.childImageSharp.fluid}
          style={{}}
        >
          {children}
        </BackgroundImage>
      )
    }
    }
  />
)

function Nav( {isHome, title }) {
  const { backToHome, polish, english, aboutUs } = useTranslations()
  const { localeInfo } = React.useContext(LocaleContext)
  const lang = localeInfo.locale
  let logo = isHome ? "" : (<Logo className="site-nav-logo" alt={title} logo="600" />)
  return(<nav className="site-nav">
          <div className="site-nav-left">
            <LocalizedLink to="/" aria-label={backToHome}>
              {logo} 
            </LocalizedLink>
            <ul className="nav" role="menu">
              <li className="nav-home nav-current" role="menuitem">
                
              </li>
              <li className="nav-about" role="menuitem"><a href="https://demo.ghost.io/about/">{aboutUs}</a></li>
              <li className="nav-getting-started" role="menuitem"><a href="https://demo.ghost.io/tag/getting-started/">Getting Started</a></li>
              <li className="nav-try-ghost" role="menuitem">
               
              </li>
              <li className="nav-try-ghost" role="menuitem">
                
              </li>
            </ul>
          </div>
          <div className="site-nav-right">
      <ul className="nav lang">
            <li>
      
       <Flag
          country="en"
          text={english}
          lang={lang}
              to={'/' + localeInfo.slug} />
        </li>
        <li>
        <Flag
          country="pl"
          text={polish}
          lang={lang}
              to={'/pl/' + localeInfo.slug} />
            </li>
      </ul>
          </div>
        </nav>)
}

const Logo = ({ className, alt, logo }) => (
  <StaticQuery query={headerQuery}
    render={data => {
      if (logo =="svg"){
        return (
        <img className={className} src={data.logo.publicURL} alt={alt} />
        )
       }
      else {
        return (
          <div className={className}>
            <Img fluid={data.logo600.childImageSharp.fluid} />
          </div>
        )
      }
    }
    }
  />
)
    
const Flag = ({country, text, lang, to }) => (
  <StaticQuery query={headerQuery}
      render={data => {
        const flag = country == "pl" ? data.plFlag.childImageSharp.fixed : data.enFlag.childImageSharp.fixed
        const className = country == lang ? "active-lang" : "";
        return (
          <Link className={className} to={to} hrefLang={country}>
            <Img fixed={flag} alt={text}/>
          </Link>
        )
      }
      }
    />
)
    
export { Header, Logo };


const headerQuery = graphql`
  query HeaderQuery {
    logo: file(absolutePath: { regex: "/logo.svg/" }) {
      publicURL
    }
    background: file(relativePath: { eq: "background.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 4160) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
    }
    logo600: file(relativePath: { eq: "logo600.png" }) {
          childImageSharp {
            fluid(quality: 90, maxHeight: 80) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
    }
    plFlag: file(relativePath: { eq: "pl.png" }) {
          childImageSharp {
            fixed(width: 30, height: 25) {
              ...GatsbyImageSharpFixed
            }
          }
    }
    enFlag: file(relativePath: { eq: "us.png" }) {
          childImageSharp {
            fixed(width: 30, height: 25) {
              ...GatsbyImageSharpFixed
            }
          }
    }
  }
`