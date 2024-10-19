import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <>
      <div className=' min-h-screen'>
        <Navbar />
        <div className='pt-24 px-5 '>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default BaseLayout