import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <>
      <div className=''>
        <Navbar />
        <div className='pt-7'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default BaseLayout