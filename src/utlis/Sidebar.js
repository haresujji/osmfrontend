import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Drawer,AppBar,Toolbar,List,CssBaseline,Typography,Divider,IconButton,ListItem,ListItemIcon,ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import LabelIcon from '@material-ui/icons/Label';
import LockIcon from '@material-ui/icons/Lock';
import UndoIcon from '@material-ui/icons/Undo';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import ReportIcon from '@material-ui/icons/Report';
import ExposureIcon from '@material-ui/icons/Exposure';
import Grid from '@material-ui/core/Grid';
import AssessmentIcon from '@material-ui/icons/Assessment';
import eurogrip from '../images/eurogrip.jpg'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import PaletteIcon from '@material-ui/icons/Palette';


const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor:'grey'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',

    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  drawer:{
    backgroundColor:'grey'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Sidebar(props) {
  React.useEffect(() => {
  var role = localStorage.getItem('roles');
  var roles = JSON.parse(role);
    roles.map((i,d) =>{
      if (i['name'] == 'vehicleregistration'){
        setVehicle(true);
        setOsmReport(true);
      }
      else if (i['name'] == 'excessstock'){
        setExcessStock(true);
      }
      else if (i['name'] == 'factoryregistration')
      {
        setFactory(true);
      }
      else if (i['name'] == 'weighbridge'){
        setWeighbridge(true);
      }
      else if (i['name'] == 'unloadingprocess'){
        setUnloadingProcess(true);
      }
      else if (i['name'] == 'grnprocess'){
        setGrnProcess(true);
      }
      else if (i['name'] == 'storeport'){
        setStoReport(true);
      }
      else if (i['name'] == 'trucktransfer'){
        setTruckTransfer(true);

      }
      else if (i['name'] == 'truckvehiclemaster'){
        setTruckVehicleMaster(true);
      }
       else if (i['name'] == 'palletRfid'){
        setPalletRfid(true);
      }
    });
  });
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [getVehicle, setVehicle] = React.useState(false);
  const [getFactory, setFactory] = React.useState(false);
  const [getWeighbridges, setWeighbridge] = React.useState(false);
  const [getUnloadingProcess, setUnloadingProcess] = React.useState(false);
  const [getGrnProcess, setGrnProcess] = React.useState(false);
  const [getOsmReport, setOsmReport] = React.useState(false);
  const [getExcessStock, setExcessStock] = React.useState(false);
  const [getStoReport, setStoReport] = React.useState(false);
  const [getTruckTransfer, setTruckTransfer] = React.useState(false);
  const [getTruckVehicleMaster, setTruckVehicleMaster] = React.useState(false);
  const [getPalletRfid, setPalletRfid] = React.useState(false);

  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const Registration = () => {
    window.location.href = '/osm_vehicle'
  };

  const Excessstock = () => {
    window.location.href = '/excessstock'
  };

  const Factory = () => {
    window.location.href = '/factory_registration'
  };

  const weighbridge = () => {
    window.location.href = '/weighbridge'
  };

  const Unloadingprocess = () => {
    window.location.href = '/unloading_process'
  };

  const Grnprocess = () => {
    window.location.href = '/grnprocess'
  };

  const Osmreport = () => {
    window.location.href = '/osmreport'
  };

  const STOreport = () => {
    window.location.href = '/storeport'
  };

  const TruckTransfer = () => {
    window.location.href = '/trucktransfer'
  };

  const TruckVehicleMaster = () => {
    window.location.href = '/truck_vehicle_master'
  };

  const pallet_Rfid = () => {
    window.location.href = '/pallet_rfid'
  };

  const logoutHandler = () => {
    window.location.href = '/login'
    localStorage.clear();
  };



  return (
    <div className={classes.root}>
      <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
          >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
              >
              <MenuIcon />
           </IconButton>
            <Grid container spacing={2}>
              <Grid item > <Typography variant="h6" noWrap>
              {props.loginPlant && props.loginLoc ? 
                `${props.name} - ${props.loginPlant} - ${props.loginLoc}` :
                `${props.name}`
              }
              </Typography></Grid>
              <Grid item style={{marginLeft:"800px"}}>  <Typography variant="h6" onClick={logoutHandler} style={{cursor:'pointer'}}>
              Logout
              </Typography></Grid>
              </Grid>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
          <div className={classes.toolbar}>
          <img style={{height:"70px",marginRight:"-35px"}} src={eurogrip} alt="fireSpot"/>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
         <List style={{backgroundColor:'#3f51b5',height:"100%"}}>   
            {getVehicle ?     
             <ListItem button key='Vehicle Registration' id="reg"  onClick={Registration}>
              <ListItemIcon style={{color:"white"}}><LocalShippingIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Vehicle Registration'} />
            </ListItem>  : null }
            {getOsmReport ?     
             <ListItem button key='OSM Report' id="osmreport"  onClick={Osmreport}>
              <ListItemIcon style={{color:"white"}}><ReportIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'OSM Report'} />
            </ListItem>  : null }
            {getFactory ?  
             <ListItem button key='Factory Registration' id="Factory"  onClick={Factory}>
              <ListItemIcon style={{color:"white"}}><LocationCityIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Factory Registration'} />
            </ListItem>  : null }
            {getWeighbridges ?
            <ListItem button key='Weighbridge Process' id="Weighbridge"  onClick={weighbridge}>
              <ListItemIcon style={{color:"white"}}><LabelIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Weighbridge Process'} />
            </ListItem> : null}
            {getUnloadingProcess ?
            <ListItem button key='unloading Process' id="unloadingprocess"  onClick={Unloadingprocess}>
              <ListItemIcon style={{color:"white"}}><UndoIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Unloading Process'} />
            </ListItem> : null}
            {getGrnProcess ?
            <ListItem button key='Grn Process' id="grnprocess"  onClick={Grnprocess}>
              <ListItemIcon style={{color:"white"}}><SpellcheckIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Grn Process'} />
            </ListItem> : null}
            {getExcessStock ?
            <ListItem button key='Excess Stock Confirmation' id="excessstock"  onClick={Excessstock}>
              <ListItemIcon style={{color:"white"}}><ExposureIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Excess Stock Confirmation'} />
            </ListItem> : null}         
            {getStoReport ?
            <ListItem button key='STO Report' id="storeport"  onClick={STOreport}>
              <ListItemIcon style={{color:"white"}}><AssessmentIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'STO Report'} />
            </ListItem> : null}   
            {getTruckTransfer ?
            <ListItem button key='trucktransfer' id="trucktransfer"  onClick={TruckTransfer}>
              <ListItemIcon style={{color:"white"}}><TransferWithinAStationIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Truck Transfer'} />
            </ListItem> : null}  
             {getTruckVehicleMaster ?
            <ListItem button key='Truck vehicle Master' id="truckvehiclemaster"  onClick={TruckVehicleMaster}>
              <ListItemIcon style={{color:"white"}}><AirportShuttleIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Truck vehicle Master'} />
            </ListItem> : null}  
            {getPalletRfid ?
            <ListItem button key='Pallet Rfid' id="pallet_rfid"  onClick={pallet_Rfid}>
              <ListItemIcon style={{color:"white"}}><PaletteIcon /></ListItemIcon>
              <ListItemText style={{color:"white"}} primary={'Pallet Rfid'} />
            </ListItem> : null}              
          </List>
        </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
}