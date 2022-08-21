import React from 'react'

const Rating = (props) => {
    //si aici scoatem ce primim de la props(atat rating cat si num reviews)
    const {rating,numReviews}=props
  return (
    <div className='rating'>
    {/* aici avem stelele si in functie de cat este ratingu putem utiliza jumate o stea etc, importand clasele din font answome */}
    <span>
        <i className={rating>=1? "fas fa-star": rating>=0.5? "fas fa-star-half-alt": "far fa-star"}/>
    </span>
    <span>
        <i className={rating>=2? "fas fa-star": rating>=1.5? "fas fa-star-half-alt": "far fa-star"}/>
    </span>
    <span>
        <i className={rating>=3? "fas fa-star": rating>=2.5? "fas fa-star-half-alt": "far fa-star"}/>
    </span>
    <span>
        <i className={rating>=4? "fas fa-star": rating>=3.5? "fas fa-star-half-alt": "far fa-star"}/>
    </span>
    <span>
        <i className={rating>=5? "fas fa-star": rating>=4.5? "fas fa-star-half-alt": "far fa-star"}/>
    </span>
    <span>{numReviews} reviews</span>
    </div>
  )
}

export default Rating