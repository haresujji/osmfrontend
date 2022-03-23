import React from 'react';
import axios from 'axios';
import {InputLabel,TextField,Grid,Button,Card,CardContent,Typography,Table,TableBody,TableCell,
TableContainer,TableHead,TableRow,Paper,Box,Backdrop,CircularProgress,Tooltip,withStyles,makeStyles,FormControl,
Select} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import Sidebar from './utlis/Sidebar'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Pagination from '@material-ui/lab/Pagination';
import Stylehelper from './utlis/Stylehelper'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import Datehelper from './utlis/Datehelper'
import DateFnsUtils from '@date-io/date-fns';

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

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: -1,
    width: 160,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function OSMReprt() {
  var moment = require("moment");
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(Datehelper.displayDate());
  const [toSelectedDate, setToselecteDate] = React.useState(Datehelper.displayDate());  
  const [open, setOpen] = React.useState(false);
  const inputPlant = React.useRef(null);
  const [getLabelPlant, setLabelPlant] = React.useState(0);
  const inputLoc = React.useRef(null);
  const [getLabelLoc, setLabelLoc] = React.useState(0);
  const [getPlantList, setPlantList] = useState([
    { label: "No records found..", value: [] }
  ]);
  const [getLocList, setLocList] = useState([
    { label: "No records found..", value: [] }
  ]);
  const [showLoading, setLoading] = React.useState(true);
  const [getPlant, setPlant] = useState('');
  const [getLoc, setLoc] = useState('');
  const [showTable,setTable] = React.useState(false)
  const [showSpinner, setSpinner] = React.useState(false);
  const [getStoList,setStoList] = React.useState([])
  const [showSearchInputBox, setSearchInputBox] = React.useState(false);
  const [getSearchInput, setSearchInput] = useState('');
  const [showPagination, setPagination] = React.useState(false);
  const [getPageCount, setPageCount] = useState('');
  const [getPage, setPage] = React.useState(1);
  const [getLoginPlant, setLoginPlant] = useState('');
  const [getLoginLoc, setLoginLoc] = useState('');
  const headerArray = ["Req Date","Req Doc","From Plant","To Plant","From Location","To Location","Material code","Material Name",
  "No Of Bundles","Qty(UOM)","SAP Batch","Vendor Batch","Po Date","Eway Bill","Receipt","Transfer Posting","Gross Wt(1)","Gross Wt(2)",
  "Sort Qty","Excess Qty","Vehicle","Driver Name","Transport","Remarks"]
  const stoItems = []
   const [getToken, setToken] = useState('');

  React.useEffect(() => {
    let logPlant = localStorage.getItem('plant');
    let logLoc = localStorage.getItem('str_loc');
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setLoginPlant(logPlant)
    setLoginLoc(logLoc)
    setLabelPlant(inputPlant.current.offsetWidth);
    setLabelLoc(inputLoc.current.offsetWidth);
    async function getPlantLocation() {
    const response = await fetch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_hdrs/fetchplantandlocation`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
    setPlantList(body.plant.map(({unload_plant }) => ({ label: unload_plant, value: unload_plant })));
    setLocList(body.loc.map(({unload_str_loc }) => ({ label: unload_str_loc, value: unload_str_loc })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getPlantLocation();
    async function getStoDetails() {
    const response = await fetch(process.env.REACT_APP_RECEIPT_URL+`sto_receipt_dtls/fetch_report_lists?fromdate=${selectedDate}&todate=${toSelectedDate}&plant=${getPlant}&str_loc=${getLoc}&search=${getSearchInput}&page=${1}&loginplant=${logPlant}&loginloc=${logLoc}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
       setPagination(true)
       setTable(true)
       setOpen(false)    
       setStoList(body.stolists)
       setPageCount(body.pagelength)
       console.log("pagelength:"+body.pagelength)
    }
    else{
      setPagination(false)
      setTable(false)
      ToastsStore.error(Helper.NO_RECORDS)
    }
    }
    getStoDetails();
   
  }, []);

  const handlePlant = event => {
    setPlant(event.target.value)
  };

  const handleLoc = event => {
    setLoc(event.target.value)
  };

  const handleDateChange = (date) => {
    const formatDate =  moment(date).format('YYYY-MM-DD');
    setSelectedDate(formatDate);
  };

  const toDateChange = (date) => {
    const formatDate =  moment(date).format('YYYY-MM-DD');
    setToselecteDate(formatDate);
  };

  const showStoDetails = (action,value) => {
     setPage(value)
     setOpen(!open)
     setTable(false)
     setPagination(false)
      let pagecount
       if (action == 'display'  || value == ''){
        pagecount = 1
       }
       if (value){
        pagecount = value 
       }
      axios({
      method: 'get',
        headers: {
      'Authorization': getToken
      },
      url: process.env.REACT_APP_RECEIPT_URL+`sto_receipt_dtls/fetch_report_lists?fromdate=${selectedDate}&todate=${toSelectedDate}&plant=${getPlant}&str_loc=${getLoc}&search=${getSearchInput}&page=${pagecount}&loginplant=${getLoginPlant}&loginloc=${getLoginLoc}`,
      })
     .then(response =>{
      if (response.status == 200)
        {
          const stoItems = response.data.stolists
          if (stoItems != null && stoItems.length > 0){
            setSearchInputBox(true)
            setStoList(response.data.stolists)
            setPagination(true)
            setTable(true)
            setOpen(false) 
            setPageCount(response.data.pagelength)
          }
        }
    })
    .catch(error => {
      setOpen(false)
      ToastsStore.error(Helper.NO_RECORDS)
    })
  };

  const changeDateFormat = (date) =>{
    const dateFormat = new Date(date)
    const dateFormatChange = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(dateFormat)  
    return dateFormatChange
  }

  return (  
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Sidebar name= {Helper.STO_REPORT_SIDEBAR_NAME} loginPlant={getLoginPlant} loginLoc={getLoginLoc}/>
        <form  noValidate autoComplete="off">
            <Card elevation={20} style={{width:"3500px"}} >
              <CardContent  style={{ marginLeft:"100px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }} > 
                <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                    <Grid container style={{marginLeft:"0px"}} spacing={3} >
                      <Grid item style={{marginTop:"-10px",width:"200px"}}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="From Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      </Grid>
                      <Grid item style={{marginTop:"-10px",width:"200px"}}>
                        <KeyboardDatePicker
                          disableToolbar
                          variant="inline"                    
                          margin="normal"
                          id="date-picker-inlines"
                          label="To Date"
                          format="dd/MM/yyyy"
                          value={toSelectedDate}    
                          onChange={toDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'To date',
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <FormControl variant="outlined"  className={classes.formControl}  >
                          <InputLabel ref={inputPlant} id="demo-simple-select-outlined-label">
                          Source Plant         
                          </InputLabel>
                           <Select
                            labelId="Source Plant"
                            id="plant"
                            InputLabelProps={{ required: true}}
                            onChange={handlePlant}
                            labelWidth={getLabelPlant}
                            >
                            {getPlantList.map(item => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                                 ))}
                          </Select>
                        </FormControl>           
                      </Grid>
                      <Grid item>  
                        <FormControl variant="outlined" className={classes.formControl} >
                          <InputLabel ref={inputLoc} id="demo-simple-select-outlined-label">
                          Source Location         
                          </InputLabel>
                          <Select
                            labelId="Source Location"
                            id="location"
                            InputLabelProps={{ required: true}}
                            onChange={handleLoc}
                            labelWidth={getLabelLoc}
                            >
                            {getLocList.map(item => (
                            <option
                              key={item.value}
                              value={item.value}
                              >
                              {item.label}
                            </option>
                                 ))}
                          </Select>
                        </FormControl>                           
                      </Grid>
                      <Grid item>
                          <TextField  id="search" label="Search Filter"   value={getSearchInput} onInput={e => setSearchInput(e.target.value)}  variant="outlined"   
                          />
                        </Grid>
                      <Grid item>
                        <Button variant="contained" onClick={() => showStoDetails('display')}  color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",height:"40px", marginLeft:25,marginTop:"5px",textTransform:" capitalize"}}>
                           Display
                        </Button> 
                        <Backdrop className={classes.backdrop} open={open}>
                          <CircularProgress color="primary" />
                        </Backdrop>
                      </Grid> 
                    </Grid>  
                      {showTable ? 
                       <Grid container style={{marginLeft:"13px",marginTop:"20px"}}>
                        <TableContainer >
                          <Table  aria-label="customized table">
                            <TableHead>
                              <TableRow>
                              {headerArray.map((row) => (
                                <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row}</StyledTableCell>
                               ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getStoList.map((row) => (
                                <StyledTableRow>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}></StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}></StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.from_plant}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.unload_plant}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.from_str_loc}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.unload_str_loc}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.mat_code}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.mat_group_name}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.rec_noofbundle}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.mat_uom}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.sap_batch}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.mat_batch}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.sto_date)}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.ewaybill}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.gate_entry_docno}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}></StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.empty_truck_wt}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.total_truck_wt}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}></StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.excess_qty}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.truck_no}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.driver_name.length > 20 ?  <Tooltip title={row.driver_name} placement="bottom">
                                 <Button> { row.driver_name.substring(0,20) +".." }
                                 </Button></Tooltip> : row.driver_name}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.transport_vendor.length > 20 ?  <Tooltip title={row.transport_vendor} placement="bottom">
                                   <Button> { row.transport_vendor.substring(0,20) +".." }
                                   </Button></Tooltip> : row.transport_vendor}</StyledTableCell>
                                  <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}></StyledTableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        </Grid> : null }            
                        <Grid container   style={{ marginTop:30,width:"1300px"}} spacing={2} justify="center" >
                          <Grid item>
                            <Button variant="contained" onClick={Actionhelper.clearBtn('storeport')}  style={{borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
                          </Grid>
                          <Grid item>
                            <Button variant="contained"  onClick={Actionhelper.exitBtn()}  style={{borderRadius:"20px",backgroundColor:"#8585ad",textTransform:" capitalize"}}>
                              Exit
                            </Button>
                          </Grid>
                          {showPagination ? 
                          <Grid item style={{marginLeft:"250px"}}>
                            <div className={classes.root}>
                              <Pagination count={getPageCount} color="primary" page={getPage} onChange={showStoDetails} />
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


