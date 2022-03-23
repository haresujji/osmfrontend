import React from 'react';
import axios from 'axios';
import { makeStyles,InputLabel,FormControl,Select,TextField,Grid,Button,CardContent,Card,Typography,Backdrop,
CircularProgress} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import Checklist from './Checklist'
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Datehelper from './utlis/Datehelper'

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

export default function OSMVehicle(props) {
  const [showSpinner, setSpinner] = React.useState(false);
  let user = localStorage.getItem('userinfo');
  const classes = useStyles();
  const [getCheck, setCheck] = React.useState(false);
  const [showCheckList, setShowCheckList] = React.useState(false);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const inputTrip = React.useRef(null);
  const [labelTrip, setLabelTrip] = React.useState(0);
  const inputPlant = React.useRef(null);
  const [labelPlant, setLabelPlant] = React.useState(0);
  const moment = require("moment");
  const [getRegDate, setRegDate] = useState(Datehelper.displayDate());
  const [getPhone, setPhone] = useState('');
  const [getEmpty, setEmpty] = useState('');
  const [getLoaded, setLoaded] = useState('');
  const [getDl, setDl] = useState('');
  const [getSto, setSto] = useState('');
  const [loading, setLoading] = React.useState(true);
  const [getPlant, setPlant] = useState('');
  const [getStrLoc, setStrLoc] = useState('');
  const [getToPlant, setToPlant] = useState('');
  const [getName,setName] = useState('');
  const [getTripType, setTripType] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getTruck, setTruck] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getPlantName, setPlantName] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getVendor, setVendor]  = React.useState('');
  const [getTruckType, setTruckType] = React.useState('');
  const [getTruckTypeCode, setTruckTypeCode] = useState('');
  const [getVendorCode, setVendorCode] = useState('');
  const [getTruckNo, setTruckNo] = useState('');

  const [getRegDoc, setDoc] = React.useState(''
  );
  const [getDbValue, setDbValue] = React.useState('');
  const [getEbbill, setEbbil] = React.useState('');
  const [showEbbill, setShowEbbil] = React.useState(false);
  const [getToken, setToken] = useState('');

  React.useEffect(() => {
    let user = localStorage.getItem('userid');
    let dbname = localStorage.getItem('db');
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setDbValue(dbname)
     if (dbname == 'dglrmwh'){
      setShowEbbil(true)
    }
    setLabelTrip(inputTrip.current.offsetWidth);
    setLabelPlant(inputPlant.current.offsetWidth);
    async function getUserDetails() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`mst_user_hdrs/fetch_user?user_id=${user}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    console.log(body.user_details['plant'])
    if (response.status == 200){
    setPlant(body.user_details['plant'])
    setStrLoc(body.user_details['str_loc'])
    setPlantName(body.plant_name.map(({ plant_name }) => ({ label: plant_name, value: plant_name })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getUserDetails();
    async function getTruckNo() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`transport_vehicle_masters/fetch_truck`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
    setTruck(body);
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getTruckNo();

  }, []);

  const handleTruck = (event,value) => {
    setVendor(value.name1)
    setTruckType(value.truck_type_desc)
    setTruckTypeCode(value.truck_type)
    setVendorCode(value.vendor)
    setTruckNo(value.truck_no)
  }; 

  const handleTripType = event => {
  };

  const handleDoc = event => {
  };

  const handlePlant = event => {
    setSpinner(true)
    axios({
      method: 'get',
     headers: {
      'Authorization': getToken
      },
      url: process.env.REACT_APP_COMMON_URL+`mst_plants/fetch_toplant?plant_name=${event.target.value}`,
      })
      .then(response =>{
        if (response.status == 200)
        {
        setSpinner(false)  
        setToPlant(response.data.plant)
        } 
      })
      .catch(error => {
         ToastsStore.error("No Matches Found for this plant name")
      })
  };



  const checkList = event => {
  	setShowCheckList(true);
  };

   const submitHandler = event =>{
     let api_url
      if (getDbValue == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs`
     }
     else{
      api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs`
     }
     const params = new URLSearchParams();
      var date = document.getElementById("regdate").value
      var transportvendor = document.getElementById("vendor").value
      var trip = document.getElementById("triptype").innerText
      var trucktype = document.getElementById("trucktype").value
      var names = document.getElementById("name").value
      var phones = document.getElementById("phone").value
      var empty = document.getElementById("empty").value
      var dl = document.getElementById("dl").value
      if (getDbValue == 'dglrmwh') {
      var load = document.getElementById("loaded").value }
      if (getTruckNo == '' ){
         ToastsStore.error("Truck Number is empty")
      }
      else if (getVendor == '') {
        ToastsStore.error("Trasport Vendor is empty")
      }
      else if (1 === trip.length ) {
        ToastsStore.error("Trip Type is empty")
      }
      else if (getTruckType == '') {
        ToastsStore.error("Trucktype  is empty")
      }
      else if (names == '' ) {
        ToastsStore.error("Driver Name is empty")
      }
      else if (phones == '' ) {
        ToastsStore.error("Driver Phone is empty")
      }
      else if (getPhone.length > 10){
        ToastsStore.error("Phone number is greater than 10")
      }
        else if (getEmpty == '' && getDbValue == 'dglosm' ) {
          ToastsStore.error("Empty Wt is empty")
        }
      else if (getDl == '' ) {
        ToastsStore.error("DL No is empty")
      }
      else if (getToPlant == '' ) {
        ToastsStore.error("To Plant empty")
      }

       
      else{
        params.set('trns_doc_no',getRegDoc);
        params.set('trns_doc_date',getRegDate);
        params.set('truck_no',getTruckNo)
        params.set('transport_vendor',getVendor);
        params.set('truck_type',getTruckTypeCode);
        params.set('vendor',getVendorCode);
        params.set('truck_type_desc',getTruckType);
        params.set('trip_type',trip)
        params.set('driver_name',names)
        params.set('driver_phone',phones);
        params.set('driver_license',getDl);
        params.set('empty_truck_wt',getEmpty);
        params.set('plant',getPlant)
        params.set('to_plant',getToPlant)
        params.set('str_loc',getStrLoc)
        if(getDbValue == 'dglrmwh'){
        params.set('ewaybil',getEbbill)
        params.set('dbname',getDbValue)
        params.set('total_truck_wt',load)}
      	setSpinner(true)
        axios({
        method: 'post',
        headers: {
        'Authorization': getToken
        },
        url: api_url,
        data: params
        })
        .then(response =>{
        	if (response.status == 201)
        	{
            setSpinner(false)
            ToastsStore.success("Saved successfully")
        	  setCheck(true);
            setDoc(response.data.trns_doc_no);       
        	}  
          if (response.status == 200)
          {
            setSpinner(false)
            ToastsStore.success(response.data)   
          }     

        })
        .catch(error => {
         ToastsStore.error("Not Saved")
        })
      }
    }

  const edit = event =>{
    window.location.href = '/osmvehicle_edit'
  }

  const showCheck = (value,check) => {
  	setShowCheckList(value);
  	setCheck(check);
  };


  const handleEbil = (e)=>{
   
    if (e.target.value == '' || getEbbill.length > 11){
    }
    else{
      setEbbil(e.target.value)
    }
  }

  return (
  <div>
  <Sidebar name={Helper.VEHICLE_SIDEBAR_NAME} color="true"/>
   {showCheckList ? <Checklist check={showCheck}/> :  
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
                <TextField id="regdoc" disabled label="Reg Doc"  InputLabelProps={{ required: true}} variant="outlined" value={getRegDoc}/>
              </Grid>
              <Grid item  >
                <TextField id="regdate" style={{marginLeft:"30px"}}label="Registration Date" InputLabelProps={{ required: true}}   value={getRegDate} onInput={e => setRegDate(e.target.value)}  variant="outlined" />     
              </Grid>
              <Grid item  style={{marginLeft:"30px"}} >           
                <Autocomplete id="trucknumber" options={getTruck } getOptionLabel={(option) => option.truck_no} style={{ width: 220 }} onChange={handleTruck} renderInput={(params) => <TextField {...params} label="Truck No" variant="outlined" />}/> 
              </Grid>
            </Grid>
            <Grid container spacing={5} >
              <Grid item>
                <TextField id="vendor" label="Transport Vendor"  InputLabelProps={{ required: true}} variant="outlined" value={getVendor} onInput={e => setVendor(e.target.value)}/>           
              </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                <TextField id="trucktype" label="Truck Type"  InputLabelProps={{ required: true}} variant="outlined" value={getTruckType} onInput={e => setTruckType(e.target.value)}/> 
              </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputTrip} id="demo-simple-select-outlined-label">Trip Type </InputLabel>
                  <Select labelId="demo-simple-select-outlined-label" id="triptype" onChange={handleTripType} labelWidth={labelTrip} >              
                  <option value={1}>Empty Vehicle</option>
                  <option value={2}>Load Vehicle</option>
                </Select>
               </FormControl>           
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item >
                <TextField id="name" InputLabelProps={{ required: true}} label="Driver Name" variant="outlined"
              value={getName} onInput={e => setName(e.target.value)}/>
              </Grid>
             <Grid item style={{marginLeft:"30px"}} >
                <TextField type="number" id="phone" InputLabelProps={{ required: true}} value={getPhone} onInput={e => setPhone(e.target.value)}label="Driver Phone"variant="outlined"  />
              </Grid>
              <Grid item style={{marginLeft:"30px"}}  >
                 <TextField id="dl" InputLabelProps={{ required: true}} label="DL Num" variant="outlined"
                 value={getDl} onInput={e => setDl(e.target.value)}/>
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item>
                 <TextField type="number" id="empty"  label="Vehicle empty Wt in Kg" variant="outlined"
                 value={getEmpty} onInput={e => setEmpty(e.target.value)}/>                 
              </Grid>
              <Grid item  style={{marginLeft:"30px"}}>
               {showEbbill ? 
                  <TextField id="loaded" type="number" InputLabelProps={{ required: true}}value={getLoaded} onInput={e => setLoaded(e.target.value)}label="Loaded Wt in Kg"variant="outlined"  
                  />   :  <TextField type="number" id="loaded" disabled InputLabelProps={{ required: true}}value={getLoaded} onInput={e => setLoaded(e.target.value)}label="Loaded Wt in Kg"variant="outlined"  
                  /> }    
              </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                 <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputPlant} id="demo-simple-select-outlined-label">To Plant</InputLabel>
                  <Select labelId="ToPlant" id="plantname" InputLabelProps={{ required: true}} onChange={handlePlant} labelWidth={labelPlant}>
                    {getPlantName.map(item => (<option key={item.value} value={item.value}> {item.label} </option>))}
                  </Select>
                </FormControl>           
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item>
                <TextField id="sto" disabled value={getSto} onInput={e => setSto(e.target.value)}label="STO invoice" variant="outlined"  />
              </Grid>
              {showEbbill ?
               <Grid item style={{marginLeft:"30px"}}>
                <TextField type="number" id="ebbill"  value={getEbbill} onInput={handleEbil}  label="EWayBill" variant="outlined"  />       </Grid> : null }
            </Grid>
            <Grid container justify="center"  style={{ marginTop:30}} >
             {getCheck ? 
             <Grid item>
                <Button  id="checkbutton" variant="contained" color="primary" style={{marginLeft:0,borderRadius:"20px",textTransform:" capitalize"}} onClick={checkList} >
                  Checklist
                </Button>
             </Grid> : null}
             <Grid item>
                <Button variant="contained" onClick={submitHandler} color="primary" style={{ borderRadius:"20px",marginLeft:25,textTransform:" capitalize"}} >
                  Save
                </Button> 
             </Grid>
            <Grid item>
              <Button variant="contained" onClick={Actionhelper.clearBtn('osm_vehicle')} style={{ marginLeft:25,borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
              </Grid>
            <Grid item >
              <Button variant="contained"  onClick={edit} color="primary" style={{ marginLeft:25,borderRadius:"20px",textTransform:" capitalize",backgroundColor:"green"}}>
                Edit
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
}
</div>
);
}


