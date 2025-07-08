import React, { useContext } from 'react';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider } from './Contexts/ContextAuth';
import { UserProvider } from './Contexts/ContextUser';
import { LoadingProvider } from './Contexts/ContextLoading';
import { BannerProvider } from './Contexts/ContextBanner';

import LoadingContext from './Contexts/ContextLoading';
import BannerContext from './Contexts/ContextBanner';
import AuthCheck from './Components/AuthCheck';
import CreateApplication from './Pages/ApplicationCreation';
import Dashboard from './Pages/DashBoard';
import ResumeJobInput from './Pages/ResumeUpload';
import Login from './Pages/Login';
import ApplicationsPage from './Pages/ApplicationsPage';
import Signup from './Pages/Signup';
import AppLayout from './Components/Layout';
import Loader from './Components/LoadingScreen';
import ConfirmBanner from './Alerts/Confirmation';
import MessageBanner from './Alerts/Message';
import SingleApplication from './Pages/SingleApplicationPage';
import About from './Pages/AboutPage';
import LandingPage from './Pages/LandingPage';


const AppRoutes = () => {
  const { isLoading } = useContext(LoadingContext);
  const { showBanner, bannerType } = useContext(BannerContext);

  return (
    <>
      {isLoading && <Loader />}
      {showBanner && bannerType === 'confirm' && <ConfirmBanner />}
      {showBanner && bannerType === 'alert' && <MessageBanner />}
      <RouterProvider router={router} />
    </>
  );
};

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <h3>Page Not Found</h3>,
    children: [
      { path : '/', element: <LandingPage /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'about', element: <About /> }, 
      {
        element: (
          <AuthCheck>
            <Outlet />
          </AuthCheck>
        ),
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'input-resume', element: <ResumeJobInput /> },
          { path: 'applications', element: <ApplicationsPage /> },
          { path: 'add-application', element: <CreateApplication /> },
          { path: 'application/:id', element: <SingleApplication /> }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <LoadingProvider>
          <BannerProvider>
            <AppRoutes />
          </BannerProvider>
        </LoadingProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
