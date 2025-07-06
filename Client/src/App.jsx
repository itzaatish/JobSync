import React, {useContext} from 'react';
import { createBrowserRouter, RouterProvider , Outlet} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './Contexts/ContextAuth';
import { UserProvider } from './Contexts/ContextUser';

import AuthCheck from './Components/AuthCheck';

import CreateApplication from './Pages/ApplicationCreation';
import LoadingContext from './Contexts/ContextLoading';
import Dashboard from './Pages/DashBoard';
import ResumeJobInput from './Pages/ResumeUpload';
import Login from './Pages/Login';
import ApplicationsPage from './Pages/ApplicationsPage';
import Signup from './Pages/Signup';
import AppLayout from './Components/Layout';
import Loader from './Components/LoadingScreen';



const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <h3>Page Not Found</h3>,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { element : <AuthCheck><Outlet /></AuthCheck>,
        children: [
          {path : 'dashboard', element: <Dashboard />},
          {path : 'input-resume', element: <ResumeJobInput />},
          {path : 'track-applications', element: <ApplicationsPage />},
          {path : 'add-application', element: <CreateApplication />},   
        ]
      }
    ]
  }
]);

function App() {
  const {isLoading} = useContext(LoadingContext);
  return(
    <AuthProvider>
      <UserProvider>
          {isLoading && <Loader />}
          <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
