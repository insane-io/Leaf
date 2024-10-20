import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <>
      <div className=''>
        <Navbar />
        <div className=' '>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default BaseLayout