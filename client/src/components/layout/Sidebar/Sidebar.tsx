// --- lib ---
import React, { useState } from "react";

// --- style ---
import style from "./Sidebar.module.css";

// --- hooks ---
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

// --- icons ---
import icon_dashboard from "@/assets/icons/home.png";
import icon_invoices from "@/assets/icons/list.png";
import icon_invoice_form from "@/assets/icons/form.png";
import icon_arrow from "@/assets/icons/arrow.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { getText } = useTranslation();

  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuCollapsed((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className={`${style["sidebar"]} ${
        menuCollapsed ? style["collapsed-sidebar"] : ""
      }`}
    >
      <div
        className={`${style["sidebar-header"]} ${
          menuCollapsed ? style["collapsed"] : ""
        }`}
      >
        <p>Menu</p>
        <button onClick={handleToggleMenu} className={style["toggle-button"]}>
          <img
            src={icon_arrow}
            alt="Toggle Menu"
            style={{
              transform: menuCollapsed ? "rotate(-90deg)" : "rotate(90deg)",
              transition: "transform 0.3s",
            }}
          />
        </button>
      </div>
      {/* --- Menu Items --- */}
      <ul>
        <li
          title={getText("MENU_DASHBOARD")}
          onClick={() => navigate("/")}
          className={`${style[menuCollapsed ? "collapsed" : ""]} ${
            isActive("/") && location.pathname === "/" ? style["active"] : ""
          }`}
        >
          <img src={icon_dashboard} alt="Dashboard" />
          <p>{getText("MENU_DASHBOARD")}</p>
        </li>

        <li
          title={getText("MENU_INVOICES")}
          onClick={() => navigate("/invoices")}
          className={`${style[menuCollapsed ? "collapsed" : ""]} ${
            isActive("/invoices") && !isActive("/invoices/form")
              ? style["active"]
              : ""
          }`}
        >
          <img src={icon_invoices} alt="Invoices" />
          <p>{getText("MENU_INVOICES")}</p>
        </li>

        <li
          title={getText("MENU_INVOICES_FORM")}
          onClick={() => navigate("/invoices/form")}
          className={`${style[menuCollapsed ? "collapsed" : ""]} ${
            isActive("/invoices/form") ? style["active"] : ""
          }`}
        >
          <img src={icon_invoice_form} alt="Invoice Form" />
          <p>{getText("MENU_INVOICES_FORM")}</p>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
