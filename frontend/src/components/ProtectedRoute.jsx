import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Adjust path to your AuthContext

export default function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useAuth();

    // 1. If the app is still checking the session, show nothing or a loader
    if (loading) return <div className="min-h-screen bg-[#0f172a]" />;

    // 2. If no user is logged in, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If the user's role doesn't match (e.g., a customer trying to enter /admin)
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    // 4. Everything is fine, show the page
    return children;
}