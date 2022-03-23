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
import Autocomplete from '@material-ui/lab/Autocomplete';


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

export default function TruckTransfer(props) {
  const [showSpinner, setSpinner] = React.useState(false);
  const classes = useStyles();
  const inputSto = React.useRef(null);
  const [labelSto, setLabelSto] = React.useState(0);
  const [getReg, setReg] = useState('');
  const [getFromTruck, setFromTruck] = useState('');
  const [getToTruck, setToTruck] = useState([
    ]);
  const [getFromTransport, setFromTransport] = useState('');
  const [getToTruckNo, setToTruckNo] = useState('');
  const [getPhone, setPhone] = useState('');
  const [getOldPhone, setOldPhone] = useState('');
  const [getSto, setSto] = useState('');
  const [getDriverName, setDriverName] = useState('');
  const [getOldDriverName, setOldDriverName] = useState('');
  const [getToTransport, setToTransport] = useState('');
  const [getDbName, setDbName] = useState('');
  const [showLoading, setLoading] = React.useState(true);
  const [getStoList, setStoList] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getOldVendor, setOldVendor] = useState('');
  const [getNewVendor, setNewVendor] = useState('');
  const [getOldTruckType, setOldTruckType] = useState('');
  const [getNewTruckType, setNewTruckType] = useState('');
  const [getOldTruckTypeDesc, setOldTruckTypeDesc] = useState('');
  const [getNewTruckTypeDesc, setNewTruckTypeDesc] = useState('');
  const [getToken, setToken] = useState('');
  React.useEffect(() => {
    let dbName = localStorage.getItem('db');
     let headers = localStorage.getItem('headers');
    setToken(headers)
    setDbName(dbName)
    setLabelSto(inputSto.current.offsetWidth);
    async function getStoLists() {
    let api_url 
    if (dbName == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/fetch_stos`
    }
    else{
    api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/fetch_stos`
    }
    const response = await fetch(api_url,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
    setStoList(body.map(({ sto_no }) => ({ label: sto_no, value: sto_no })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getStoLists();

  }, []);

  const handleSto = event => {
    setSto(event.target.value)
    let api_url
    if (getDbName == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/fetch_sto_list?sto_no=${event.target.value}`
    }
   else{
    api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/fetch_sto_list?sto_no=${event.target.value}`
    }
    setSpinner(true)
    axios({
      method: 'get',
      headers: {
      'Authorization': getToken
      },
      url:api_url,
      })
      .then(response =>{
        if (response.status == 200)
        { 
         setSpinner(false) 
         setReg(response.data.trns_doc_no)
         setFromTruck(response.data.truck_no)
         setFromTransport(response.data.transport_vendor)
         setDriverName(response.data.driver_name)
         setPhone(response.data.driver_phone)
         getToTruckLists(response.data.truck_no)
         setOldPhone(response.data.driver_phone)
         setOldDriverName(response.data.driver_name)
         setOldVendor(response.data.vendor)
         setOldTruckType(response.data.truck_type)
         setOldTruckTypeDesc(response.data.truck_type_desc)
        }
      })
    .catch(error => {
      setSpinner(false) 
      ToastsStore.error("No records Found For ths Sto")
     })
  };

  const getToTruckLists = (truck_no) => {     
    setSpinner(true)
    axios({
      method: 'get',
      headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_COMMON_URL+`transport_vehicle_masters/fetch_truck_lists?truck_no=${truck_no}`,
      })
      .then(response =>{
        if (response.status == 200)
        {  
         setSpinner(false) 
         setToTruck(response.data)
        }
      })
    .catch(error => {
      setSpinner(false) 
      ToastsStore.error(Helper.NO_RECORDS)
     })
  };


  const handleToTruck =(event,value) => {
    setToTruckNo(value.truck_no)
    setToTransport(value.name1)
    setNewVendor(value.vendor)
    setNewTruckType(value.truck_type)
    setNewTruckTypeDesc(value.truck_type_desc)
  };

  const submitHandler = event => {
    if (getToTruckNo == '' )
    {
      ToastsStore.error("To Truck No is empty")
    }
    else{
      setSpinner(true)
      let api_url
        if (getDbName == 'dglosm'){
        api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/update_truck_transfer`
       }
       else{
        api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_truck_transfer`
       }
        axios.patch(api_url, {
          getSto,getReg,getFromTruck,getToTruckNo,getFromTransport,getToTransport,getOldVendor,getNewVendor,getDriverName,getPhone,getOldPhone,getOldDriverName,
          getOldTruckType,getNewTruckType,getOldTruckTypeDesc,getNewTruckTypeDesc
        },{headers:{'Authorization': getToken}})
        .then(response =>{
          if(response.status == 200){
            update_in_sto_hdrs();
          } 
        })
        .catch(error => {
          setSpinner(false)
          ToastsStore.error("Not updated")
        })
      }
    }

   const update_in_sto_hdrs = event => {
      setSpinner(true)
      let api_url
        api_url = process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/update_truck_transfer`
        axios.patch(api_url, {
          getSto,getReg,getFromTruck,getToTruckNo,getFromTransport,getToTransport,getOldVendor,getNewVendor,getDriverName,getPhone,getOldPhone,getOldDriverName,
          getOldTruckType,getNewTruckType,getOldTruckTypeDesc,getNewTruckTypeDesc
        },{headers:{'Authorization': getToken}})
        .then(response =>{
          if(response.status == 200){
            setSpinner(false)
            ToastsStore.success("Submited successfully")   
            window.location.href  ='/trucktransfer'
          } 
        })
        .catch(error => {
          setSpinner(false)
          ToastsStore.error("Not updated STO")
        })
    }

 
  return (
  <div>
  <Sidebar name={Helper.TRUCK_TRANSFER_SIDEBAR_NAME}/> 
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
               <FormControl variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputSto} id="demo-simple-select-outlined-label">STO Invoice</InputLabel>
                  <Select labelId="STO Invoice" id="stoInvoice" onChange={handleSto} labelWidth={labelSto}>
                    {getStoList.map(item => ( <option key={item.value} value={item.value}> {item.label} </option>))}
                  </Select>
                </FormControl>        
              </Grid>
              <Grid item  >
                <TextField id="reg" style={{marginLeft:"30px"}}label="Registration"  value={getReg} onInput={e => setReg(e.target.value)}  variant="outlined"/>     
              </Grid>
              <Grid item>           
                <TextField id="fromtruck" style={{marginLeft:"30px"}}label="From Truck Number" value={getFromTruck} onInput={e => setFromTruck(e.target.value)}  variant="outlined"/>   
              </Grid>
            </Grid>
            <Grid container spacing={5} >
              <Grid item>
                 <Autocomplete id="totruck" options={ getToTruck} getOptionLabel={(option) => option.truck_no ? option.truck_no : ''} style={{ width: 220 }}
                  onChange={handleToTruck} renderInput={(params) => <TextField {...params} label="To Truck No" variant="outlined" />} /> 
              </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                <TextField id="fromtransport" label="From Transport" variant="outlined" value={getFromTransport} onInput={e => setFromTransport(e.target.value)}/> 
              </Grid>
              <Grid item  >
                 <TextField id="totransport" style={{marginLeft:"30px"}}label="To Transport" value={getToTransport} onInput={e => setToTransport(e.target.value)}  variant="outlined"/>        
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item >
                <TextField id="name"  label="Driver Name" variant="outlined" value={getDriverName} onInput={e => setDriverName(e.target.value)}/>
              </Grid>
             <Grid item style={{marginLeft:"30px"}} >
                <TextField type="number" id="phone"  value={getPhone} onInput={e => setPhone(e.target.value)}label="Driver Phone"variant="outlined"  />
              </Grid>
            </Grid>
            <Grid container justify="center"  style={{ marginTop:30}} >
              <Grid item>
                <Button variant="contained" onClick={Actionhelper.clearBtn('trucktransfer')} style={{ marginLeft:25,borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
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


