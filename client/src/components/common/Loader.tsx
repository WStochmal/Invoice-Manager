import style from "./Loader.module.css";
const Loader: React.FC = () => {
  return (
    <div className={style["loader-container"]}>
      <div className={style["spinner-loader"]}></div>
    </div>
  );
};

export default Loader;
