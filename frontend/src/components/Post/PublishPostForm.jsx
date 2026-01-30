import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Typography,
  theme,
  Upload,
  Row,
  Col,
  Popover,
  Space,
} from "antd";
import {
  UploadOutlined,
  RocketOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import ControlledInput from "../Utils/ControlledInput.jsx";
import ControlledSelect from "../Utils/ControlledSelect.jsx";
import ControlledUpload from "../Utils/ControlledUpload.jsx";
import ControlledEditor from "../Editor/ControlledEditor.jsx";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";

import postService from "../../services/postService.js";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function PublishPostForm() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [error, setError] = useState("");

  const methods = useForm();
  const { handleSubmit, control, setValue, watch } = methods;

  const slugTransform = (value) => {
    if (typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return "";
  };

  useEffect(() => {
    let subscription = watch((values, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(values.title));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const submitPost = async (data) => {
    console.log(data);
    let postFormData = new FormData();

    for (let val in data) {
      if (typeof val !== "object") {
        postFormData.append(val, data[val]);
      }
    }

    if (data.featuredImage && data.featuredImage[0]) {
      postFormData.append("featuredImage", data.featuredImage[0].originFileObj);
    }

    try {
      // const post = await postService.publishPost(postFormData);
      // console.log(post);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePostForm = () => {
    handleSubmit(submitPost)();
  };

  // Custom styling for the form container
  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  };

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: token.colorBgLayout,
        padding: "40px 0",
      }}
    >
      <Content>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ margin: 0, fontSize: "22px" }}>
              Create Your New{" "}
              <span style={{ color: token.colorPrimary }}>Post</span>
            </Title>
          </div>

          <FormProvider {...methods}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePostForm}
              requiredMark={false}
            >
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <ControlledInput name="title" label="Title" />
                </Col>

                <Col xs={24} md={12}>
                  <ControlledInput name="slug" label="Slug" readOnly />
                </Col>
              </Row>

              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <ControlledSelect
                    options={["Tech", "Story", "Education", "Business"]}
                    name="category"
                    label="Category"
                  />
                </Col>

                <Col xs={24} md={12}>
                  <ControlledUpload
                    customStyle={{ width: "100%" }}
                    name="featuredImage"
                    label={
                      <Space size="small">
                        Select an Image
                        <Popover
                          content="This field is optional"
                          trigger="hover"
                        >
                          <InfoCircleOutlined
                            style={{
                              color: token.colorPrimary,
                              cursor: "pointer",
                            }}
                          />
                        </Popover>
                      </Space>
                    }
                  />
                </Col>
              </Row>

              {/* Content Editor Section */}
              <ControlledEditor name="content" label="Write What You Think" />

              {/* Submit Button */}
              <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  icon={<RocketOutlined />}
                  block
                  style={{
                    width: "200px",
                    height: "45px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Publish
                </Button>
              </Form.Item>
            </Form>
          </FormProvider>
        </div>
      </Content>
    </Layout>
  );
}

export default PublishPostForm;
