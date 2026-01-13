import PostEditor from "./Editor/PostEditor.jsx";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Typography,
  theme,
  Upload,
  Flex,
} from "antd";
import { UploadOutlined, RocketOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function AddPost({ post }) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Post Data:", values);
    // Handle submission logic here
  };

  // Custom styling for the form container
  const containerStyle = {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px",
    background: "#ffffff1e",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: token.colorBgLayout,
        padding: "40px 0",
      }}
    >
      <Content>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ margin: 0, fontSize: "22px" }}>
              Create &nbsp; Your &nbsp; New &nbsp;{" "}
              <span style={{ color: token.colorPrimary }}>Post</span>
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <Form.Item
                label="Post Title"
                name="title"
                rules={[{ required: true, message: "Please enter a title" }]}
                style={{ flex: "1" }}
              >
                <Input size="middle" />
              </Form.Item>

              <Form.Item
                label="Slug"
                name="slug"
                rules={[{ required: true, message: "Please enter a slug" }]}
                style={{ flex: "1" }}
              >
                <Input size="middle" />
              </Form.Item>
            </div>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
              style={{ flex: "1 1 45%" }}
            >
              <Select placeholder="Select a category" size="middle">
                <Option value="tech">Tech</Option>
                <Option value="innovation">Innovation</Option>
                <Option value="story">Story</Option>
                <Option value="creative idea">Creative Idea</Option>
              </Select>
            </Form.Item>

            
            <Form.Item
              label="Select an Image"
              name="featuredImage"
              style={{ flex: "1 1 45%" }}
            >
              <Upload
                beforeUpload={() => false} 
                maxCount={1}
                listType="picture"
              >
                <Button
                  icon={<UploadOutlined />}
                  size="middle"
                  style={{ width: "100%" }}
                >
                  Choose File
                </Button>
              </Upload>
            </Form.Item>

            {/* Content Editor Section */}
            <Form.Item
              label="Content"
              name="content"
              style={{ marginBottom: 32 }}
            >
              <div
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Your custom TinyMCE Editor component */}
                <PostEditor />
              </div>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                icon={<RocketOutlined />}
                block
                style={{
                  height: "45px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Publish Post
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default AddPost;
