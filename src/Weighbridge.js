import React from 'react';
import axios from 'axios';
import { makeStyles,InputLabel,FormControl,Select,TextField,Grid,Button,Card,CardContent,Typography,Backdrop,CircularProgress } from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import { Table} from 'react-bootstrap';
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Avatar from '@material-ui/core/Avatar';
import SendIcon from '@material-ui/icons/Send';

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

export default function Weighbridge() {
  const classes = useStyles();
  const [getRfid, setRfid] = useState('');
  const [getTruckWtStatus, setTruckWtStatus] = useState('');
  const [getWeighmentDate, setWeighmentDate] = useState('');
  const inputTruck = React.useRef(null);
  const [labelTruck, setlLabelTruck] = React.useState(0);
  const inputGroup = React.useRef(null);
  const [labelGroup, setLabelGroup] = React.useState(0);
  const [getTruck, setTruck] = React.useState([
    { label: "Loading...", value: [] }
    ]);
  const [getGroup, setGroup] = React.useState([
    { label: "Loading...", value: [] }
    ]);
  const [loading, setLoading] = React.useState(true);
  const [getStoNo, setStoNo] = useState('');
  const [getDocument, setDocument] = useState('');
  const [getGross, setGross] = useState('');
  const [getNet, setNet] = useState('');
  const [getTare, setTare] = useState('');
  const [getGrossWt, setGrossWt] = useState('');
  const [getInputTruck, setInputTruck] = useState('');
  const [getOneGroup, setOneGroup] = useState('');
  const [getMatGroup, setMatGroup] = useState('');
  const [getMatGroupName, setMatGroupName] = useState('');
  const [getShowTruck, setShowTruck] = useState(false);
  const [showSpinner, setSpinner] = React.useState(false);
  const [getRead, setRead] = React.useState();

  const [getToken, setToken] = useState('');

  React.useEffect(() => {
    let loginplant = localStorage.getItem('plant')
    let loginloc = localStorage.getItem('str_loc')
    setlLabelTruck(inputTruck.current.offsetWidth);
    setLabelGroup(inputGroup.current.offsetWidth);
     let headers = localStorage.getItem('headers');
    setToken(headers)
    async function getVendor() {
      const response = await fetch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_truck`,{headers:{'Authorization': headers}});
      const body = await response.json();
      if (response.status == 200){
        setTruck(body.map(({ truck_no }) => ({ label: truck_no, value: truck_no })));
        setLoading(false);
      }
      else{
        setLoading(true);
      }
    }
    getVendor();
     async function getValue() {
      const response = await fetch(process.env.REACT_APP_RECEIPT_URL+`matgroup_unload_dtls/fetch_rfidread?plant=${loginplant}&str_loc=${loginloc}`,{headers:{'Authorization': headers}});
      const body = await response.json();
        console.log(body)

      if (response.status == 200){
       setRead(body.rfid_read)
       setLoading(false);
      }
      else{
        setLoading(true);
      }
    }
    getValue();

  }, []);

  const tagHandler = event => {
   setSpinner(true)
   axios({
    method: 'get',
      headers: {
      'Authorization': getToken
      },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_tag_hdrs?rfid=${getRfid}`,
   })
   .then(response =>{
    if (response.status == 200)
    {
      setWeighmentDate(response.data.gate_entry_docdt)
      setStoNo(response.data.sto_no)
      setDocument(response.data.gate_entry_docno)
      setSpinner(false)
      setShowTruck(true)
      setInputTruck(response.data.truck_no)
      setGross(response.data.rec_truck_gross_wt)
      setTare(response.data.rec_truck_tare_wt)
      setGrossWt(response.data.rec_truck_gross_wt)
      fetchMatGroup(response.data.sto_no)
    } 
  })
   .catch(error => {
    setSpinner(false)
    ToastsStore.error("No records found for this rfid")
  })
 };

 const fetchMatGroupFromTruck = (rfid, sto) => {
   setSpinner(true)
   axios({
    method: 'get',
      headers: {
      'Authorization': getToken
      },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_group?rfid_tag=${rfid}&sto_no=${sto}`,
  })
   .then(response =>{
    if (response.status == 200 && response.data.length > 1){
      setSpinner(false)
      setGroup(response.data.map(({ mat_group_name }) => ({ label: mat_group_name, value: mat_group_name })));
      setLoading(false);
      setMatGroupName(response.data.mat_group_name)
    }
    else{
      setLoading(true);
    }
    if (response.status == 200 && response.data.length == 1){
      setSpinner(false)
      setMatGroupName(response.data[0]['mat_group_name'])
      setGrossWt(response.data[0]['rec_truck_gross_wt'])
      setGross(response.data[0]['rec_truck_gross_wt'])
      setTare(response.data[0]['rec_truck_tare_wt'])
      setNet(response.data[0]['rec_truck_net_wt'])
      setOneGroup(response.data[0]['mat_group_name'])
      setGroup('')
    }
  })
   .catch(error => {
    setSpinner(false)
   })
 };

 const fetchMatGroup = (sto) => {
   setSpinner(true)
   axios({
    method: 'get',
      headers: {
      'Authorization': getToken
      },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_group?rfid_tag=${getRfid}&sto_no=${sto}`,
  })
   .then(response =>{
    if (response.status == 200 && response.data.length > 1){
      setSpinner(false)
      setGroup(response.data.map(({ mat_group_name }) => ({ label: mat_group_name, value: mat_group_name })));
      setLoading(false);
      setMatGroupName(response.data.mat_group_name)
    }
    else{
      setLoading(true);
    }
    if (response.status == 200 && response.data.length == 1){
      setSpinner(false)
      setMatGroupName(response.data[0]['mat_group_name'])
      setOneGroup(response.data[0]['mat_group_name'])
      setGroup('')
    }
  })
   .catch(error => {
   })
 };

 const handleTruck = event => {
  setSpinner(true)
  axios({
    method: 'get',
      headers: {
      'Authorization': getToken
      },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_truck_object?truck_no=${event.target.value}`,
  })
  .then(response =>{
    if (response.status == 200)
    {
      setWeighmentDate(response.data.gate_entry_docdt)
      setStoNo(response.data.sto_no)
      setDocument(response.data.gate_entry_docno)
      setSpinner(false)
      setShowTruck(false)
      setRfid(response.data.lfrfid_tag)        
      setTruckWtStatus(response.data.truck_tarewt_status)
      setInputTruck(response.data.truck_no)
      fetchMatGroupFromTruck(response.data.lfrfid_tag, response.data.sto_no)
    } 
  })
  .catch(error => {
    setSpinner(false)
    ToastsStore.error("No records found for this Truck")
  })
};

const handleGroup = event => {
  setMatGroupName(event.target.value)
  setSpinner(true)
  axios({
    method: 'get',
      headers: {
      'Authorization': getToken
      },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_group_object?group=${event.target.value}&sto_no=${getStoNo}`,
  })
  .then(response =>{
    if (response.data.rec_truck_gross_wt == null)
    {
      setSpinner(false)
      setMatGroup(response.data.mat_group_name)
      setGrossWt('')
      setGross('')
      setTare('')
      setNet('')
    }
    else{
       setSpinner(false)
      setMatGroup(response.data.mat_group_name)
      setGrossWt(response.data.rec_truck_gross_wt)
      setGross(response.data.rec_truck_gross_wt)
      setTare(response.data.rec_truck_tare_wt)
      setNet(response.data.rec_truck_net_wt)
    }
  })
  .catch(error => {
   setSpinner(false)
 })
};

const submitHandler = event =>{
  let user = localStorage.getItem('empcode');
   if (getRfid == '' ){
     ToastsStore.error("Rfid  is empty")
   }
   else if (getWeighmentDate == '') {
    ToastsStore.error("Weighment date is empty")
  }
  else if (getTruck == '' ) {
    ToastsStore.error("Truck is empty")
  }
  else if (getStoNo  == '' ) {
    ToastsStore.error("Sto  is empty")
  }
  else if (getDocument  == '' ) {
    ToastsStore.error("Document  is empty")
  }
  else if (getMatGroupName  == '' ) {
    ToastsStore.error("Mat group is empty")
  }
  else if (getGross == null ) {
    ToastsStore.error("Gross wt is empty")
  }
  else if (getTruckWtStatus == null || (getTruckWtStatus == 'open' && getTare != null && getTare != '' ))  {
    ToastsStore.error("Truck not unloaded")
  }
  else{
  setSpinner(true)
  axios.patch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/update_weight_in_receipt_hdrs`, {
    getGross,
    getTare,
    getNet,
    getOneGroup,
    getMatGroup,
    user,
    getStoNo
  },{headers:{'Authorization': getToken}})
  .then(response =>{
    if(response.status == 200){
      setSpinner(false)
      ToastsStore.success("Updated successfully")
      window.location.href = '/weighbridge'
    } 
  })
  .catch(error => {
    setSpinner(false)
    ToastsStore.error("Not updated")
  })
}
}

const fetchWeight = (button) => {
  
  setSpinner(true)
  axios({
    method: 'get',
    url: 'http://10.10.35.30:9000/api/weight',
  })
  .then(response =>{
    console.log(response)
    if (response.data.statusCode == 400)
    {
      ToastsStore.error("No Weight are Placed")
       setSpinner(false)
    }
    else if(button == 'tare'){
      setTare(response.data.weight)
      setSpinner(false)

    }
    else{
      setGross(response.data.weight)
      setSpinner(false)
    }
  })
  .catch(error => {    
   setSpinner(false)
 })
 };


return (  
  <div>
    <Sidebar name={Helper.WEIGHBRIDGE_SIDEBAR_NAME}/>
      <form  noValidate autoComplete="off">
        <Grid container justify="center" className="mainContainer" spacing={0} direction="column" alignItems="center" >
          <Grid item  >
            <Card elevation={20}>
              <CardContent style={{ marginLeft:"30px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
              <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
               <Backdrop className={classes.backdrop} open={showSpinner}>
                  <CircularProgress color="primary" />
               </Backdrop>
              <Grid container spacing={5} >
                <Grid item>
                  <TextField id="rfid" label="Rfid Tag" InputLabelProps={{ required: true}}   value={getRfid} onInput={e => setRfid(e.target.value)}  variant="outlined"   /> 
                </Grid>
                <Grid item style={{marginLeft:"30px"}} >
                  <TextField id="weighmentdate" label="Weighment Date" InputLabelProps={{ required: true}}   value={getWeighmentDate} onInput={e => setWeighmentDate(e.target.value)}  variant="outlined"    />                   
                </Grid>
                <Grid item style={{marginLeft:"30px"}}>
                  <FormControl variant="outlined"  className={classes.formControl} >
                    <InputLabel ref={inputTruck}    InputLabelProps={{ required: true}} id="demo-simple-select-outlined-label">Truck</InputLabel>
                    <Select labelId="demo-simple-select-outlined-label" id="truck" onChange={handleTruck} labelWidth={labelTruck} value={getInputTruck}> 
                    {getTruck.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>))}</Select>
                  </FormControl>      
                  </Grid> 
                    <Button variant="contained"  onClick={tagHandler} color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",height:"40px", marginLeft:25,marginTop:"25px",textTransform:" capitalize"}}>
                    Display
                    </Button> 
                </Grid>
                <Grid container spacing={5} >
                    <Grid item>
                    <TextField id="stono" label="STO"  InputLabelProps={{ required: true}} variant="outlined" value={getStoNo} onInput={e => setStoNo(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{marginLeft:"30px"}}>
                    <TextField id="document" label="Document"  InputLabelProps={{ required: true}} variant="outlined" value={getDocument} onInput={e => setDocument(e.target.value)}/>
                  </Grid>
                  <Grid item style={{marginLeft:"30px"}} >
                    {getOneGroup ?  <TextField id="net" InputLabelProps={{ required: true}} value={getOneGroup} onInput={e => setOneGroup(e.target.value)}label="Compound"variant="outlined"  
                    /> :
                    <FormControl variant="outlined"  className={classes.formControl} >
                      <InputLabel ref={inputGroup}    InputLabelProps={{ required: true}} id="demo-simple-select-outlined-label"> Material Name  </InputLabel>
                      <Select labelId="demo-simple-select-outlined-label" id="group" onChange={handleGroup} labelWidth={labelGroup}>
                      {getGroup.map(item => ( 
                        <option key={item.value} value={item.value} >
                       {item.label} </option> ))} 
                       </Select>
                    </FormControl> }
                    </Grid>
                  </Grid>
                  <Grid container spacing={5}>
                   
                    <Grid item> 
                     {getRead == 'Manual' ?  
                      <TextField  type="number" id="gross" label="Gross wt"  InputLabelProps={{ required: true}} variant="outlined" value={getGross} onInput={e => setGross(e.target.value)}/>  :
                      <TextField  disabled style={{width:"165px"}} type="number" id="gross" label="Gross wt"  InputLabelProps={{ required: true}} variant="outlined" value={getGross} onInput={e => setGross(e.target.value)}/> }
                    </Grid>
                    {getRead == 'Manual'  ? null :
                    <Grid item>  
                      <Avatar onClick={() => fetchWeight('gross')}  style={{backgroundColor:"#b30059",marginTop:"10px",cursor:"pointer",marginLeft:"-20px"}}><SendIcon/></Avatar>
                    </Grid>}
                    {getRead == 'Manual' ? 
                    <Grid item style={{marginLeft:"28px"}}  >
                      {getGrossWt && getRead == 'Manual'? 
                       <TextField  type="number" id="tare" InputLabelProps={{ required: true}} label="Tare wt" variant="outlined"
                       value={getTare} onInput={e => setTare(e.target.value)}/> : <TextField  type="number" id="tare" disabled InputLabelProps={{ required: true}} label="Tare wt" variant="outlined"
                       value={getTare} onInput={e => setTare(e.target.value)}/>}
                     </Grid> :
                       <Grid item style={{marginLeft:"26px"}} >
                      {getGross && getRead == 'Auto'? 
                       <TextField type="number" disabled style={{width:"165px"}} id="tare" InputLabelProps={{ required: true}} label="Tare wt" variant="outlined"
                       value={getTare} onInput={e => setTare(e.target.value)}/> : <TextField  type="number" id="tare" disabled InputLabelProps={{ required: true}} label="Tare wt" variant="outlined"
                       value={getTare} onInput={e => setTare(e.target.value)}/>}
                     </Grid> }
                     {getRead == 'Manual' ? null :
                     <Grid item>  
                     {getRead == 'Auto' && getGross == '' ? null : 
                      <Avatar onClick={() => fetchWeight('tare')} style={{backgroundColor:"#b30059",marginTop:"10px",cursor:"pointer",marginLeft:"-20px"}}><SendIcon/></Avatar> }
                    </Grid>}
                    {getRead == 'Manual' ? 
                     <Grid item >
                       <TextField  style={{marginLeft:"32px"}} id="net" disabled InputLabelProps={{ required: true}} value={getGross - getTare} onInput={e => setNet(e.target.value)}label="Net Wt"variant="outlined"   />
                     </Grid> :
                     <Grid item >
                       {getRead == 'Auto' && getGross == '' ?   <TextField id="net" style={{marginLeft:"-7px"}} disabled InputLabelProps={{ required: true}} value={getGross - getTare} onInput={e => setNet(e.target.value)}label="Net Wt"variant="outlined"   /> : 
                       <TextField id="net" disabled InputLabelProps={{ required: true}} style={{marginLeft:"28px"}} value={getGross - getTare} onInput={e => setNet(e.target.value)}label="Net Wt"variant="outlined"   />}
                     </Grid>}
                  </Grid>
                  <Grid container justify="center"  style={{ marginTop:30}} >
                   <Grid item>
                      <Button variant="contained" onClick={Actionhelper.clearBtn('weighbridge')}  style={{ borderRadius:"20px",marginLeft:25,textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
                   </Grid>
                   <Grid item >
                    <Button variant="contained" onClick={submitHandler}  color="primary" style={{borderRadius:"20px", marginLeft:25,backgroundColor:"green",textTransform:" capitalize"}}>
                    Submit
                    </Button>
                   </Grid>
                   <Grid item>
                    <Button variant="contained" onClick={Actionhelper.exitBtn()}  style={{ borderRadius:"20px",backgroundColor:"#8585ad",marginLeft:25,textTransform:" capitalize"}}>
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


