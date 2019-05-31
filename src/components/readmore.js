import React from "react"
import LocalizedLink from "../components/localizedLink"

const Readmore = ({previous, next}) => {
    return (
        <aside className="read-next outer">
            <div className="inner">
                <div className="read-next-feed">
                    <article className="read-next-card">
                        <header className="read-next-card-header">
                            <small className="read-next-card-header-sitetitle">— Velomelon —</small>
                            <h3 className="read-next-card-header-title"><a href="/tag/getting-started/">Getting Started</a></h3>
                        </header>
                        <div className="read-next-card-content">
                            <ul>
                                {previous && (
                                    <LocalizedLink to={previous.slug} rel="prev">
                                        {previous.title}
                                    </LocalizedLink>
                                )}
                                {next && (
                                    <LocalizedLink to={next.slug} rel="prev">
                                        {next.title}
                                    </LocalizedLink>
                                )}
                            </ul>
                        </div>
                        <footer className="read-next-card-footer">
                            <a href="/tag/getting-started/">See all 6 posts →</a>
                        </footer>
                    </article>

                </div>
            </div>
        </aside>
    )

}

export default Readmore;