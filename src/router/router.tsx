import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/layout/Layout";
// import your Layout and page components

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,      // ← this is the "parent route"
    children: [
      { path: "/", element: <Home /> },           // ← children render in Layout's <Outlet />
      { path: "/reports", element: <Reports /> },
      { path: "/ai", element: <AiRecommendation /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default router;