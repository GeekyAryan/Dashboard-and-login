import * as React from 'react';
import {AppBar,Grid,Paper} from '@mui/material';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes,Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DisplayAllPatients from './DisplayAllPatients';

import Patient from './Patient';

import AdminLogin from './AdminLogin';



export default function DashBoard(props)
{
  var navigate=useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    console.info('ADMIN>>>>',admin)
    return(<div>
     <AppBar  position="static" style={{background:'#000',width:'auto'}}>
  <Toolbar variant="dense">
    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <MenuIcon style={{color:'#FFF'}} />
    </IconButton>
    <Typography variant="h6" color="inherit" component="div">
    <span style={{color:'#FFF'}}>Patient Register</span>
    </Typography>
  </Toolbar>
</AppBar>

{/* <AppBar position="static" style={{background:'#000'}}> 
      <Toolbar variant="dense">
        
        <Typography variant="h6" color="inherit" component="div">
          Super Admin
        </Typography>
      </Toolbar>
    </AppBar> */}



 {/* <Paper>
<div style={{display:'flex',flexDirection:'column'}}>
    <img src='/assets/logo.png' style={{width:80,margin:20}} />
    <Paper style={{width:250,height:60,background:'#dfe6e9',margin:20,display:'flex',alignItems:'center',justifyContent:'space-between'}} elevation={1} />
    <img src='/assets/admin.jpg' style={{marginLeft:30,width:50,borderRadius:25}}/>
    <span style={{fontWeight:'bold',fontFamily:'Poppins',marginRight:60}} >Alice Kumari</span>
      </div>  

    </Paper> */}

 
 <Grid container spacing={3}>
 <Grid item xs={3}>
      <div style={{display:'flex',flexDirection:'column'}}>
  <img src='/biglogo.png' style={{width:80,margin:20}}/>
  <Paper style={{width:250,height:60,background:'#dfe6e9',margin:20,display:'flex',alignItems:'center',justifyContent:'space-between'}} elevation={1} > 
  <img src='/logo192.png' style={{marginLeft:10,width:50,borderRadius:25}}/>
  <span style={{fontWeight:'bold',fontFamily:'Poppins',marginRight:60}} >Aryan Sharma</span> 
  </Paper> 

{/* // List */}

 <List component="nav" >
        <ListItemButton
          
        
         onClick={(event) =>navigate("/dashboard/displayallpatients")}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={<span style={{fontWeight:500,letterSpacing:1, fontFamily:'Poppins'}}>Patient</span>} />
        </ListItemButton>

   
        <Divider/>


        <ListItemButton
         
         onClick={(event) =>navigate("/adminlogin")}
        >
          <ListItemIcon>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText   primary={<span style={{fontWeight:500,letterSpacing:1, fontFamily:'Poppins'}}>Logout</span>} />
        </ListItemButton >
        </List>
 </div>
 </Grid>
 <Grid item xs={9}>
    <Routes>
    <Route element={<DisplayAllPatients/>} path="/displayallpatients" />
    <Route element={<Patient/>} path="/patient" />
 
    <Route element={<AdminLogin/>} path="/adminlogin" />


    </Routes>
    </Grid>
 </Grid>

 </div>)
}