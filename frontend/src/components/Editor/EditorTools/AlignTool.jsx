import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { Dropdown, Space } from "antd";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  DownOutlined,
  MenuOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import "../Editor.css";

const alignmentOptions = [
  {
    label: "Left",
    key: "left",
    icon: <AlignLeftOutlined />,
  },
  {
    label: "Center",
    key: "center",
    icon: <AlignCenterOutlined />,
  },
  {
    label: "Right",
    key: "right",
    icon: <AlignRightOutlined />,
  },
  {
    label: "Justify",
    key: "justify",
    icon: <MenuOutlined />,
  },
];

function AlignTool({ editor }) {
  const alignmentItems = alignmentOptions.map((item) => ({
    ...item,
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, item.key),
  }));

  return (
    <div className="tool">
      <Dropdown menu={{ items: alignmentItems }}>
        <Space>
          <MenuOutlined />
          Align
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  );
}

export default AlignTool;
