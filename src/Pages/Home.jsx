import React, { useContext } from 'react'
import CarbonFootprintCalculator from "../Components/CarbonFootprint"
import Maps from "../Components/Maps"

const Home = () => {
  return (
    <>
      {/* <div className='grid grid-cols-3 mx-20'> */}
        {/* <div className='col-span-2'>
          <Maps/>
        </div> */}
        <div className='mx-80'>
          <CarbonFootprintCalculator />
        </div>
      {/* </div> */}
    </>

  )
}

export default Home