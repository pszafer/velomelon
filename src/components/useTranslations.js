import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { LocaleContext } from "./layout"

function useTranslations() {
  const { localeInfo } = React.useContext(LocaleContext)
  const { rawData } = useStaticQuery(query)

  var translations = {}
  rawData.edges.forEach(item => {
    item.node[localeInfo.locale].forEach(line =>{
      translations[line.text] = line.translation
    })
  })
  return translations
}

export default useTranslations

const query = graphql`
  query useTranslations {
    rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) {
      edges {
        node {
          en: childrenEnJson {
            text
            translation
          }
          pl: childrenPlJson {
            text
            translation
          }
        }
      }
    }
  }
`
