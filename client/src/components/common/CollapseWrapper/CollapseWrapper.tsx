import { useState, type ReactNode } from "react";
import style from "./CollapseWrapper.module.css";
import icon_arrow from "@/assets/icons/arrow.png";

type CollapseWrapperProps = {
  title: string;
  defaultCollapsed?: boolean;
  type?: string;
  children: ReactNode;
};

const CollapseWrapper: React.FC<CollapseWrapperProps> = ({
  title,
  defaultCollapsed = false,
  type = "default",
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${style["collapse-wrapper"]} ${style["wrapper-" + type]}`}>
      <div className={style["collapse-header"]}>
        <h3>{title}</h3>
        <button onClick={handleToggle} aria-label="Toggle collapse">
          <img
            src={icon_arrow}
            alt="Toggle collapse"
            style={{
              transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
      </div>

      <div
        className={style["collapse-content"]}
        style={{
          maxHeight: isCollapsed ? "0px" : "1000px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapseWrapper;
