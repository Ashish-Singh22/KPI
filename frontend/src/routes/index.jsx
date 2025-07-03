import React from "react";
import { createBrowserRouter  } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Dn from "../pages/Dn";
import Dpmo from "../pages/Dpmo";
import { Upload } from "lucide-react";
import Worker from "../pages/Worker";
import UploadPage from "../pages/Upload";
import Inventory from "../pages/Inventory";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {
                path: "",
                element: <Home/>
            },
            {
                path: "/dn",
                element: <Dn/>
            },
            {
                path: "/dpmo",
                element: <Dpmo/>
            },
           {
                path: "/inventory",
                element: <Inventory/>
            },
            {
                path: "/worker",
                element: <Worker/>
            },
            {
                path: "/upload",
                element: <UploadPage/>
            },
        ] 
    }
])

export default router;