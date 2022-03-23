import React from 'react';
import axios from 'axios';
import { makeStyles,withStyles,InputLabel,TextField,Grid,Button,Card,CardContent,Typography,Dialog,IconButton,Backdrop,CircularProgress } from '@material-ui/core';
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

export default function Grnprocess() {
  const classes = useStyles();
  const moment = require("moment");
  const [getDocument, setDocument] = useState('');
  const [getDocumentDate, setDocumentDate] = useState((Datehelper.displayDate()))
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
  const [getMatgroupNames,setMatgroupNames] = React.useState([])
  const [showTable,setTable] = React.useState(false)
  const [getTruckNetWt, setTruckNetWt] = React.useState('');
  const [getStoDate, setStoDate] = React.useState('');
  const [getFromStrLoc, setFromStrLoc] = React.useState('');
  const [getDriverLicense, setDriverLicense] = React.useState('');
  const [getTotalTareWt, setTotalTareWt] = React.useState('');
  const [getTotalMatWt, setTotalMatWt] = React.useState('');
  const [getEwayBill, setEwayBill] = React.useState('');
  const [getDbName, setDbName] = React.useState('');
  const [getBundles, setBundles] = React.useState();
  const [getNetWt, setNetWt] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [getNoofBundles, setNoofBundles] = React.useState();
  const [showTransport, setTransport] = React.useState(false);
   const [getToken, setToken] = useState('');
  const headerArray = ["Material Group","Unloading Plant","Unloading Location","Weighment","LFrfid"]

    React.useEffect(() => {
      let user = localStorage.getItem('empcode');
      let dbvalue = localStorage.getItem('db');
      let headers = localStorage.getItem('headers');
      setToken(headers)
      setDbName(dbvalue)
    });

    const handleClose = () => {
      setOpen(false);
    };

    const fetchStoObject = event => {
     setSpinner(true)
     setColspan(true)
     setTable(false)
  	  axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_sto_dtls?sto=${getSto}` ,
      })
      .then(response =>{
      	if (response.status == 200)
      	{
      		setDocument(response.data.sto_object[0]['gate_entry_docno'])
      	  setTruck(response.data.sto_object[0]['truck_no'])
  		  	setFromPlant(response.data.sto_object[0]['plant'])
  		    setFromStrLoc(response.data.sto_object[0]['str_loc'])
  			  setTransportName(response.data.sto_object[0]['transport_vendor'])
    			setDriverName(response.data.sto_object[0]['driver_name'])
    			setDriverPhone(response.data.sto_object[0]['driver_phone'])
    			setGross(response.data.sto_object[0]['total_truck_wt'])
    			setTare(response.data.sto_object[0]['empty_truck_wt'])
    			setTruckType(response.data.sto_object[0]['truck_type'])
    			setTripType(response.data.sto_object[0]['trip_type'])
    			setTruckNetWt(response.data.sto_object[0]['truck_net_wt'])
    			setStoDate(response.data.sto_object[0]['sto_date'])
    			setDriverLicense(response.data.sto_object[0]['driver_license'])
    			setTotalTareWt(response.data.sto_object[0]['total_tare_wt'])
	        setEwayBill(response.data.sto_object[0]['ewaybil'])
	  		  setTotalMatWt(response.data.sto_object[0]['total_mat_wt'])
  	  		setFromPlant(response.data.sto_object[0]['from_plant'])
  	  		setMatgroupNames(response.data.sto_object)
  	  		setDtlData(response.data.sto_dtls)
  	  		setTransport(true)
  		    setColspan(false)
  		    setTable(true)
  		    setSpinner(false)
		      let dtls = response.data.sto_dtls
	        let totalbundles = 0
	        let bundlesqt = 0
	        let netwt = 0
	        dtls.map((item) => {
	          if (item.sto_bundle_qty == '' || item.sto_bundle_qty == null){
	             totalbundles +=1.0
	          }
	          else{
	            totalbundles +=parseFloat(item.sto_bundle_qty)
	          }
	          bundlesqt +=parseFloat(item.rec_bundle_qty)
	          netwt +=parseFloat(item.rec_net_wt)
	          return totalbundles,bundlesqt,netwt
	         });
	        let to_bundles = (totalbundles).toFixed(3);
	        let net = (netwt).toFixed(3);
	        setNoofBundles(to_bundles)
	        setBundles(bundlesqt)
	        setNetWt(net)
	      	} 
      })
      .catch(error => {
        setSpinner(false)
        ToastsStore.error("No records found for this Sto")
      })
    };

    const submitHandler = event =>{
      setSpinner(true)
      axios.patch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/update_grn_status`, {
        getSto
      },{headers:{'Authorization': getToken}})
      .then(response =>{
      	if(response.status == 200){
          setSpinner(false) 
          truckStatus();   	 
      	} 
        if (response.status == 201)
        {
          setSpinner(false)
          ToastsStore.success("Tare Wt is empty")
        } 
        })
        .catch(error => {
        	setSpinner(false)
          ToastsStore.error("Not updated")
      })
    }

    const fetchTransport =  (event) =>{ 
      setOpen(true)
    }

    const truckStatus = event =>{
      setSpinner(true)
      axios({
        method: 'patch',
        headers: {
        'Authorization': getToken
        },
        url:  process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_truck_status`,
        data:{"sto_no":getSto}
        })
        .then(response =>{
          if (response.status == 200)
          {
            setSpinner(false)
            ToastsStore.success("Submited successfully")
            window.location.href = '/grnprocess'
          } 
        })
        .catch(error => {
      })
    };

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
              <TextField id="transportname" label="Transport Name"  InputLabelProps={{ required: true}} variant="outlined" value={getTransportName} onInput={e => setTransportName(e.target.value)} />        
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
              <TextField id="tare"  InputLabelProps={{ required: true}}value={getTare} onInput={e => setTare(e.target.value)}label="Tare Wt in Kg"variant="outlined"  
                />               
            </Grid>
            <Grid item  >
              <TextField id="triptype" InputLabelProps={{ required: true}} value={getTripType} onInput={e => setTripType(e.target.value)}label="Trip Type" variant="outlined"  
            />                                
            </Grid>
            <Grid item >
             <TextField id="fromplant" label="From Plant"  InputLabelProps={{ required: true}} variant="outlined" value={getFromPlant} onInput={e => setFromPlant(e.target.value)}/>        
            </Grid>
          </Grid>
          <Grid container spacing={5} >
            <Grid item style={{marginLeft:"30px"}} >
                <TextField id="ewaybill" label="E-WayBill Ref"  InputLabelProps={{ required: true}} variant="outlined" value={getEwayBill} onInput={e => setEwayBill(e.target.value)}/>          
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> : null}
      <Sidebar name={Helper.GRN_SIDEBAR_NAME}/>
        <form  noValidate autoComplete="off">
          <Grid container justify="center" className="mainContainer" spacing={0} direction="column" alignItems="center" >
            <Grid item  >
              <Card style={{marginLeft:"120px",marginBottom:"80px",marginRight:"40px"}}  elevation={20}>
                <CardContent  style={{ marginLeft:"30px",marginRight:"30px",marginBottom:"10px",marginTop:"30px" }}> 
                  <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                    <Backdrop className={classes.backdrop} open={showSpinner}>
                      <CircularProgress color="primary" />
                    </Backdrop>
                      <Grid container spacing={5} >
                        <Grid item>
        	                <TextField id="document" label="Document" InputLabelProps={{ required: true}}   value={getDocument} onInput={e => setDocument(e.target.value)}  variant="outlined"   />  
                        </Grid>
                        <Grid item style={{marginLeft:"5px"}} >
                          <TextField id="documentdate" label="Document Date" InputLabelProps={{ required: true}}   value={getDocumentDate} onInput={e => setDocumentDate(e.target.value)}  variant="outlined"   />     
                        </Grid>
                        <Grid item style={{marginLeft:"5px"}}  >
                          <TextField id="sto" label="STO"  InputLabelProps={{ required: true}} variant="outlined" value={getSto} onInput={e => setSto(e.target.value)}/>
                          <Button variant="contained" color="primary"  onClick={fetchStoObject}    style={{borderRadius:"20px", backgroundColor:"#b30059",marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                           Display
                          </Button>
                          {showTransport ?
                           <Button variant="contained" color="primary" onClick={fetchTransport}    style={{borderRadius:"20px", marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                           Transport
                          </Button> : null }
                        </Grid>
                      </Grid>      
                    {showTable ? 
                    <Table id="Table" striped bordered hover style={{marginTop:"30px"}}>
                      <thead>
                        <tr style={{  backgroundColor:"#3f51b5" }} >
                          {headerArray.map((row) => (<th  style={{border: "1px solid black",color:"white"}}>{row}</th>))}
                        </tr>
                        { showColspan ?
                        <tr id="items">
                          <th colSpan="4" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
                        </tr>: null}
                      </thead>
                      {getMatgroupNames.map((s) => (
                      <tbody style={{ border: "1px solid black" }}>             
                        <tr  >
                          <td   style={{ border: "1px solid black" }}>{s.mat_group_name}</td>
                          <td  style={{ border: "1px solid black" }}>{s.unload_plant}</td>
                          <td  style={{ border: "1px solid black" }}>{s.unload_str_loc}</td>
                          <td  style={{ border: "1px solid black" }}>{s.weighment_flag }</td>
                          <td  style={{ border: "1px solid black" }}>{s.lfrfid_tag}</td>
                           <td hidden style={{ border: "1px solid black" }}>{s.weighment_type }</td>
                        </tr>
                      </tbody>
                        ))
                        }
                    </Table> : null}
                    {showTable ?
                    <Table id="Table" striped bordered hover style={{marginTop:"30px"}}>
                      <thead>
                        <tr style={{  backgroundColor:"#3f51b5" }} >
                           <th  style={{ border: "1px solid black",color:"white",textAlign:"center",paddingBottom:"20px" }}>Code</th>
                         
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center",paddingBottom:"20px" }}>Description</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Vendor Batch</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center",paddingBottom:"20px" }}>Sap Batch</th>                      
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Nos (Bundles)</th> 
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Bundle Std Wt</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>STO Net Wt</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Nos (Bundles)</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Net Wt</th>
                          <th  style={{ border: "1px solid black",color:"white",textAlign:"center" }}>Diff. Wt</th>
                        </tr>
                         { showColspan ? 
                        <tr id="items">
                          <th colSpan="8" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
                        </tr> : null}
                      </thead>
                      {getDtlData.map((s) => (
                      <tbody style={{ border: "1px solid black" }}>             
                        <tr>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px" }}>{s.mat_code}</td>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px" }}>{s.mat_desc}</td>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px" }}>{s.mat_batch}</td>
                          <td   style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px"}}>{s.sap_batch}</td>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px"}}>{s.sto_bundle_qty ? s.sto_bundle_qty : 1}</td>
                          <td   style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px"}}>{s.std_wt}</td>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px"}}>{s.sto_net_wt} {s.mat_uom}</td>
                          <td  style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px" }}>{s.rec_bundle_qty}</td>
                          <td   style={{ border: "1px solid black",textAlign:"center",paddingTop:"28px" }}>{s.rec_net_wt}</td>
                          {s.rec_diff_wt < 0 ?
                          <td  style={{ border: "1px solid black" ,textAlign:"center",paddingTop:"28px",color:"red" }}>{s.rec_diff_wt}</td> : 
                          <td  style={{ border: "1px solid black" ,textAlign:"center",paddingTop:"28px" ,color:"blue"}}>{s.rec_diff_wt}</td> }
                        </tr>
                      </tbody>
                        ))
                        }
                        <tr>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black" }}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold',textAlign:"center"}}>Total:</td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold',textAlign:"center"}}>{getNoofBundles}</td>
                        <td rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold'}}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold',textAlign:"center"}}></td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold' ,textAlign:"center"}}>{getBundles}</td>
                        <td rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold',textAlign:"center"}}>{getNetWt}</td>
                        <td  rowSpan="8"  style={{ border: "1px solid black",fontWeight:'bold' }}></td>
                        </tr>
                    </Table> :  null }
        	          <Grid container justify="center"  style={{ marginTop:30}} >
        	            <Grid item>
        	              <Button variant="contained" onClick={submitHandler}  color="primary" style={{borderRadius:"20px", marginLeft:25,textTransform:" capitalize",backgroundColor:"green"}} >
        	                Submit
        	              </Button>
        	            </Grid>
        	            <Grid item>
        	              <Button variant="contained" onClick={Actionhelper.clearBtn('grnprocess')} style={{borderRadius:"20px", marginLeft:25,textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
        	            </Grid>
        	            <Grid item>
        	              <Button variant="contained" onClick={Actionhelper.exitBtn()}   style={{borderRadius:"20px",backgroundColor:"#8585ad", marginLeft:25,textTransform:" capitalize"}}>
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


