import React from 'react';
import { Roles } from '../utils/constants';
import Forbidden from './Forbiden';
// import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    requiredRole: string;
    children: React.ReactNode;
    userGroups: string[] | null;
    isLoading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredRole,
    children,
    userGroups,
    isLoading,
}) => {
    // Si se estan cargando los permisos, no renderizo nada
    if (isLoading || userGroups?.length === 0) return <></>;

    const perteneceAlRol =
        (requiredRole === Roles.OTRO && userGroups?.includes(Roles.OTRO)) ||
        (requiredRole === Roles.ADMINISTRADORES &&
            userGroups?.includes(Roles.ADMINISTRADORES));

    if (!perteneceAlRol) {
        // return <Navigate to="/" />;
        return <Forbidden />; // descomentar por Navigate si se quiere redireccionar a Home.
    }

    return <>{children}</>;
};

export default ProtectedRoute;
