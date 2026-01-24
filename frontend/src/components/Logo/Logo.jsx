import "./Logo.css";

function Logo() {
  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <img width={35} height={35} src="/logo.png" alt="logo" />
        </div>
        <h3 className="">
          Postly
        </h3>
      </div>
    </>
  );
}

export default Logo;
