import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import BaseLayout from './BaseLayout';
import DashBoard from "./Pages/DashBoard"
import { UserProvider } from './Context/MyContext';
import TourGuider from './Pages/TourGuider';
import Listplace from './Pages/Listplace';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Places from './Pages/Places';
import Donations from './Pages/Donations';
import Showplace from './Pages/Showplace';
import Redeem from './Pages/Redeem';
import Calculator from './Pages/Calculator';
import Profile from './Pages/Profile';
import PlanMap from './Pages/PlanMap';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<BaseLayout />}>
        <Route path='' element={<Home />} />
        <Route path='tourguider' element={<TourGuider />} />
        <Route path='listplace' element={<Listplace />} />
        <Route path='dashboard' element={<DashBoard/>} />
        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />
        <Route path='place/:id' element={<Places/>} />
        <Route path='donations' element={<Donations/>} />
        <Route path='showplace' element={<Showplace/>} />
        <Route path='redeem' element={<Redeem/>} />
        <Route path='carbon-calculator' element={<Calculator/>} />
        <Route path='profile' element={<Profile/>} />
        <Route path='planmap' element={<PlanMap/>} />
      </Route>
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
