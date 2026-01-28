import { useFormContext, Controller } from "react-hook-form";
import { Upload, Form, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function ControlledUpload({ name, label, customStyle }) {
  const { control } = useFormContext();
  return (
    <Form.Item style={customStyle} label={label} name={name}>
      <Controller
        name="featuredImage"
        control={control}
        render={({ field }) => (
          <Upload
            {...field}
            style={customStyle}
            fileList={field.value || []}
            onChange={({ fileList }) => field.onChange(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button style={customStyle} icon={<UploadOutlined />} size="middle">
              Choose File
            </Button>
          </Upload>
        )}
      />
    </Form.Item>
  );
}

export default ControlledUpload;
