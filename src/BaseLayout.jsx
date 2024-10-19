import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'

const BaseLayout = () => {
  return (
    <>
        <Navbar/>
        <Home/>
    </>
  )
}

export default BaseLayout