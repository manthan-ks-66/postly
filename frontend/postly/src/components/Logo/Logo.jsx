import "./Logo.css";

function Logo() {
  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <img className="w-10 h-7.5 rounded" src="/logo.png" alt="logo" />
        </div>
        <h3 className="brand-name  text-black dark:text-white font-bold">
          Postly
        </h3>
      </div>
    </>
  );
}

export default Logo;
