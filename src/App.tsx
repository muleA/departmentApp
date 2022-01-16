import './App.css'
import { Layout, Menu } from 'antd'
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom'
import Home from './Pages/home'
import Departments from './Pages/departments'
import { NotFound } from './Pages/page_not_found'
const { Header, Content, Footer } = Layout
export default function App() {
  const location = useLocation()
  return (
    <>
      <Layout className="layout">
        <Header>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={[location.pathname]}>
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/departments">
              <Link to="/departments">Departments</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Outlet />
        </Content>
        <Footer>
          <div
            className="mx-auto"
            style={{
              position: 'relative',
              padding: 0,
              left: 0,
              color: 'red',
              bottom: 0,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
            }}
          >
            <h1
              className="mx-auto"
              style={{ color: 'whitesmoke', marginTop: '0px', fontWeight: 900 }}
            >
              Department Systems &copy; {new Date().getFullYear()} created by Mulugeta{' '}
            </h1>
          </div>
        </Footer>
      </Layout>
    </>
  )
}
