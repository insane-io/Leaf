import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import BaseLayout from './BaseLayout';
import DashBoard from "./Pages/DashBoard"
import { UserProvider } from './Context/MyContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Places from './Pages/Places';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<BaseLayout />}>
        <Route path='' element={<Home />} />
        <Route path='dashboard' element={<DashBoard/>} />
        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />
        <Route path='place' element={<Places/>} />
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
