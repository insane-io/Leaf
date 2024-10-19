import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

const BaseLayout = () => {
  return (
    <>
      <Navbar />
      <div className='pt-24 mx-5'>
        <Outlet/>
      </div>
    </>
  )
}

export default BaseLayout