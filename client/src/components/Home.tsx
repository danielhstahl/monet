import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useOktaAuth } from '../okta-react/OktaContext';
import React, { useState } from "react"
import { Layout, Menu } from 'antd';
import "./Home.css"
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    LogoutOutlined,
    LoginOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const Home = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { authState, oktaAuth } = useOktaAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const button = authState?.isAuthenticated ?
        <LogoutOutlined className="logout" onClick={() => {
            oktaAuth.signOut()
            navigate('/login')
        }} /> :
        <LoginOutlined className="logout" onClick={() => { navigate('/login') }} />
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} >
                    <Menu.Item key='/' icon={<UserOutlined />}>
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key='/metrics' icon={<VideoCameraOutlined />}>
                        <Link to='/metrics'>Metrics</Link>
                    </Menu.Item>
                    <Menu.Item key='/apikey' icon={<UploadOutlined />}>
                        <Link to='/apikey'>Api Key</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>

                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    {button}
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