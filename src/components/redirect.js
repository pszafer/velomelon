import React, { PureComponent } from 'react'
import { withPrefix } from 'gatsby-link'
import browserLang from 'browser-lang'
import locales from "../../config/i18n"

class Redirect extends PureComponent {
    constructor(props) {
        super(props)
        const { slug, locale } = props.localeInfo
        if (typeof window !== 'undefined') {
            const detected =
                window.localStorage.getItem('language') ||
                browserLang({
                    languages: Object.keys(locales),
                    fallback: 'en',
                })
            if (!window.localStorage.getItem('language')){
                window.localStorage.setItem('language', detected)
            }
            if (detected != locale){
                const newUrl = withPrefix(`${detected === 'en' ? '' : '/' + detected+'/'}${slug}`)
                window.localStorage.setItem('language', detected)
                if (window.location.pathname != newUrl){
                    window.location.replace(newUrl)
                }
            }
        }
    }

    render() {
        return <>{this.props.children}</>
    }
}

export default Redirect
