import React from 'react';
import axios from 'axios';
import {makeStyles,withStyles,InputLabel,Select,Grid,Button,Card,CardContent,Typography,TextField,
Radio,RadioGroup,FormControlLabel,Dialog,IconButton,Backdrop,CircularProgress} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import { Table} from 'react-bootstrap';
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Datehelper from './utlis/Datehelper'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

  const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: "100px",
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function FactoryRegistration() {
  const classes = useStyles();
  const moment = require("moment");
  const [getDocument, setDocument] = useState('');
  const [documentdate, setdocumentdate] = useState(Datehelper.displayDate());
  const [getSto, setSto] = useState('');
  const [getTruck, setTruck] = useState('');
  const [getFromPlant, setFromPlant] = useState('');
  const [getTransportName, setTransportName] = useState('');
  const [getDriverName, setDriverName] = useState('');
  const [getDriverPhone, setDriverPhone] = useState('');
  const [getGross, setGross] = React.useState('');
  const [getTare, setTare] = useState('');
  const [getTruckType, setTruckType] = useState('');
  const [getTripType, setTripType] = useState('');
  const [showSpinner, setSpinner] = React.useState(false);
  const [getDtlData,setDtlData] = React.useState([])
  const [showColspan, setColspan] = React.useState(true);
  const [getMatGroupNames,setMatGroupNames] = React.useState([])
  const [showTable,setTable] = React.useState(false)
  const [showSubmit,setSubmit] = React.useState(false)
  const [getDbValue, setDbValue] = React.useState('dglosm');
  const [getTrucknetWt, setTrucknetWt] = React.useState('');
  const [getStoDate, setStoDate] = React.useState('');
  const [getFromStrLoc, setFromStrLoc] = React.useState('');
  const [getDriverLicense, setDriverLicense] = React.useState('');
  const [getTotalTareWt, setTotalTareWt] = React.useState('');
  const [getTotalMatWt, setTotalMatWt] = React.useState('');
  const [getEwayBill, setEwayBill] = React.useState('');
  const [getTotal, setTotal] = React.useState();
  const [getNoofBundles, setNoofBundles] = React.useState();
  const [getLogPlant, setLogPlant] = React.useState();
  const [getLogLoc, setLogLoc] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [showTransport, setTransport] = React.useState(false);
  const [lfRfidError, setRfidErrror] = React.useState([]);
  const [getWeighment, setWeighment] = React.useState([]);
  const [getLfRfidSuccess, setRfidSuccess] = React.useState(false);
  const [getVendor, setVendor] = React.useState();
  const [getTruckRoute, setTruckRoute] = React.useState();
  const headerArray = ["Material Group","Unloading Plant","Unloading Location","Weighment","LFrfid"]
   const [getToken, setToken] = useState('');
  React.useEffect(() => {
    let user = localStorage.getItem('empcode');
    let loginplant = localStorage.getItem('plant')
    let loginloc = localStorage.getItem('str_loc')
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setLogPlant(loginplant)
    setLogLoc(loginloc)
  });

  const handleClose = () => {
    setOpen(false);
  };

  const radioChange = (event) => {
    setDbValue(event.target.value);
    if (getDbValue == 'dglosm' || getDbValue == 'dglrmwh'){
      setTable(false)
      setTransport(false)
      setSto('')
      setDocument('')
    }
  };

  const fetchStoObject = event => {
   setSpinner(true)
   setColspan(true)
   setTable(false)
   let api_url 
   if (getDbValue == 'dglosm'){
    api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/fetch_sto_dtls?sto=${getSto}`
   }
   else{
    api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/fetch_sto_dtls?sto=${getSto}`
   }
	  axios({
    method: 'get',
   headers: {
  'Authorization': getToken
  },
    url:api_url ,

    })
    .then(response =>{
    	if (response.status == 200)
    	{
    	setTruck(response.data.sto_object['truck_no'])
			setFromPlant(response.data.sto_object['plant'])
		  setFromStrLoc(response.data.sto_object['str_loc'])
			setTransportName(response.data.sto_object['transport_vendor'])
			setDriverName(response.data.sto_object['driver_name'])
			setDriverPhone(response.data.sto_object['driver_phone'])
			setGross(response.data.sto_object['total_truck_wt'])
			setTare(response.data.sto_object['empty_truck_wt'])
			setTruckType(response.data.sto_object['truck_type'])
			setTripType(response.data.sto_object['trip_type'])
			setTrucknetWt(response.data.sto_object['truck_net_wt'])
			setStoDate(response.data.sto_object['sto_date'])
			setDriverLicense(response.data.sto_object['driver_license'])
			setTotalTareWt(response.data.sto_object['total_tare_wt'])
      setEwayBill(response.data.sto_object['ewaybil'])
		  setTotalMatWt(response.data.sto_object['total_mat_wt'])
			fetchMatGroup(response.data.mat_group_names,response.data.issue_dtls);
      console.log(response.data.issue_dtls)
      fetchStoList(response.data.sto_object['sto_no']);
      setVendor(response.data.sto_object['vendor'])
      setTruckRoute(response.data.sto_object['truck_route'])
      let quantity = response.data.issue_dtls
      let total_qty = 0
      let totalbundles = 0
      quantity.map((item) => {
        total_qty +=parseFloat(item.trns_net_wt)
        if (item.bundle_qty == null){
           totalbundles +=1.0
        }
        else{
          totalbundles +=parseFloat(item.bundle_qty)
        }
        return total_qty,totalbundles
       });
      let total_value = (total_qty).toFixed(3);
      let to_bundles = (totalbundles).toFixed(3);
      setNoofBundles(to_bundles)
      setTotal(total_value)
			setColspan(false)
			setTable(true)
    	} 
    })
    .catch(error => {
      setSpinner(false)
      ToastsStore.error(Helper.NO_RECORDS)
    })
  };


  const fetchMatGroup = (matgroup,dtldatas) => {
    let api_url 
     if (getDbValue == 'dglosm'){
      api_url = process.env.REACT_APP_RECEIPT_URL+`matgroup_unload_dtls/fetch_list`
     }
     else{
      api_url = process.env.REACT_APP_RECEIPT_URL+`matgroup_unload_dtls/fetch_list_warehouse`
     }
    	setSpinner(true)
  	  setColspan(false)
  	  setTable(false)
  	  axios({
      method: 'post',
      headers: {
      'Authorization': getToken
      },
      url: api_url,
      data:{"data":matgroup}
      })
    .then(response =>{
    	if (response.status == 200)
    	{
        setTransport(true)
    		setSpinner(false)
			  setColspan(false)
			  setTable(true)
        let items = response.data
        items.map((item) => {
        item.input = ''
        return item;
       });
       items.map((item) => {
       if (item.lfrfid_tag !=''){
        item.input = item.lfrfid_tag         
       } 
       if(item.flag == 'Without weighment'){
        setWeighment(item)
       } 
       });
    		setMatGroupNames(items);
        setDtlData(dtldatas)
    	} 
    })
    .catch(error => {
    })
  };

  const fetchStoList = (sto) =>{
    setSpinner(true)
    axios({
    method: 'get',
     headers: {
    'Authorization': getToken
    },
    url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_sto?sto=${getSto}`
    })
    .then(response =>{
      if(response.status == 200){
        setDocument(response.data.gate_entry_docno)
        setSpinner(false)  
        if (response.data.action_status == 'open-n'){  
          setSubmit(true)
        }
        else{
          setSubmit(false)
        }
      } 
    })
    .catch(error => {
      setSpinner(false)
    })
  }

  const saveHandler = event =>{
    let user = localStorage.getItem('empcode');
    let mapList = getMatGroupNames
    mapList.map((item) => {
      if (item.flag == 'With weighment') {
        if (item.input == '' || item.input == null || item.input == 'undefined'){
          setRfidErrror(item)
          ToastsStore.error("Rfid tag is empty")
        }
      }
      else{
        setRfidSuccess(true)
      }
     });
      if(getLfRfidSuccess == false && getWeighment == ''){
        ToastsStore.error("Rfid tag is empty")
      }
      else{
        setSpinner(true)
        axios.post(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs`, {
			  documentdate,getSto,getEwayBill,getDbValue,getLogLoc,getLogPlant,getTruck,getTripType,getFromPlant,getTransportName,
			  getDriverName,getDriverPhone,getGross,getTare,getTruckType,getStoDate,getFromStrLoc,getDriverLicense,getTrucknetWt,
			  getTotalTareWt,getTotalMatWt,getVendor,getTruckRoute,getMatGroupNames,user,getDtlData
        },{headers:{'Authorization': getToken}})
        .then(response =>{
        	if(response.status == 200){
            updateTime();
        		setSpinner(false)
        		setDocument(response.data)
            setSubmit(true)
        	} 
        })
        .catch(error => {
        	setSpinner(false)
         	ToastsStore.error("Not saved")
        })
      }  
    }

    const updateTime = () => {
      let api_url 
       if (getDbValue == 'dglosm'){
        api_url = process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/updatevehicle_time`
       }
       else{
        api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/updatevehicle_time`

       }
        setSpinner(true)
        axios({
        method: 'patch',
        headers: {
        'Authorization': getToken
        },
        url: api_url,
        data:{"sto_no":getSto}
        })
      .then(response =>{
        if (response.status == 200)
        {
          ToastsStore.success("Saved successfully")
          setSpinner(false)
        } 
      })
      .catch(error => {
        console.log(error)
      })
    };

  const submitHandler = event =>{
    setSpinner(true)
    axios.patch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/update_status`, {
      getSto},{headers:{'Authorization': getToken}
    })
    .then(response =>{
    	if(response.status == 200){
        actionUpdate();
    		setSpinner(false)
        ToastsStore.success("Submited successfully")
        setSubmit(false)
        window.location.href = '/factory_registration'
    	 
    	} 
    })
    .catch(error => {
    	setSpinner(false)
      ToastsStore.error("Not updated")
    })
  }

  const actionUpdate = event =>{
    let api_url 
     if (getDbValue == 'dglosm'){
      api_url =  process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/update_action_status`
     }
     else{
      api_url = process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_action_status`
     }
      setSpinner(true)
      axios({
      method: 'patch',
      headers: {
      'Authorization': getToken
      },
      url: api_url,
      data:{"sto":getSto}
      })
    .then(response =>{
      if(response.status == 200){
        setSpinner(false)          
      } 
    })
    .catch(error => {
      setSpinner(false)
    })
  }

  const ChangeHandler = (s,e) =>{ 
    setRfidSuccess(true)
    let list = Object.assign([],getMatGroupNames);
    let mapList = list.map((item) => {
      if (item.id === s.id) {
        item.input = e.target.value 
      }
    });
   setMatGroupNames(list)   
  }

  const fetchtransport =  (event) =>{ 
    setOpen(true)
  }

  return (  
    <div>
    {open ?
      <Dialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle style={{color:"#3f51b5"}}id="customized-dialog-title" onClose={handleClose}>
          Transport
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={5} >
            <Grid item style={{marginLeft:"30px"}} >
             <TextField id="truck" label="Truck"  InputLabelProps={{ required: true}} variant="outlined" value={getTruck} onInput={e => setTruck(e.target.value)}/>
            </Grid>
            <Grid item  >
              <TextField id="transportname" label="Transport Name"  InputLabelProps={{ required: true}} variant="outlined" value={getTransportName} onInput={e => setTransportName(e.target.value)}/>        
            </Grid>
            <Grid item>
               <TextField id="drivername" InputLabelProps={{ required: true}} label="Driver Name" variant="outlined"
              value={getDriverName} onInput={e => setDriverName(e.target.value)}/>           
            </Grid>
          </Grid>
          <Grid container spacing={5} >
            <Grid item  style={{marginLeft:"30px"}} >
              <TextField id="driverphone" InputLabelProps={{ required: true}} value={getDriverPhone} onInput={e => setDriverPhone(e.target.value)}label="Driver Phone"variant="outlined"  />          
            </Grid>
            <Grid item>
             <TextField id="trucktype" InputLabelProps={{ required: true}} label="Truck Type" variant="outlined"
              value={getTruckType} onInput={e => setTruckType(e.target.value)}/>       
            </Grid>
            <Grid item  >
              <TextField id="gross" InputLabelProps={{ required: true}} label="Gross Wt in Kg" variant="outlined"
              value={getGross} onInput={e => setGross(e.target.value)}/> 
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item style={{marginLeft:"30px"}}>
              <TextField id="tare"  InputLabelProps={{ required: true}}value={getTare} onInput={e => setTare(e.target.value)}label="Tare Wt in Kg"variant="outlined"  />               
            </Grid>
            <Grid item  >
              <TextField id="triptype" InputLabelProps={{ required: true}} value={getTripType} onInput={e => setTripType(e.target.value)}label="Trip Type" variant="outlined"  />                                
            </Grid>
            <Grid item >
             <TextField id="fromplant" label="From Plant"  InputLabelProps={{ required: true}} variant="outlined" value={getFromPlant} onInput={e => setFromPlant(e.target.value)}/>
            </Grid>
          </Grid>
          <Grid container spacing={5} >
            <Grid item style={{marginLeft:"30px"}} >
             {getDbValue == 'dglrmwh'?
              <TextField id="ewaybill" label="E-WayBill Ref"  InputLabelProps={{ required: true}} variant="outlined" value={getEwayBill} onInput={e => setEwayBill(e.target.value)}/> 
                : null  }         
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> : null}
      <Sidebar name={Helper.FACTORY_SIDEBAR_NAME}/>
        <form  noValidate autoComplete="off">
          <Grid container justify="center" className="mainContainer" spacing={0} direction="column" alignItems="center" >
            <Grid item  >
              <Card style={{marginLeft:"80px"}}  elevation={20}>
                <CardContent  style={{ marginLeft:"30px",marginRight:"30px",marginBottom:"10px",marginTop:"-5px" }}> 
                  <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                     <Backdrop className={classes.backdrop} open={showSpinner}>
                      <CircularProgress color="primary" />
                     </Backdrop>
        	            <Grid container spacing={5} >
        	              <Grid item>
        	               <RadioGroup row aria-label="position" name="position" defaultValue="top"  value={getDbValue} onChange={radioChange}>
        	                <FormControlLabel value="dglosm" control={<Radio color="primary" />} label="Osm" />
        	                <FormControlLabel value="dglrmwh" control={<Radio color="primary" />} label="Warehouse" />
                         </RadioGroup>
        	              </Grid>
        	            </Grid>
                      <Grid container spacing={5} >
                        <Grid item>
        	                <TextField id="document" label="Document" InputLabelProps={{ required: true}}   value={getDocument} onInput={e => setDocument(e.target.value)}  variant="outlined"    />  
                        </Grid>
                        <Grid item style={{marginLeft:"30px"}} >
                          <TextField id="documentdate" label="Document Date" InputLabelProps={{ required: true}}   value={documentdate} onInput={e => setdocumentdate(e.target.value)}  variant="outlined"   />     
                        </Grid>
                        <Grid item style={{marginLeft:"30px"}}  >
                          <TextField id="sto" label="STO"  InputLabelProps={{ required: true}} variant="outlined" value={getSto} onInput={e => setSto(e.target.value)}/>
                          <Button variant="contained" color="primary"  onClick={fetchStoObject}    style={{borderRadius:"20px", backgroundColor:"#b30059",marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                           Display
                          </Button>
                            {showTransport ?
                           <Button variant="contained" color="primary" onClick={fetchtransport}    style={{borderRadius:"20px", marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                           Transport
                          </Button> : null }
                        </Grid>
                      </Grid>
                    {showTable ? 
                    <Table id="Table" striped bordered hover style={{marginTop:"30px"}}>
                      <thead>
                        <tr style={{  backgroundColor:"#3f51b5" }} >
                        {headerArray.map((row) => (<th  style={{border: "1px solid black",color:"white"}}>{row}</th> ))}
                        </tr>
                        { showColspan ?
                        <tr id="items">
                          <th colSpan="4" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
                        </tr>: null}
                      </thead>
                      {getMatGroupNames.map((s) => (
                      <tbody style={{ border: "1px solid black" }}>             
                        <tr  >
                          <td   style={{ border: "1px solid black" }}>{s.matgroup}</td>
                          <td  style={{ border: "1px solid black" }}>{s.unplant}</td>
                          <td  style={{ border: "1px solid black" }}>{s.unloc}</td>
                          <td  style={{ border: "1px solid black" }}>{s.flag }</td>
                          {s.flag == 'With weighment' ?
                          <td  style={{ border: "1px solid black" }}><input type="text"   className="form-control"  onChange={(e) => ChangeHandler(s, e)} name={s.id} value={s.input} /></td>
                           :  <td  style={{ border: "1px solid black" }}></td>}
                           <td hidden style={{ border: "1px solid black" }}>{s.typew }</td>
                        </tr>
                      </tbody>
                        ))}
                    </Table> : null}
                    {showTable ?
                    <Table id="Table" striped bordered hover style={{marginTop:"30px"}}>
                      <thead>
                        <tr style={{  backgroundColor:"#3f51b5" }} >
                          <th  style={{ border: "1px solid black",color:"white" }}>Mat Group Name</th>
                          <th  style={{ border: "1px solid black",color:"white" }}>Material Code</th>
                          <th  style={{ border: "1px solid black",color:"white" }}>Description</th>
                          <th  style={{ border: "1px solid black",color:"white" }}>Vendor Batch</th>
                          <th  style={{ border: "1px solid black",color:"white" }}>Sap Batch</th> 
                          {getDbValue == "warehouse" ?                       
                          <th  style={{ border: "1px solid black",color:"white" }}>Nos(Bundles)</th> : null }
                           {getDbValue == "warehouse" ?  
                           <th  style={{ border: "1px solid black",color:"white" }}>Bundle Std Wt</th> :  null }    
                          <th  style={{ border: "1px solid black",color:"white" }}>Qty</th>
                        </tr>
                         { showColspan ? 
                        <tr id="items">
                          <th colSpan="8" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
                        </tr> : null}
                      </thead>
                      {getDtlData.map((s) => (
                      <tbody style={{ border: "1px solid black" }}>             
                        <tr  >
                          <td  style={{ border: "1px solid black" }}>{s.mat_group_name}</td>
                          <td  style={{ border: "1px solid black" }}>{s.mat_code}</td>
                          <td  style={{ border: "1px solid black" }}>{s.mat_desc}</td>
                          <td  style={{ border: "1px solid black" }}>{s.mat_batch}</td>
                          <td   style={{ border: "1px solid black" }}>{s.charg}</td>
                          {getDbValue == 'warehouse' ?
                          <td  style={{ border: "1px solid black" }}>{s.bundle_qty == null ?  1.0 : s.bundle_qty}</td> : null }
                          {getDbValue == 'warehouse' ?
                          <td   style={{ border: "1px solid black" }}>{s.std_wt}</td> : null}
                          <td  style={{ border: "1px solid black" }}>{s.trns_net_wt} {s.mat_uom}</td>
                        </tr>
                      </tbody>
                        ))}
                        <tr>
                        <td  rowSpan="8" style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        {getDbValue == 'warehouse' ?
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td> : null }
                        {getDbValue == 'warehouse' ?
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold' }}>{getNoofBundles}</td> : null}
                        <td rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold'}}>Total:</td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold' }}>{getTotal}</td>
                        </tr>
                    </Table> :  null }
                    <Grid container justify="center"  style={{ marginTop:30}} >
                      <Grid item>
                        <Button variant="contained" onClick={saveHandler}  color="primary" style={{borderRadius:"20px", marginLeft:25,textTransform:" capitalize"}} >
                          Save
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained"  onClick={Actionhelper.clearBtn('factory_registration')}  style={{borderRadius:"20px", marginLeft:25,textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
                      </Grid>
                      {showSubmit ?
                      <Grid item >
                        <Button variant="contained" onClick={submitHandler} color="primary" style={{borderRadius:"20px", marginLeft:25,backgroundColor:"green",textTransform:" capitalize"}}>
                          Submit
                        </Button>
                      </Grid>: null }
                      <Grid item>
                        <Button variant="contained"  onClick={Actionhelper.exitBtn()}  style={{borderRadius:"20px",backgroundColor:"#8585ad", marginLeft:25,textTransform:" capitalize"}}>
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


