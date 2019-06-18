import React from "react"
import Link from "../utils/link"
import LocalizedLink from "./localizedLink"
import { useStaticQuery, graphql } from "gatsby"
import { LocaleContext } from "./layout"
import useTranslations from "./useTranslations"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'
import { IoIosHome, IoMdGlobe, IoMdGrid } from 'react-icons/io'
import { FaFacebook } from "react-icons/fa"


function Header({title, description }) {
  const { localeInfo } = React.useContext(LocaleContext)
  const data = headerData()
  if (localeInfo.slug == '/') {
    return (
      <BackgroundHeader
        className="site-header outer responsive-header-img"
        background={data.background.childImageSharp.fluid}>
        <div className="inner">
          <div className="site-header-content">
            <h1 className="site-title">
              <span className="site-title-text">{title}</span>
              <Logo className="site-logo" alt={title} logoType="svg" logo={data.logo.publicURL} />
            </h1>
            <h2 className="site-description">{description}</h2>
          </div>
          <Nav
            isHome={true}
            title={title}
            headerData={data} />
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
          title={title}
          headerData={data}/>
      </div>
    </header>
  )
  
}

const BackgroundHeader = ({ children, className, background }) => {
  return (
    <BackgroundImage Tag="header"
      className={className}
      title=""
      fluid={background}
      style={{}}
    >
      {children}
    </BackgroundImage>)
}

function Nav( {isHome, title, headerData }) {
  const { home, polish, english, map, map_description, tags } = useTranslations()
  const { localeInfo } = React.useContext(LocaleContext)
  const lang = localeInfo.locale
  let logo = isHome ? "" : (<Logo className="site-nav-logo" alt={title} logoType="fluid" logo={headerData.logo600.childImageSharp.fluid} />)
  const menuData = [
    { to: '/', alt: home, text: home, icon: <IoIosHome /> },
    { to: 'america-map', alt: map_description, text: map, icon: <IoMdGlobe /> },
    { to: 'tags', alt: tags, text: tags, icon: <IoMdGrid /> }
  ]
  return(<nav className="site-nav">
          <div className="site-nav-left">
            <LocalizedLink to="/" aria-label={home}>
              {logo} 
            </LocalizedLink>
            <ul className="nav" role="menu">
              {menuData.map((item, index) => (
                <li key={item.to+index} className={"nav-item " + isCurrent(item.to, localeInfo.slug)} role="menuitem">
                  <LocalizedLink to={"/" + item.to} aria-label={item.alt} alt={item.alt}>{item.icon} {item.text}</LocalizedLink>
                </li>
              ))}
              {/* <li className={"nav-item " + isCurrent("/", localeInfo.slug)} role="menuitem">
                  <LocalizedLink to="/" aria-label={home}>{home}</LocalizedLink>
              </li>
              <li role="menuitem" className={"nav-item " + isCurrent("america-map", localeInfo.slug)}>
                  <LocalizedLink to="/america-map" aria-label={map_description} alt={map_description}>{map}</LocalizedLink>
              </li>
              <li role="menuitem" className={"nav-item " + isCurrent("tags", localeInfo.slug)}>
                <LocalizedLink to="/tags" aria-label={tags} alt={tags}>{tags}</LocalizedLink>
              </li> */}
            </ul>
          </div>
          <div className="site-nav-right">
      <ul className="nav lang">
            <li>
              <Link to="https://facebook.com/velomelon" hrefLang={lang}>
                <FaFacebook />
              </Link>
            </li>
            <li>
              <Flag country="en" text={english} lang={lang} flag={headerData.enFlag.childImageSharp.fixed} to={'/' + localeInfo.slug} />
            </li>
            <li>
              <Flag country="pl" text={polish} lang={lang} flag={headerData.plFlag.childImageSharp.fixed} to={'/pl/' + localeInfo.slug} />
            </li>
            
      </ul>
          </div>
        </nav>)
}

function isCurrent(to, current){
  current = current.replace(/\//g, '');
  to = to.replace(/\//g, '');
  console.log("sprawdzam")
  console.log(to)
  console.log(current)
  return to == current ? 'nav-current' : '';
}

const Logo = ({ className, alt, logoType, logo }) => {
  if (!logo) {
    logo = headerData().logo600.childImageSharp.fluid
  }
  if (logoType =="svg"){
    return (<img className={className} src={logo} alt={alt} />)
  } else {
    return (
      <div className={className}>
        <Img fluid={logo} />
      </div>)
  }
}
    
const Flag = ({country, text, lang, to, flag }) => {
  const className = country == lang ? "active-lang" : "";
  return (
    <Link className={className} to={to} hrefLang={country}>
      <Img fixed={flag} alt={text}/>
    </Link>)
}

export { Header, Logo };

const headerData = () => {
  const headerQuery = useStaticQuery(
    graphql`
      query {
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
  )
  return headerQuery
}