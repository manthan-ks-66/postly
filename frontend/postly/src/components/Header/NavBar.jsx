import Logo from "../Logo/Logo.jsx";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Space,
  Avatar,
  Drawer,
  Grid,
} from "antd";
import {
  UserOutlined,
  MenuOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import authService from "../../services/authService.js";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNotify } from "../../context/NotificationProvider.jsx";

const { Header } = Layout;
const { useBreakpoint } = Grid;

function NavBar() {
  const notify = useNotify();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Desktop view is true if screen size is MD or larger
  const isDesktop = screens.md;

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const logoutUser = async () => {
    authService
      .logoutUser()
      .then(() => {
        dispatch(logout());

        notify.api.success({
          title: "Logged out successfully",
          placement: "top",
        });

        navigate("/");
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  // Content for Login/Register buttons
  const AuthButtons = (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      <Link to="/login" onClick={() => setDrawerVisible(false)}>
        <Button block={!isDesktop}>Login</Button>
      </Link>
      <Link to="/register" onClick={() => setDrawerVisible(false)}>
        <Button block={!isDesktop}>Register</Button>
      </Link>
    </div>
  );

  const navItems = [
    {
      label: "Home",
      key: "/",
    },
    {
      label: "About",
      key: "/about",
    },
    {
      label: "Explore",
      key: "/explore-posts?page=1&limit=5",
    },
    {
      label: "Write",
      key: "/post/new/write",
    },
  ];

  const userItems = [
    {
      label: "Profile",
      key: "/user-profile",
      icon: <UserOutlined />,
    },
    {
      label: "Settings",
      key: "/user-settings",
      icon: <SettingOutlined />,
    },
    {
      label: "Logout",
      key: "/logout",
      danger: true,
      icon: <PoweroffOutlined />,
      onClick: logoutUser,
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: user ? "center" : "space-between",
          position: "relative",
        }}
      >
        {/* 1. MOBILE HAMBURGER for mobile screen view */}
        {!isDesktop && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "20px" }} />}
            onClick={toggleDrawer}
            style={{ position: "absolute", left: 10 }}
          />
        )}

        {/* 2. LOGO 
            - Desktop Auth: Center
            - Desktop Unauth: Left
            - Mobile: Right (Unauth) or Center (Auth)
        */}
        <div
          className="demo-logo"
          style={{
            flex: user && isDesktop ? 0 : isDesktop ? 0 : 1,
            textAlign: !isDesktop && !user ? "right" : "center",
            order: isDesktop ? 0 : 2,
          }}
        >
          <Logo />
        </div>

        {/* 3. DESKTOP MENU (Center) - Only shows if Desktop */}
        {isDesktop && (
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={navItems}
            style={{
              flex: 1,
              visibility: user ? "visible" : "visible",
              justifyContent: "center",
              minWidth: 0,
            }}
            onClick={({ key }) => navigate(key)}
          />
        )}

        {/* 4. RIGHT SECTION (Avatar or Auth Buttons) */}
        <div
          style={{
            order: 3,
            display: "flex",
            alignItems: "center",
            position: !isDesktop ? "absolute" : "static",
            right: !isDesktop ? 20 : "auto",
          }}
        >
          {user ? (
            <Dropdown menu={{ items: userItems }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={user?.avatar} size={45} icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          ) : (
            isDesktop && (
              <Space>
                <Link to="/auth/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button type="primary">Register</Button>
                </Link>
              </Space>
            )
          )}
        </div>

        {/* MOBILE DRAWER */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="vertical"
            items={navItems}
            onClick={({ key }) => {
              navigate(key);
              setDrawerVisible(false);
            }}
          />
          {!user && (
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Link to="/auth/login" onClick={toggleDrawer}>
                <Button block>Login</Button>
              </Link>
              <Link to="/auth/register" onClick={toggleDrawer}>
                <Button type="primary" block>
                  Register
                </Button>
              </Link>
            </div>
          )}
        </Drawer>
      </Header>
    </Layout>
  );
}

export default NavBar;
