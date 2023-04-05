import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import useConditionalWrapper from '@/hooks/useConditionalWrapper';

const drawerWidth = 240;

function Navbar({ logout = () => {} }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const conditionalWrap = useConditionalWrapper();

  const navItems = [
    {
      text: 'Log Out',
      func: () => logout(),
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Todo App
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ text, link, func }) =>
          conditionalWrap(
            link,
            <Link href={link} key={text} />,
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={func} sx={{ textAlign: 'center' }}>
                <ListItemText primary={text} sx={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <AppBar component="nav" position="relative">
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Todo App
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map(({ text, link, func }) =>
                conditionalWrap(
                  link,
                  <Link href={link} key={text} />,
                  <Button key={text} onClick={func} sx={{ color: 'white' }}>
                    {text}
                  </Button>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </React.Fragment>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func,
};

export default Navbar;
