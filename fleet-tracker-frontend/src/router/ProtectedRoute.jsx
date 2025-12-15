import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ rolesAllowed }) => {
    const { user, token } = useSelector((state) => state.auth);
    console.log("ProtectedRoute", user, token);

    
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    
    if (rolesAllowed && !rolesAllowed.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

   
    return <Outlet />;
};

export default ProtectedRoute;
