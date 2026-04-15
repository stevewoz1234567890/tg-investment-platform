import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
// routes
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const { pathname } = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" state={{ previousPath: pathname }} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
