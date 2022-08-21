import React from 'react'
import Spinner from "react-bootstrap/Spinner"

//asta este componentu loader care il vom utiliza unde avem nevoie
const LoadingBox = () => {
  return (
   <Spinner animation="border" role="status">
    <span className='visuallly-hidden'>Loading...</span>
   </Spinner>
  )
}

export default LoadingBox