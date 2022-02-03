import { Link, Outlet, useLocation } from 'react-router-dom';
import React, { useState } from "react"
import { Layout, Menu } from 'antd';
import { HOME, API_KEY, METRICS } from '../constants/routes';

import "./Home.css"
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const FULL_HEIGHT = { height: "100vh" }
type Props = {
    loginElement: React.ReactElement //React.Component<React.HTMLAttributes<>
}
const Home = ({ loginElement }: Props) => {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    return (
        <Layout style={FULL_HEIGHT}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} >
                    <Menu.Item key={HOME} icon={<UserOutlined />}>
                        <Link to={HOME}>Home</Link>
                    </Menu.Item>
                    <Menu.Item key={METRICS} icon={<VideoCameraOutlined />}>
                        <Link to={METRICS}>Metrics</Link>
                    </Menu.Item>
                    <Menu.Item key={API_KEY} icon={<UploadOutlined />}>
                        <Link to={API_KEY}>Api Key</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>

                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    {loginElement}
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Home