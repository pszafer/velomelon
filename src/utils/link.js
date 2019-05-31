import React from 'react'
import GatsbyLink from 'gatsby-link'

const Link = (props) => {
    const isExternalLink = props.to.startsWith('http')
    if (!isExternalLink) {
        return <GatsbyLink {...props}>{props.children}</GatsbyLink>;
    }
    return (
        <a target="_blank" {...props}  rel="noopener noreferrer">{props.children}</a>
    );
}

export default Link;    