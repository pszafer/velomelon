import React from "react"
import SEO from "./seo"
import { isHome } from "../utils/shared"
import Redirect from "./redirect";


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
    return (
      <LocaleContext.Provider value={{ localeInfo }}>
        <SEO
          title={pageContext.title}
          description={pageContext.description}
          lang={pageContext.locale}
          keywords={[`blog`, `velomelon`, `travel`, `bicycle`]}
        />
        <Redirect localeInfo={localeInfo}>
          <div id="mainDiv" className={classes}>
            {children}
          </div>
        </Redirect>
      </LocaleContext.Provider>
    )
  }
}


export { Layout, LocaleContext }
