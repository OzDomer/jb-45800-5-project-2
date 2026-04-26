import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../shared/layout/Layout";
import Home from "../features/home/Home";
import Reports from "../features/reports/Reports";
import AiRecommendation from "../features/ai/AiRecommendation";
import About from "../features/about/About";
import NotFound from "../features/not-found/NotFound"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,     
    children: [
      { path: "/", element: <Navigate to="/home" replace/> },
        { path: "/home", element: <Home /> },        
      { path: "/reports", element: <Reports /> },
      { path: "/ai", element: <AiRecommendation /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default router;