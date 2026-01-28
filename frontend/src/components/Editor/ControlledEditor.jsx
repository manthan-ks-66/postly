import { Editor } from "@tinymce/tinymce-react";
import { Form } from "antd";
import { useFormContext, Controller } from "react-hook-form";

function ControlledEditor({ name, label, defaultValue = "" }) {
  const { control } = useFormContext();
  return (
    <Form.Item name={name} label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Editor
            apiKey={import.meta.env.VITE_EDITOR_API_KEY}
            init={{
              width: "100%",
              height: 600,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              content_css: "dark",
              skin: "oxide-dark",
            }}
            initialValue={defaultValue}
            onEditorChange={field.onChange}
          />
        )}
      />
    </Form.Item>
  );
}

export default ControlledEditor;
