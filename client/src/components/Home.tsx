import { Link, useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
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

type Props = {
    children: JSX.Element | JSX.Element[]
}
const Home = ({ children }: Props) => {
    const [collapsed, setCollapsed] = useState(false)
    const { authState, oktaAuth } = useOktaAuth()
    const history = useHistory();
    const button = authState?.isAuthenticated ?
        <LogoutOutlined className="logout" onClick={() => { oktaAuth.signOut() }} /> :
        <LoginOutlined className="logout" onClick={() => { history.push('/login') }} />
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <Link to='/metrics'>Metrics</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        nav 3
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
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default Home