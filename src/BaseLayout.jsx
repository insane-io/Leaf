import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <>
      <Navbar />
      <div className='pt-24 bg-gray-100'>
        <Outlet/>
      </div>
    </>
  )
}

export default BaseLayout