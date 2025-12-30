import { forwardRef } from "react";
import "flowbite";

function Input(
  { type = "text", id, htmlFor, className, placeholder, label, ...rest },
  ref
) {
  return (
    <div className="input-container w-full">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        ref={ref}
        className={className}
        {...rest}
      />
    </div>
  );
}

export default forwardRef(Input);
