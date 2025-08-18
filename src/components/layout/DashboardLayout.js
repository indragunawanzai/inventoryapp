import { Box } from '@mui/material'
import TopBar from './TopBar'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const DashboardLayout = () => {
    const { logout } = useContext(AuthContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <TopBar onLogout={logout} />
            <Sidebar />
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                width: 'calc(100% - 240px)',
                marginTop: '64px'
            }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default DashboardLayout