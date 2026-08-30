import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/index.js";
import { BillDetailPage, BillsPage, Login, Profile, Register, UploadPage, ErrorPage, PricingPage } from "./pages/index.js";
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <BillsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/upload",
                element: (
                    <ProtectedRoute>
                        <UploadPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/bills/:id",
                element: (
                    <ProtectedRoute>
                        <BillDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/pricing",
                element: (
                    <ProtectedRoute>
                        <PricingPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <ErrorPage />,
    }
]);

export default function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={router} />
        </>
    );
}
