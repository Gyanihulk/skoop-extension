import React from 'react'

const Loader = (props) => {
  return (
    <div className="text-center">
      <h4>{props.title}</h4>
      <div className="sbl-circ-ripple"></div>
    </div>
  )
}

export default Loader
