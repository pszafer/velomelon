import React from "react"
import LocalizedLink from "../components/localizedLink"
import useTranslations from "./useTranslations"
import { Logo } from "./header"
import Img from 'gatsby-image'
import Link from "../utils/link"
import { LocaleContext } from "./layout"
import { getLocale } from "../utils/shared"
import ScrollProgress from 'scrollprogress'

export default class ReadProgressLine extends React.Component {
    constructor(props, localeInfo) {
        super(props)
        this.state = {
            progress: 0
        }
        this.vars = {
            defaultTitle: this.props.pageContext.siteTitle,
            
        }
    }

    componentDidMount() {
        this.progressObserver = new ScrollProgress((x, y) => {
            this.setState({ progress: y * 100 })
        })
    }

    componentWillUnmount() {
        this.progressObserver.destroy()
    }

    render() {
        const floatingClasses = this.state.progress > 5 ? "floating-header floating-active" : "floating-header"
        const style = {
            backgroundColor: '#0175d8',
            height: '5px',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9,
            width: `${this.state.progress}%`
        }
         return(
             <Progress
                 url={this.props.location.href}
                 pageTitle={this.props.pageContext.title}
                 siteTitle={this.props.pageContext.siteTitle}
                 floatingClasses={floatingClasses}
             ><div className="progress-bar" style={style} /></Progress>
         )
    }

   

}

const Progress = ({ url, active, siteTitle, pageTitle, children, floatingClasses}) => {
    const { backToHome, shareThis } = useTranslations()
    return (
        < div id="floating-header" className={floatingClasses} >
        <div className="floating-header-logo">
            <LocalizedLink to="/" aria-label={backToHome}>
                <Logo className="floating-header-logo" logo="600" />
                <span>{siteTitle}</span>
            </LocalizedLink>
        </div>
        <span className="floating-header-divider">—</span>
            <div className="floating-header-title">{pageTitle}</div>
        <div className="floating-header-share">
            <div className="floating-header-share-label">{shareThis}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.5 15.5V4a1.5 1.5 0 1 1 3 0v4.5h2a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1H18a1.5 1.5 0 0 1 1.5 1.5v3.099c0 .929-.13 1.854-.385 2.748L17.5 23.5h-9c-1.5-2-5.417-8.673-5.417-8.673a1.2 1.2 0 0 1 1.76-1.605L7.5 15.5zm6-6v2m-3-3.5v3.5m6-1v2"></path>
            </svg>
            </div>
                <ShareLink
                    type="twitter"
                    pageTitle={pageTitle}
                    url={url} />
                <ShareLink
                    type="facebook"
                    pageTitle={pageTitle}
                    url={url} />
        </div>
        {children}
    </div >
    )
}

// }// <a  href= onclick="window.open(this.href, 'share-twitter', 'width=550,height=235');return false;"></Link>

// export default Progress;

class ShareLink extends React.Component {

    constructor(props) {
        super();
        this.type=props.type
        if (this.type  == "twitter"){
            this.url = `https://twitter.com/share?text=${props.pageTitle}&amp;url=${props.url}`
            this.shareClass = 'share-twitter'
            this.shareWindow = 'width=550,height=235'
        }
        else if (this.type == "facebook"){
            this.url = `https://www.facebook.com/sharer/sharer.php?u=${props.url}`
            this.shareClass = 'share-facebook'
            this.shareWindow = 'width = 580, height = 296'
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        window.open(this.url, this.shareClass, this.shareWindow);
    }

    render() {
        if (this.type === "twitter"){
            return this.twitterUrl()
        }
        return this.fbUrl()
    }

    twitterUrl(){
        return (<a className="floating-header-share-tw" href={this.url} onClick={this.handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30.063 7.313c-.813 1.125-1.75 2.125-2.875 2.938v.75c0 1.563-.188 3.125-.688 4.625a15.088 15.088 0 0 1-2.063 4.438c-.875 1.438-2 2.688-3.25 3.813a15.015 15.015 0 0 1-4.625 2.563c-1.813.688-3.75 1-5.75 1-3.25 0-6.188-.875-8.875-2.625.438.063.875.125 1.375.125 2.688 0 5.063-.875 7.188-2.5-1.25 0-2.375-.375-3.375-1.125s-1.688-1.688-2.063-2.875c.438.063.813.125 1.125.125.5 0 1-.063 1.5-.25-1.313-.25-2.438-.938-3.313-1.938a5.673 5.673 0 0 1-1.313-3.688v-.063c.813.438 1.688.688 2.625.688a5.228 5.228 0 0 1-1.875-2c-.5-.875-.688-1.813-.688-2.75 0-1.063.25-2.063.75-2.938 1.438 1.75 3.188 3.188 5.25 4.25s4.313 1.688 6.688 1.813a5.579 5.579 0 0 1 1.5-5.438c1.125-1.125 2.5-1.688 4.125-1.688s3.063.625 4.188 1.813a11.48 11.48 0 0 0 3.688-1.375c-.438 1.375-1.313 2.438-2.563 3.188 1.125-.125 2.188-.438 3.313-.875z"></path></svg>
            </a>)
    }

    fbUrl() {
        return (<a className="floating-header-share-fb" href={this.url} onClick={this.handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M19 6h5V0h-5c-3.86 0-7 3.14-7 7v3H8v6h4v16h6V16h5l1-6h-6V7c0-.542.458-1 1-1z"></path></svg>
        </a>)
    }
}
