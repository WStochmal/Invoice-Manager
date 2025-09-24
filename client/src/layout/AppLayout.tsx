// lib
import React from "react";

// styles
import style from "./AppLayout.module.css";

// components
import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className={style["app-layout"]}>
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
