import React from "react"
import SEO from "./seo"
import { isHome } from "../utils/shared"


const LocaleContext = React.createContext()

class Layout extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const { children, pageContext } = this.props;
    const home = isHome(pageContext.slug)
    const classes = home ? "home-template" : "post-template"
    const localeInfo = {
      locale: pageContext.locale,
      slug: pageContext.slug,
      dateFormat: pageContext.dateFormat,
      siteTitle: pageContext.title
    }
    // let title =q
    // const posts = home ? 
    return (
      <LocaleContext.Provider value={{ localeInfo }}>
        <SEO
          title={pageContext.title}
          description={pageContext.description}
          lang={pageContext.locale}
          keywords={[`blog`, `velomelon`, `travel`, `bicycle`]}
        />
        <div id="mainDiv" className={classes}>
          {children}
        </div>
      </LocaleContext.Provider>
    )
  }
}



export { Layout, LocaleContext }
