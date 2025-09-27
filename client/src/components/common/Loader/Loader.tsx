// --- style ---
import style from "./Loader.module.css";

// --- Loader component ---
const Loader: React.FC = () => {
  return (
    <div className={style["loader-container"]}>
      <div className={style["spinner-loader"]}></div>
    </div>
  );
};

export default Loader;
