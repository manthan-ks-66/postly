import { Form, Select } from "antd";
import { useFormContext, Controller } from "react-hook-form";

const { Option } = Select;

function ControlledSelect({ label, name, options = [], ...rest }) {
  const { control } = useFormContext();
  return (
    <Form.Item label={label} name={name}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => field.onChange(value)}
            value={field.value}
            placeholder="Select a category"
            size="middle"
            {...rest}
          >
            {options?.map((option) => (
              <Option value={option}>{option}</Option>
            ))}
          </Select>
        )}
      />
    </Form.Item>
  );
}

export default ControlledSelect;
