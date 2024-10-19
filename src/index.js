import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import BaseLayout from './BaseLayout';
import { UserProvider } from './Context/MyContext';
import Tour_guider from './Pages/Tour_guider';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<BaseLayout />}>
        <Route path='' element={<Home />} />
        <Route path='tourguider' element={<Tour_guider />} />
        
        
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
