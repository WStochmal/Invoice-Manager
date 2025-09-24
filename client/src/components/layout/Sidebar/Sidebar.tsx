// lib
import React from "react";

// style
import style from "./Sidebar.module.css";

// hooks
import { useNavigate } from "react-router-dom";

// icons
import { Icons } from "@/assets/icons/Icons";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className={style["sidebar"]}>
      <ul>
        <li onClick={() => navigate("/")}>Dashboard</li>
        <li onClick={() => navigate("/products")}>Products</li>
        <li onClick={() => navigate("/invoices")}>Invoices</li>
        <li onClick={() => navigate("/settings")}>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
