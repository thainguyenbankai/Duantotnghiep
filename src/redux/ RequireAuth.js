/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user,'ádasdadsad');
  
  return user && allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="*" replace />;
};

export default RequireAuth;
