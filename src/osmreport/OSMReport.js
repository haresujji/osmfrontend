import React from 'react';
import axios from 'axios';
import {InputLabel,TextField,Grid,Button,Card,CardContent,Typography,Table,TableBody,TableCell,
TableContainer,TableHead,TableRow,Paper,Box,Backdrop,CircularProgress,Tooltip,withStyles,makeStyles,FormControl,Select} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import Sidebar from '../utlis/Sidebar'
import Helper from '../utlis/Helper'
import Actionhelper from '../utlis/Actionhelper'
import Stylehelper from '../utlis/Stylehelper'
import Datehelper from '../utlis/Datehelper'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Pagination from '@material-ui/lab/Pagination';

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

const useStyles = makeStyles((theme) =>({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    '& > *': {
      marginTop: theme.spacing(1),
    },
  }
}));

export default function OSMReport() {
  const classes = useStyles();
  const moment = require("moment");
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(Datehelper.displayDate());
  const [selectedToDate, setSelectedToDate] = React.useState(Datehelper.displayDate());
  const inputPlant = React.useRef(null);
  const [labelPlant, setLabelPlant] = React.useState(0);
  const [getPlant, setPlant] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const inputToPlant = React.useRef(null);
  const [labelToPlant, setLabelToPlant] = React.useState(0);
  const [getToPlant, setToPlant] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const inputMatType = React.useRef(null);
  const [labelMatType, setLabelMatType] = React.useState(0);
  const [getMatType, setMatType] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const inputStoStatus = React.useRef(null);
  const [labelStoStatus, setLabelStoStatus] = React.useState(0);
  const [getStoStatus, setStoStatus] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const inputProcessCycle = React.useRef(null);
  const [labelProcessCycle, setLabelProcessCycle] = React.useState(0);
  const [getProcessCycle, setProcessCycle] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const inputGrnStatus = React.useRef(null);
  const [labelGrnStatus, setLabelGrnStatus] = React.useState(0);
  const [getGrnStatus, setGrnStatus] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [getFromPlantValue, setFromPlantValue] = useState('');
  const [getToPlantValue, setToPlantValue] = useState('');
  const [getMatTypeValue, setMatTypeValue] = useState('');
  const [getGrnStatusValue, setGrnStatusValue] = useState('');
  const [getStoStatusValue, setStoStatusValue] = useState('');
  const [getProcessCycleValue, setProcessCycleValue] = useState('');
  const [showTable,setTable] = React.useState(false)
  const [getSearchInput, setSearchInput] = useState('');
  const [showSearchInputBox, setSearchInputBox] = React.useState(false);
  const [showPagination, setPagination] = React.useState(false);
  const [getReportList,setReportList] = React.useState([])
  const [getPage, setPage] = React.useState(1);
  const [getPageCount, setPageCount] = useState('');
  const headerArray = ["S No","Date","From Plant","From Loc","To Plant","To Loc","Truck No","Document No","Material Type","Picked","STO Start",
  "STO End","STO No","Load Weight","Barcode","Gate Entry","Load Weighment","Empty Weighment","Received","GRN Start","GRN End","GRN No","Process Cycle","Remarks"]
  const [getToken, setToken] = useState('');

  React.useEffect(() => {
    setLabelToPlant(inputToPlant.current.offsetWidth);
    setLabelPlant(inputPlant.current.offsetWidth);
    setLabelMatType(inputMatType.current.offsetWidth);
    setLabelStoStatus(inputStoStatus.current.offsetWidth);
    setLabelProcessCycle(inputProcessCycle.current.offsetWidth);
    setLabelGrnStatus(inputGrnStatus.current.offsetWidth);
    let headers = localStorage.getItem('headers');
    setToken(headers)
    async function getDatas() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`osm_sto_reports/fetch_datas`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
      setPlant(body.from_plant.map(({ from_plant }) => ({ label: from_plant, value: from_plant })));
      setToPlant(body.to_plant.map(({ to_plant }) => ({ label: to_plant, value: to_plant })));
      setMatType(body.material_type.map(({ material_type }) => ({ label: material_type, value: material_type })));
      setProcessCycle(body.process_cycle.map(({ process_cycle }) => ({ label: process_cycle, value: process_cycle })));
    }
    else{
      ToastsStore.error(Helper.NO_RECORDS)
    }
    }
    getDatas();
    async function getOsmDetails() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`osm_sto_reports/fetch_filter_list?from_date=${Datehelper.displayDate()}&to_date=${Datehelper.displayDate()}&from_plant=${getFromPlantValue}&to_plant=${getToPlantValue}&material_type=${getMatTypeValue}&grn_status=${getGrnStatusValue}&sto_status=${getStoStatusValue}&process_cycle=${getProcessCycleValue}&search=${getSearchInput}&page=${1}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
       setPagination(true)
       setTable(true)
       setOpen(false)    
       setReportList(body.osmlists)
       setPageCount(body.pagelength)
    }
    else{
      setPagination(false)
      setTable(false)
      ToastsStore.error(Helper.NO_RECORDS)
    }
    }
    getOsmDetails();

  }, []);

  const showOsmDetails = (action,value) => {
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
   let api_url
      api_url =process.env.REACT_APP_COMMON_URL+`osm_sto_reports/fetch_filter_list?from_date=${selectedDate}&to_date=${selectedToDate}&from_plant=${getFromPlantValue}&to_plant=${getToPlantValue}&material_type=${getMatTypeValue}&grn_status=${getGrnStatusValue}&sto_status=${getStoStatusValue}&process_cycle=${getProcessCycleValue}&search=${getSearchInput}&page=${pagecount}`
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
       const items = response.data.osmlists
       if (items != null && items.length > 0){
         setPagination(true)
         setTable(true)
         setOpen(false)    
         setReportList(items)
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
    if (date == null){
      const dateFormatChange = ''
      return dateFormatChange
    }
    if (date != null){
      const dateFormat = new Date(date)
      const dateFormatChange = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(dateFormat)  
      return dateFormatChange
    }
  }

const handleDateChange = (date) => {
 const formatDate =  moment(date).format('YYYY-MM-DD');
 setSelectedDate(formatDate);
};

const handleToDateChange = (date) => {
 const formatDate =  moment(date).format('YYYY-MM-DD');
 setSelectedToDate(formatDate);
};

const handleFromPlant = event => {
  setFromPlantValue(event.target.value)
};

const handleToPlant = event => {
  setToPlantValue(event.target.value)
};

const handleMatType = event => {
  setMatTypeValue(event.target.value)
};

const handleStoStatus = event => {
  setStoStatusValue(event.target.value)
};

const handleProcessCycle = event => {
  setProcessCycleValue(event.target.value)
};

const handleGrnStatus = event => {
  setGrnStatusValue(event.target.value)
};

return (  
  <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Sidebar name = {Helper.OSM_REPORT_SIDEBAR_NAME}/>
        <form  noValidate autoComplete="off">
          <Card elevation={20} style={{width:"3500px"}} >
            <CardContent style={{ marginLeft:"100px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
              <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore}/>
                <Grid container style={{marginLeft:"15px"}} spacing={4}>
                  <Grid item style={{marginTop:" -10px",width:"200px"}}>
                      <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="From date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      />
                   </Grid>
                    <Grid item style={{marginTop:" -10px",width:"200px",marginLeft:"30px"}}>
                      <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="To date"
                      value={selectedToDate}
                      onChange={handleToDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      />
                   </Grid>
                  <Grid item style={{marginTop:"4px",marginLeft:"30px"}}   >
                    <FormControl  style={{width:"150px"}}variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputPlant} id="demo-simple-select-outlined-label">From Plant</InputLabel>
                      <Select labelId="FromPlant" id="fromplant" InputLabelProps={{ required: true}} onChange={handleFromPlant} labelWidth={labelPlant}>
                        {getPlant.map(item => (<option key={item.value} value={item.value}> {item.label} </option>))}
                      </Select>
                    </FormControl>   
                  </Grid>
                  <Grid item style={{marginTop:"4px",marginLeft:"30px"}} >
                    <FormControl style={{width:"150px"}} variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputToPlant} id="demo-simple-select-outlined-label">To Plant</InputLabel>
                      <Select labelId="ToPlant" id="toplant" InputLabelProps={{ required: true}} onChange={handleToPlant} labelWidth={labelToPlant}>
                        {getToPlant.map(item => (<option key={item.value} value={item.value}> {item.label} </option>))}
                      </Select>
                    </FormControl>            
                  </Grid>
                  <Grid item style={{marginTop:"4px",marginLeft:"30px"}}>
                    <FormControl style={{width:"150px"}} variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputMatType} id="demo-simple-select-outlined-label">Material Type</InputLabel>
                      <Select labelId="MatType" id="mattype" InputLabelProps={{ required: true}} onChange={handleMatType} labelWidth={labelMatType}>
                        {getMatType.map(item => (<option key={item.value} value={item.value}> {item.label} </option>))}
                      </Select>
                    </FormControl>    
                  </Grid>
                </Grid>
                <Grid container style={{marginLeft:"15px"}} spacing={4}>
                   <Grid item style={{marginTop:"4px"}}>
                    <FormControl  style={{width:"150px"}} variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputStoStatus} id="demo-simple-select-outlined-label">Sto Status </InputLabel>
                      <Select labelId="demo-simple-select-outlined-label" id="sto_status" onChange={handleStoStatus} labelWidth={labelStoStatus} >              
                      <option value='Completed'>Completed</option>
                      <option value='Pending'>Pending</option>
                    </Select>
                   </FormControl>       
                  </Grid>
                  <Grid item style={{marginTop:"4px",marginLeft:"50px"}}>
                    <FormControl style={{width:"150px"}} variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputProcessCycle} id="demo-simple-select-outlined-label">Process Cycle</InputLabel>
                      <Select labelId="ProcessCycle" id="processcycle" InputLabelProps={{ required: true}} onChange={handleProcessCycle} labelWidth={labelProcessCycle}>
                        {getProcessCycle.map(item => (<option key={item.value} value={item.value}> {item.label} </option>))}
                      </Select>
                    </FormControl>    
                  </Grid>
                  <Grid item style={{marginTop:"4px",marginLeft:"45px"}}>
                    <FormControl  style={{width:"150px"}} variant="outlined" className={classes.formControl} >
                      <InputLabel ref={inputGrnStatus} id="demo-simple-select-outlined-label">Grn Status </InputLabel>
                      <Select labelId="demo-simple-select-outlined-label" id="grn_status" onChange={handleGrnStatus} labelWidth={labelGrnStatus} >              
                      <option value='Completed'>Completed</option>
                      <option value='Pending'>Pending</option>
                    </Select>
                   </FormControl>        
                  </Grid>
                  <Grid item style={{marginLeft:"30px"}} >
                      <TextField style={{width:"150px"}}  id="search" label="Search Filter"   value={getSearchInput} onInput={e => setSearchInput(e.target.value)}  variant="outlined"   
                          />
                  </Grid>
                  <Grid item style={{marginLeft:"20px"}}>
                    <Button variant="contained"   onClick={() => showOsmDetails('display')} color="primary" style={{ borderRadius:"20px",backgroundColor:"#b30059",height:"40px", marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                    Display
                    </Button> 
                    <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="primary" />
                    </Backdrop>
                  </Grid>  
                </Grid>        
                {showTable ? 
                <Grid container style={{marginLeft:"30px",marginTop:"15px"}}>
                   <TableContainer >
                   <Table   aria-label="customized table">
                   <TableHead>
                   <TableRow>
                    {headerArray.map((row) => (
                      <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row}</StyledTableCell>
                   ))}
                   </TableRow>
                   </TableHead>
                   <TableBody>
                   {getReportList.map((row,i) => (
                    <StyledTableRow>
                    <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{i+1}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.doc_date)}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.from_plant}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.from_strloc}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.to_plant}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.to_strloc}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.truck_no}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.document_no}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.material_type}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.picked_status == 'Y' ? 'Yes' : 'No'}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.sto_start)}</StyledTableCell>
                    <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.sto_end)}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.sto_no}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.load_weight_status == 'Y' ? 'Yes' : 'No'}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.barcode_status == 'Y' ? 'Yes' : 'No'}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.gate_entry_status == 'Y' ? 'Yes' : 'No'}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.load_weight}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.empty_weight}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.received_status == 'Y' ? 'Yes' : 'No'}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.grn_start)}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{changeDateFormat(row.grn_end)}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.grn_no}</StyledTableCell>
                     <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.process_cycle}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.remarks}</StyledTableCell>
                    </StyledTableRow>
                    ))}
                   </TableBody>
                   </Table>
                   </TableContainer>
              </Grid> : null }
            <Grid container   style={{ marginTop:30,width:"1300px"}} spacing={2} justify="center" >
              <Grid item>
                <Button variant="contained" onClick={Actionhelper.clearBtn('osmreport')}  style={{borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
              </Grid>
              <Grid item>
                 <Button variant="contained"  onClick={Actionhelper.exitBtn()}  style={{borderRadius:"20px",backgroundColor:"#8585ad",textTransform:" capitalize"}}>
                 Exit
              </Button>
            </Grid>
            {showPagination ? 
              <Grid item style={{marginLeft:"250px"}}>
                <div className={classes.root}>
                  <Pagination count={getPageCount} color="primary" page={getPage} onChange={showOsmDetails} />
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




