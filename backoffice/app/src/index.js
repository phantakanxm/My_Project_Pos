import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ReportMember from "./pages/ReportMember";
import ReportChangePackage from "./pages/ReportChangePackage";
import ReportSumSalePerDay from "./pages/ReportSumSalePerDay";
import ReportSumSalePerMonth from "./pages/ReportSumSalePerMonth";
import ReportSumSalePerYear from "./pages/ReportSumSalePerYear";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/reportMember",
    element: <ReportMember />,
  },
  {
    path: "/reportChangePackage",
    element: <ReportChangePackage />,
  },
  {
    path: "/reportSumSalePerDay",
    element: <ReportSumSalePerDay />,
  },
  {
    path: "/reportSumSalePerMonth",
    element: <ReportSumSalePerMonth />,
  },
  {
    path: "/reportSumSalePerYear",
    element: <ReportSumSalePerYear />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

reportWebVitals();
