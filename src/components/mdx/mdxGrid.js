import React from "react"

const MdxGrid = ({ children, ...props }) => {
  
  if (!children.props || !children.props.children) {
    console.log("GRID ERROR")
    console.log(children)
    return (<></>);
  }
  const images = React.Children.toArray(children.props.children).filter(child => {
    return child && child.$$typeof
  })
  const columns = props.columns ? props.columns : images.length < 4 ? images.length : 3;
  return (<MasonryLayout key={images.length+Math.random()*2+"-maskey"} columns={columns} gap={25}>{images}</MasonryLayout>)
  // return (<figure className="gatsbyRemarkImagesGrid"><div className="gatsbyRemarkImagesGrid-grid">{cols}</div></figure>)
}

export default MdxGrid

const MasonryLayout = props => {
  const columnWrapper = {};
  const result = [];

  // create columns
  for (let i = 0; i < props.columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  // divide children into columns
  for (let i = 0; i < props.children.length; i++) {
    const columnIndex = i % props.columns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={'masDiv1' + i} className="gatsbyRemarkImagesGrid-item">
        {props.children[i]}
      </div>
    );
  }

  // wrap children in each column with a div
  for (let i = 0; i < props.columns; i++) {
    result.push(
      <div key={'masDiv2' + i} 
        className="gatsbyRemarkImagesGrid-column"
        style={{
          flex: 1,
        }}>
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return (
    <div className="gatsbyRemarkImagesGrid" style={{ display: 'flex' }}>
      {result}
    </div>
  );
}