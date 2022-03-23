import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {InputLabel,FormControl,Select,TextField,Grid,Button,Card,CardContent} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: -1,
    width: 225,
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function TruckVehicleMaster(props) {
  const [showSpinner, setSpinner] = React.useState(false);
  const classes = useStyles();
  const inputVendor = React.useRef(null);
  const [labelVendor, setLabelVendor] = React.useState(0);
  const inputTruck = React.useRef(null);
  const [labelTruck, setLabelTruck] = React.useState(0);
  const inputVehicleType = React.useRef(null);
  const [labelVehicleType, setLabelVehicleType] = React.useState(0);
  const inputTruckapacity = React.useRef(null);
  const [labelTruckCapacity, setLabelTruckCapacity] = React.useState(0);
  const [getTruckNo, setTruckNo] = useState('');
  const [getTransportName, setTransportName] = useState('');
  const [getTransportCode, setTransportCode] = useState('');
  const [getTruckTypeDesc, setTruckTypeDesc] = useState('');
  const [getTruckTypeCode, setTruckTypeCode] = useState('');
  const [showLoading, setLoading] = React.useState(true);
  const [getVendors, setVendors] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getTrucks, setTrucks] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getVehicleType, setVehicleType] = React.useState('');
  const [getTruckCapacity, setTruckCapacity] = React.useState('');
   const [getToken, setToken] = useState('');
  React.useEffect(() => {
    setLabelVendor(inputVendor.current.offsetWidth);
    setLabelVehicleType(inputVehicleType.current.offsetWidth);
    setLabelTruck(inputTruck.current.offsetWidth);
    setLabelTruckCapacity(inputTruckapacity.current.offsetWidth);
    let headers = localStorage.getItem('headers');
    setToken(headers)
    async function getVendorLists() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`transport_masters/fetch_vendors`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
     setVendors(body.map(({ name1 }) => ({ label: name1, value: name1 })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getVendorLists();
    async function getTruckLists() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`trucktype_masters/fetch_trucktypes`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
     setTrucks(body.map(({ truck_type_desc }) => ({ label: truck_type_desc, value: truck_type_desc })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getTruckLists();

  }, []);

  const handleVendor = event => {
    setSpinner(true)
    axios({
      method: 'get',
      headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_COMMON_URL+`transport_masters/fetch_vendor_code?vendor_name=${event.target.value}`,
      })
      .then(response =>{
        if (response.status == 200)
        {  
         setSpinner(false) 
         setTransportName(event.target.value)
         setTransportCode(response.data.vendor)
        }
      })
    .catch(error => {
      setSpinner(false) 
      ToastsStore.error("No records Found For ths trnasport name")
     })
  };

  const handleTruck = event => {
  	setSpinner(true)
    axios({
      method: 'get',
      headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_COMMON_URL+`trucktype_masters/fetch_truck_codes?truck_code=${event.target.value}`,
      })
      .then(response =>{
        if (response.status == 200)
        {  
         console.log(response.data.truck_type)
         setSpinner(false) 
         setTruckTypeDesc(event.target.value)
         setTruckTypeCode(response.data.truck_type)
        }
      })
    .catch(error => {
      setSpinner(false) 
      ToastsStore.error("No records Found For ths truck type")
     })
  };

  const submitHandler = event => {
  	const params = new URLSearchParams();
  	 params.set('truck_no',getTruckNo);
     params.set('vendor',getTransportCode);
     params.set('name1',getTransportName)
	   params.set('truck_type',getTruckTypeCode);
	   params.set('truck_type_desc',getTruckTypeDesc);
     params.set('vehicle_type',getVehicleType);
     params.set('truck_capacity',getTruckCapacity);
     setSpinner(true)
     axios({
      method: 'post',
      headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_COMMON_URL+`transport_vehicle_masters`,
      data: params
      })
      .then(response =>{
        if (response.status == 201)
        {  
         setSpinner(false) 
         ToastsStore.success("Submitted successfully")
         window.location.href ='/truck_vehicle_master'
        }
      })
    .catch(error => {
      setSpinner(false) 
      ToastsStore.error("Not Saved")
     })
  };

  const handleVehicleType = event => {
    setVehicleType(event.target.value)
  };

  const handleTruckCapacity = event => {
    setTruckCapacity(event.target.value)
  };
 
  return (
  <div>
  <Sidebar name={Helper.TRUCKVEHICLEMASTER_SIDEBAR_NAME}/> 
    <form  noValidate autoComplete="off">
    <Grid container justify="center" className="mainContainer" style={{ marginTop: "-25px" }} spacing={0} direction="column" alignItems="center" >
      <Grid item  >
        <Card elevation={100} style={{backgroundColor:"white"}}>
          <CardContent style={{ marginLeft:"30px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
	         <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
              <Backdrop className={classes.backdrop} open={showSpinner}>
                  <CircularProgress color="primary" />
              </Backdrop>
            <Grid container spacing={5} >
              <Grid item>           
                <TextField id="truckno" style={{marginLeft:"30px"}}label="Truck No" value={getTruckNo} onInput={e => setTruckNo(e.target.value)}  variant="outlined"/>   
              </Grid>
              <Grid item>
               <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputVendor} id="demo-simple-select-outlined-label">Transport Vendor</InputLabel>
                  <Select labelId="Transport Vendor" id="vendor" onChange={handleVendor} labelWidth={labelVendor}>
                    {getVendors.map(item => ( <option key={item.value} value={item.value}> {item.label} </option>))}
                  </Select>
                </FormControl>        
              </Grid>
              <Grid item  >
                <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputTruck} id="demo-simple-select-outlined-label">Truck Type</InputLabel>
                  <Select labelId="Truck Type" id="truck type" onChange={handleTruck} labelWidth={labelTruck}>
                    {getTrucks.map(item => ( <option key={item.value} value={item.value}> {item.label} </option>))}
                  </Select>
                </FormControl>  
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item style={{marginLeft:"30px"}}>
                <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputVehicleType} id="demo-simple-select-outlined-label">Vehicle Type</InputLabel>
                  <Select labelId="demo-simple-select-outlined-label" id="vehicletype" onChange={handleVehicleType} labelWidth={labelVehicleType} >              
                  <option value="Van">Van</option>
                  <option value='Lorry'>Lorry</option>
                  <option value='Eacher'>Eacher</option>
                </Select>
               </FormControl>     
              </Grid>
              <Grid item>
                <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputTruckapacity} id="demo-simple-select-outlined-label">Truck Capacity</InputLabel>
                  <Select labelId="demo-simple-select-outlined-label" id="truckcapacity" onChange={handleTruckCapacity} labelWidth={labelTruckCapacity} >              
                  <option value={4}>4</option>
                  <option value={9}>9</option>
                  <option value={7}>7</option>
                </Select>
               </FormControl>     
              </Grid>
            </Grid>
            <Grid container justify="center"  style={{ marginTop:30}} >
              <Grid item>
                <Button variant="contained" onClick={Actionhelper.clearBtn('truck_vehicle_master')} style={{ marginLeft:25,borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
                </Grid>
              <Grid item >
                <Button variant="contained"  onClick={submitHandler} color="primary" style={{ marginLeft:25,borderRadius:"20px",textTransform:" capitalize",backgroundColor:"green"}}>
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button  variant="contained"  onClick={Actionhelper.exitBtn()} style={{ marginLeft:25,borderRadius:"20px",backgroundColor:"#8585ad",textTransform:" capitalize",textColor:"black"}}>
                  Exit
                </Button>
              </Grid>
            </Grid>  
          </CardContent>
        </Card>
      </Grid>
    </Grid> 
  </form>
</div>
);
}


