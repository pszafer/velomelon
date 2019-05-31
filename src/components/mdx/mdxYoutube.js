import React from "react"

// Only use <LocalizedLink /> for internal links
const MdxYoutube = ({ children }) =>(
        <div style={{
            position:"relative",
            height:0,
            width: "90%",
            overflow:"hidden",
            maxWidth:"100%",
            paddingBottom:"56.25%"}}>
        <iframe src={`https://www.youtube.com/embed/${children}`}
                style={{
                    position:"absolute",
                    top:0,
                    left:0,
                    width:"100%",
                    height:"100%"
                }}
            frameBorder="0"
                ></iframe>
            </div>)

export default MdxYoutube;