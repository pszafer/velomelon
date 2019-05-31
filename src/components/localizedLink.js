import React from "react"
import Link from "../utils/link"
import { LocaleContext } from "./layout"
import locales from "../../config/i18n"

// Use the globally available context to choose the right path
const LocalizedLink = ({ to, ...props }) => {
  const { localeInfo } = React.useContext(LocaleContext)
  
  const isIndex = to === `/`
  const path = locales[localeInfo.locale].default ? to : `/${locales[localeInfo.locale].path}${isIndex ? `` : `${to}`}`
  if (path){
    return <Link {...props} to={path} />
  }
  else {
    return <></>;
  }
}

export default LocalizedLink
