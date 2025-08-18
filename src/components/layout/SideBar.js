// src/components/layout/Sidebar.js
import React from 'react';
import {
    Drawer, List, ListItem, ListItemIcon,
    ListItemText, Divider, Toolbar, Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Input as InputIcon,
    Output as OutputIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const drawerWidth = 240;

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Stok Barang', icon: <InventoryIcon />, path: '/stock' },
        { text: 'Barang Masuk', icon: <InputIcon />, path: '/incoming' },
        { text: 'Barang Keluar', icon: <OutputIcon />, path: '/outgoing' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1e293b',
                    color: 'white',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                '&.active': {
                                    backgroundColor: '#334155',
                                    borderLeft: '4px solid #1976d2',
                                },
                                '&:hover': {
                                    backgroundColor: '#334155',
                                },
                                py: 1.5,
                                pl: 3,
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'whitesmoke' }} primary={item.text} />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ bgcolor: '#334155', my: 1 }} />
            </Box>
        </Drawer>
    );
};

export default Sidebar;