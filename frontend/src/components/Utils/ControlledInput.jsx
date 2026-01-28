import { useFormContext, Controller } from "react-hook-form";
import { Input, Form } from "antd";

function ControlledInput({ name, label, placeholder = "", ...rest }) {
  const { control } = useFormContext();

  return (
    <Form.Item label={label} name={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input {...field} size="middle" placeholder={placeholder} {...rest} />
        )}
      />
    </Form.Item>
  );
}

export default ControlledInput;
