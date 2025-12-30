function Button({ children, className, type = "button", ...rest }) {
  return (
    <button className={className} type={type} {...rest}>
      {children}
    </button>
  );
}

export default Button;
