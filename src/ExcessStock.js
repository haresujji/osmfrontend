import React from 'react';
import axios from 'axios';
import {InputLabel,TextField,Grid,Button,Card,CardContent,Typography,Backdrop,CircularProgress,withStyles,makeStyles,Dialog,
IconButton,Icon,Fab,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Tooltip} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import { Tables} from 'react-bootstrap';
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import { loadCSS } from 'fg-loadcss';
import HelpIcon from '@material-ui/icons/Help';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Datehelper from './utlis/Datehelper'
import Actionhelper from './utlis/Actionhelper'
import Helper from './utlis/Helper'
import Stylehelper from './utlis/Stylehelper'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) =>({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function ExcessStock() {
  const classes = useStyles();
	var moment = require("moment");
  const [getSelectedDate, setSelectedDate] = React.useState(Datehelper.displayDate());
  const [getToSelectedDate, setToselecteDate] = React.useState(Datehelper.displayDate());
  const [getPlant, setPlant] = useState('');
  const [getDbname, setDbname] = useState('');
  const [showColspansap, setColspansap] = React.useState(true);
  const [showTable,setTable] = React.useState(false)
  const [getLoc, setLoc] = useState('');
  const [showSpinner, setSpinner] = React.useState(false);
  const [getHdrsList,setHdrsList] = React.useState([])
  const [getSapBatchList,setSapBatchList] = React.useState([])
  const [getOpen, setOpen] = React.useState(false);
  const [showSubmit, setSubmit] = React.useState(false);
  const [showPagination, setPagination] = React.useState(false);
  const [getPageCount, setPageCount] = useState('');
  const [getPage, setPage] = React.useState(1);
  const [getSearchInput, setSearchInput] = useState('');
   const [getToken, setToken] = useState('');
  const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    '& h6': { color: 'blue' },
  },
  closeButton: {
    position: 'absolute',
    marginLeft:"80px",
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
        <IconButton style={{marginLeft:"500px"}} aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width:"430px",

  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: "0px",
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

  React.useEffect(() => {
    let user_plant = localStorage.getItem('plant');
    let user_loc = localStorage.getItem('str_loc');
    let dbname = localStorage.getItem('db');
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setDbname(dbname)
    setPlant(user_plant)
    setLoc(user_loc)
    async function getExcessDetails() {
    let api_url
    if (dbname == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_dtls/fetch_dtls?fromdate=${getSelectedDate}&plant=${user_plant}&strloc=${user_loc}&todate=${getToSelectedDate}&page=${1}&search=${getSearchInput}`
    }
    else if (getDbname == 'dglrmwh'){
      api_url = process.env.REACT_APP_STORES_URL+`wh_sto_dtls/fetch_dtls?fromdate=${getSelectedDate}&plant=${user_plant}&strloc=${user_loc}&todate=${getToSelectedDate}&page=${1}&search=${getSearchInput}`
    }
    else{
      api_url = process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_dtls?fromdate=${getSelectedDate}&plant=${user_plant}&strloc=${user_loc}&todate=${getToSelectedDate}&page=${1}&search=${getSearchInput}`
    }
    const response = await fetch(api_url,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
       setPagination(true)
       setTable(true) 
       setHdrsList(body.osmdtllists)
       setPageCount(body.pagelength)
    }
    else{
      setTable(false)
      setPagination(false)
      ToastsStore.error(Helper.NO_RECORDS)
    }
    }
    getExcessDetails();
   
  }, []);

  const handleDateChange = (date) => {
    const formatDate =  moment(date).format('YYYY-MM-DD');
    setSelectedDate(formatDate);
  };

  const toDateChange = (date) => {
    const formatDate =  moment(date).format('YYYY-MM-DD');
    setToselecteDate(formatDate);
  };

  const showExcessStock = (action,value) => {
     setPage(value)
     setSpinner(true)
     setTable(false)
     setPagination(false)
     let pagecount
     if (action == 'display'  || value == ''){
      pagecount = 1
     }
     if (value){
      pagecount = value 
     }
    let api_url 
    if (getDbname == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_dtls/fetch_dtls?fromdate=${getSelectedDate}&plant=${getPlant}&strloc=${getLoc}&todate=${getToSelectedDate}&page=${pagecount}&search=${getSearchInput}`
    }
    else if (getDbname == 'dglrmwh'){
      api_url = process.env.REACT_APP_STORES_URL+`wh_sto_dtls/fetch_dtls?fromdate=${getSelectedDate}&plant=${getPlant}&strloc=${getLoc}&todate=${getToSelectedDate}&page=${pagecount}&search=${getSearchInput}`
    }
    else{
     	api_url = process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetch_dtls?fromdate=${getSelectedDate}&plant=${getPlant}&strloc=${getLoc}&todate=${getToSelectedDate}&page=${pagecount}&search=${getSearchInput}`
    }
      setTable(false)
      axios({
      method: 'get',
      headers: {
      'Authorization': getToken
      },
      url: api_url,
      })
    .then(response =>{
      if (response.status == 200)
      {
        setPagination(true)
        setTable(true)
        setSpinner(false)
        setHdrsList(response.data.osmdtllists)
        setPageCount(response.data.pagelength)
      }
    })
    .catch(error => {
      setSpinner(false)
      ToastsStore.error(Helper.NO_RECORDS)
    })
  };

  
  const sapHandler=(s) => {
    setSpinner(!showSpinner)
  	let api_url 
     if (getDbname == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`trn_sfg_stocks/fetch_sap_batch?plant=${s.plant}&str_loc=${s.str_loc}&mat_code=${s.mat_code}`
     }
     else{
      api_url = process.env.REACT_APP_STORES_URL+`trn_wip_stocks/fetch_sap_batch?plant=${s.plant}&str_loc=${s.str_loc}&mat_code=${s.mat_code}`
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
        setColspansap(false)
      	setSpinner(false)
      	let items = response.data
        items.map((item) => {
          item.rowid = s.id 
          item.excessqty = s.excess_qty   
      }); 
      setSapBatchList(items)
      setOpen(true)
      }
    })
    .catch(error => {
    	setColspansap(true)
      setSpinner(false)
      ToastsStore.error(Helper.NO_RECORDS)
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  const displaySap = (s) => {
     setSubmit(true)
  	if (parseFloat(s.excessqty) > parseFloat(s.balance_qty)){
    	ToastsStore.error("Balance Qty is less than excess qty")
    }
    else{
  	let hdrslists  = getHdrsList
    hdrslists.map((item) => {
     if (item.id == s.rowid){
      item.batch = s.sap_batch
      item.balanceqty = s.balance_qty      
     }     
    });   
	    setHdrsList(hdrslists)
	    setOpen(false) 
	  }
  };

  const submitHandler = (event) => {
    setSpinner(!showSpinner)
    let api_url 
     if (getDbname == 'dglosm'){
      api_url = process.env.REACT_APP_OSM_URL+`osm_issue_dtls/update_new_sapbatch`
     }
     else{
      api_url = process.env.REACT_APP_STORES_URL+`wh_sto_dtls/update_new_sapbatch`
     }
      axios({
      method: 'patch',
         headers: {
      'Authorization': getToken
      },
      url:api_url ,
      data :{"dtls":getHdrsList}
      })
    .then(response =>{
      if (response.status == 200)
      {
        setSpinner(false)
        ToastsStore.success("Submitted successfully")
        if (getDbname == 'dglosm' || getDbname == 'dglrmwh'){
          updateStoDtls();
        }
      }
      if (response.status == 201)
      {
        setSpinner(false)
      	ToastsStore.error("Balance Qty is less than excess qty")
      }
    })
    .catch(error => {
      setSpinner(false)
      ToastsStore.error("Not Submitted")
    })  
  }

   const updateStoDtls=(s) => {
    setSpinner(!showSpinner)
      axios({
      method: 'patch',
         headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_RECEIPT_URL+`sto_receipt_dtls/update_new_sapbatch` ,
      data :{"dtls":getHdrsList}
      })
    .then(response =>{
       if (response.status == 200)
      {
        setSpinner(false)
        ToastsStore.success("Submitted successfully")
        window.location.href = '/excessstock'
      }
    })
    .catch(error => {
      setSpinner(false)
      ToastsStore.error("Not Submitted in STO Receipt")
    })
  };

  return (  
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {getOpen ?
        <Dialog maxwidth={'xs'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={getOpen}>
        <Typography id="title">
         <DialogTitle style={{color:"#3f51b5"}}id="customized-dialog-title" onClose={handleClose}>
          Sap Batch
          </DialogTitle> 
          </Typography>
          <DialogContent dividers>
            <Table id="Table" striped bordered hover >
  	          <thead>
  	            <tr   style={{  backgroundColor:"#3f51b5" }} >
  	              <th  style={{ border: "1px solid black",color:"white",textAlign:"center",paddingBottom:"20px" }}>SAP Batch</th>
  	              <th  style={{ border: "1px solid black",color:"white",textAlign:"center",paddingBottom:"20px" }}>Stock Qty</th>
  	            </tr>
  	            { showColspansap ?
  	            <tr id="items">
  	              <th colSpan="2" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
  	            </tr>: null}
  	          </thead>
  	          {getSapBatchList.map((s) => (
  	          <tbody style={{ border: "1px solid black" }}>             
  	            <tr onClick={() => displaySap(s)}>
  	              <td   style={{ border: "1px solid black",textAlign:"center",paddingTop:"20px" }}>{s.sap_batch}</td>
  	              <td   style={{ border: "1px solid black",textAlign:"center",paddingTop:"20px" }}>{s.balance_qty}</td>
  	            </tr>
  	          </tbody>
  	         ))
  	         }
  	        </Table>
          </DialogContent>   
        </Dialog> : null}
        <Sidebar name={Helper.EXCESS_REPORT_SIDEBAR_NAME}/>
          <form  noValidate autoComplete="off">
              <Card elevation={20} style={{width:"2000px"}} >
                <CardContent  style={{ marginLeft:"100px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
    				      <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
					          <Backdrop className={classes.backdrop} open={showSpinner}>
                      <CircularProgress color="primary" />
                    </Backdrop>
  				            <Grid container style={{marginLeft:"0px"}} spacing={4} >
  				              <Grid item>
  				                <TextField style={{width:"160px"}} disabled id="plant" label="Plant" InputLabelProps={{ required: true}}   value={getPlant} onInput={e => setPlant(e.target.value)}  variant="outlined"   
  				                />  
  				              </Grid>
  				              <Grid item>  
  				               <TextField  style={{width:"160px"}} disabled id="loc" label="Location" InputLabelProps={{ required: true}}   value={getLoc} onInput={e => setLoc(e.target.value)}  variant="outlined"   
  				                  />                  
  				              </Grid>
  				              <Grid item style={{marginTop:"-15px",width:"200px"}}>
  									      <KeyboardDatePicker
  							          disableToolbar
  							          variant="inline"
  							          format="dd/MM/yyyy"
  							          margin="normal"
  							          id="date-picker-inline"
  							          label="From date"
  							          value={getSelectedDate}
  							          onChange={handleDateChange}
  							          KeyboardButtonProps={{
  							            'aria-label': 'change date',
  							          }}
  							        />
  				              </Grid>
  				              <Grid item style={{marginTop:"-15px",width:"200px"}}>
  				                <KeyboardDatePicker
  								          disableToolbar
  								          variant="inline"							      
  								          margin="normal"
  								          id="date-picker-inlines"
  								          label="To Date"
  								          format="dd/MM/yyyy"
  								          value={getToSelectedDate}		
  								          onChange={toDateChange}
  								          KeyboardButtonProps={{
  								            'aria-label': 'To date',
  								          }}
  								        />
  				              </Grid>
                        <Grid item style={{marginTop:"-2px"}}>
                          <TextField  id="search" label="Search Filter"  value={getSearchInput} onInput={e => setSearchInput(e.target.value)}  variant="outlined"   
                          /> 
                        </Grid>
  				              <Grid item style={{marginRight:"-10px"}}>
  				                <Button variant="contained"  onClick={() => showExcessStock('display')} color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",height:"40px", marginLeft:25,marginTop:"5px",textTransform:" capitalize"}}>
  				                   Display
  				                </Button> 
  				              </Grid>  
  				            </Grid>
    				          <Grid container  style={{marginLeft:"15px",marginTop:"15px"}}>
      				          {showTable ? 
      				          <TableContainer >
                           <Table className={classes.table}  aria-label="customized table">
                           <TableHead>
                           <TableRow>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Material Group</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Material Desc</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Sto Ref.</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Plant & Loc</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Vendor Batch</StyledTableCell>
    				                  {getDbname == 'dglrmwh'  || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Issues Nos(Bundles)</StyledTableCell> : null}
    				                  {getDbname == 'dglrmwh' || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Rec.Nos.(Bundles)</StyledTableCell> : null}
    				                  {getDbname == 'dglrmwh' || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Std Wt</StyledTableCell> : null}
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Sto Net Wt</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Received Net Wt</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Excess Wt</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>SAP Batch</StyledTableCell>
    				                  {getDbname == 'dglstoreceipt' ? null :
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Stock Qty</StyledTableCell>}
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>Status</StyledTableCell>
                              </TableRow>
      				               </TableHead>
                            <TableBody>
      				              {getHdrsList.map((s) => (
      				              <StyledTableRow>             
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.mat_group_name}</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.mat_desc}</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{getDbname=='dglstoreceipt' ?  s.sto_no : s.sto_no_ref}</StyledTableCell>
    				                  {getDbname == 'dglstoreceipt' ?   <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.unload_plant} & {s.unload_str_loc}</StyledTableCell> : 
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.plant} & {s.str_loc}</StyledTableCell> }
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.mat_batch}</StyledTableCell>
    				                  {getDbname == 'dglrmwh' || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{getDbname == 'dglstoreceipt' ? s.sto_bundle_qty : s.bundle_qty}</StyledTableCell> : null }
    				                  {getDbname == 'dglrmwh'  || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.rec_bundle_qty}</StyledTableCell> : null}
    				                  {getDbname == 'dglrmwh' || getDbname == 'dglstoreceipt' ?
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.std_wt}</StyledTableCell> : null}
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{getDbname == 'dglstoreceipt' ? s.sto_net_wt : s.trns_net_wt}</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.rec_net_wt}</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.excess_qty}</StyledTableCell>
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>
    				                  <Grid container  justify="flex-end">
    				                  <Grid xs={9} item>{getDbname == 'dglstoreceipt' ? s.sap_batch : s.batch}</Grid>
    				                   {getDbname == 'dglstoreceipt' ?  null : 
    				                  <Grid item><HelpIcon  onClick={() => sapHandler(s)}   color="primary"/></Grid> }
    				                  </Grid>
    					                </StyledTableCell>
    					                {getDbname == 'dglstoreceipt' ? null :
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.balanceqty}</StyledTableCell>}
    				                  <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{s.excess_status}</StyledTableCell>
      				                 </StyledTableRow>
      				                ))}
      				             </TableBody></Table></TableContainer>: null}
    				            </Grid>    
        				        <Grid container style={{ marginTop:30,width:"1300px"}} spacing={2} justify="center" >
        				          <Grid item>
        				            <Button variant="contained" onClick={Actionhelper.clearBtn('excessstock')}  style={{borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
        				          </Grid>
        				          {showSubmit ? 
        				          <Grid item  >
        				          {getDbname == 'dglosm' || getDbname =='dglrmwh' ? 
        				            <Button variant="contained" onClick={submitHandler} color="primary" style={{borderRadius:"20px",backgroundColor:"green",textTransform:" capitalize"}}>
        				              Submit
        				            </Button> : null}
        				          </Grid> : null }
        				          <Grid item>
        				            <Button variant="contained"  onClick={Actionhelper.exitBtn()} style={{borderRadius:"20px",backgroundColor:"#8585ad",textTransform:" capitalize"}}>
        				              Exit
        				            </Button>
        				          </Grid>
                           {showPagination ? 
                            <Grid item style={{marginLeft:"250px"}}>
                              <div className={classes.root}>
                                <Pagination count={getPageCount} color="primary" page={getPage} onChange={showExcessStock} />
                              </div>
                            </Grid> : null}   
        				       </Grid>  
        	           </CardContent>
        	         </Card> 
                 </form>
                </MuiPickersUtilsProvider>
            	</div>
            );
          }


