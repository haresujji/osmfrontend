import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom';
import axios from 'axios';
import OSMVehicle from './OSMVehicle'
import Nav from './Nav';
import App from './App';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dashboard from './Dashboard';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
   backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


export default function SignIn() {
  const classes = useStyles();
  const [empcode, setempcode] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const loginhandler = event => {
    setOpen(!open)
    var empcode = document.getElementById("empcode").value
    var password = document.getElementById("password").value
    var data = {"user":{
    "emp_code":empcode,
    "password":password}}
      event.preventDefault();
      axios({
        method: 'post', 
        url: process.env.REACT_APP_AUTHENTICATION_URL+`users/sign_in`,
        // headers: {'Authorization': 'Bearer'+token}, 
        data:data
      })
      .then(response =>{  
        if (response.status == "200"){  
          setOpen(false)
          localStorage.setItem('empcode',response.data.emp_code);
          localStorage.setItem('roles',JSON.stringify(response.data['roles']));
          localStorage.setItem('userid',JSON.stringify(response.data.id));
          localStorage.setItem('data',JSON.stringify(response.data));
          localStorage.setItem('headers',response.headers['authorization']);
          let headers = localStorage.getItem('headers');
           handleuserid(response.data.id,headers);
        }
      })
      .catch(error => {
        ToastsStore.error("Invalid emp code or password")
        setOpen(false)
      })  
    }

  const handleuserid = (id,token) => {  
    setOpen(!open) 
      axios({
      method: 'get',
      headers: {
      'Authorization': token
      },
      url: process.env.REACT_APP_COMMON_URL+`mst_user_hdrs/fetch_user_details?user_id=${id}`,
      })
      .then(response =>{
        if (response.status == 200)
        {
         setOpen(false)
         localStorage.setItem('db',response.data.db_name);
         localStorage.setItem('plant',response.data.plant);
         localStorage.setItem('str_loc',response.data.str_loc);
         window.location.href = '/dashboard'
        } 
      })
      .catch(error => {
      })
  };


  return (
  <div>
    <h1> 
      <Nav/>
    </h1>
   <Grid container justify="center" className="mainContainer" spacing={0} direction="column" alignItems="center" >
      <Grid item style={{marginTop:"5px"}} >
        <Card elevation={100}>
          <CardContent style={{marginTop:"5px" }}>  
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                  <div className={classes.paper}>
                     <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                      </Avatar>
                       <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                          <Typography component="h1" variant="h5">
                            Sign in
                          </Typography>
                          <form className={classes.form} noValidate>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              id="empcode"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                              autoFocus
                              value={empcode} onInput={e => setempcode(e.target.value)} 
                            />
                            <Backdrop className={classes.backdrop} open={open}>
                              <CircularProgress color="primary" />
                            </Backdrop>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Password"
                              type="password"
                              id="password"
                              autoComplete="current-password"
                            />
                            <Button        
                              fullWidth
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                              onClick={loginhandler}     
                              name='login'
                            >
                              Sign In
                            </Button>
                            <Typography style={{fontWeight:"bold",fontSize:"14px",marginLeft:"150px"}}>App Version 1.21</Typography>
                          </form>
                        </div>
                      </Container>
                   </CardContent>
                </Card>
              </Grid>
              </Grid>
            </div>
            );
          }
