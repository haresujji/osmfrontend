import React from 'react';
import axios from 'axios';
import {InputLabel,TextField,Grid,Button,Card,CardContent,Typography,Table,TableBody,TableCell,
TableContainer,TableHead,TableRow,Paper,Box,Backdrop,CircularProgress,Tooltip,withStyles,makeStyles} from '@material-ui/core';
import { useState } from 'react';
import lifecycle from 'react-pure-lifecycle';
import Sidebar from './utlis/Sidebar'
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Stylehelper from './utlis/Stylehelper'
import Datehelper from './utlis/Datehelper'
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Pagination from '@material-ui/lab/Pagination';
import PrintIcon from '@material-ui/icons/Print';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what the font-size on the html element is.
      fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
     
    htmlFontSize: 18,
  },
});

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
  var Barcode = require('react-barcode');
  const classes = useStyles();
  const moment = require("moment");
  const [open, setOpen] = React.useState(false);
  const [getPlant, setPlant] = useState('');
  const [showTable,setTable] = React.useState(false)
  const [getLoc, setLoc] = useState('');
  const [getSearchInput, setSearchInput] = useState('');
  const [showSearchInputBox, setSearchInputBox] = React.useState(false);
  const [showPagination, setPagination] = React.useState(false);
  const [getReportList,setReportList] = React.useState([])
  const [getPage, setPage] = React.useState(1);
  const [getPageCount, setPageCount] = useState('');
  const headerArray = ["Work Center","Sfg Code","Sap Batch","Lot No","Gross Wt",
  "Action"]
  const [showPrintModal, setPrintModal] = React.useState(false);
  const [getSfgCode, setSfgCode] = useState('');
  const [getBatchRef, setBatchRef] = useState('');
  const [getOldBatchNo, setOldBatchNo] = useState('');
  const [getGrossWt, setGrossWt] = useState('');
  const [getTareWt, setTareWt] = useState('');
  const [getNetWt, setNetWt] = useState('');
  const [getRfid, setRfid] = useState('');
  const [getSapBatch, setSapBatch] = useState('');
  const [selectedDate, setSelectedDate] = React.useState(Datehelper.displayDate());
   const [getToken, setToken] = useState('');

  React.useEffect(() => {
    const userPlant = localStorage.getItem('plant');
    const userLoc = localStorage.getItem('str_loc');
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setPlant(userPlant)
    setLoc(userLoc)
    async function getSfgStocks() {
    const response = await fetch(process.env.REACT_APP_OSM_URL+`trn_sfg_stocks/fetch_sfg_list?date=${Datehelper.displayDate()}&plant=${userPlant}&strloc=${userLoc}&search=${getSearchInput}&page=${1}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
      console.log(body.pagelength)
       setPagination(true)
       setTable(true)
       setOpen(false)    
       setReportList(body.sfg_lists)
       setPageCount(body.pagelength)
    }
    else{
      setPagination(false)
      setTable(false)
      ToastsStore.error(Helper.NO_RECORDS)
    }
    }
    getSfgStocks();

  }, []);

  const styles = theme => ({
  closeButton: {
    position: 'absolute',
    marginLeft:"80px",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  root: {
    margin: 0,
    padding: theme.spacing(2),
    '& h6': { color: 'blue' },
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

 const showSfgStocks = (action,value) => {
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
     url:  process.env.REACT_APP_OSM_URL+`trn_sfg_stocks/fetch_sfg_list?date=${selectedDate}&plant=${getPlant}&strloc=${getLoc}&search=${getSearchInput}&page=${pagecount}`,
   })
   .then(response =>{
     if (response.status == 200)
     {
       const items = response.data.sfg_lists
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

  const handleClose = () => {
    setPrintModal(false);
  };

  const printHandler = (row) => {
    setSfgCode(row.sfg_code)
    setBatchRef(row.batch_reference)
    setOldBatchNo(row.old_batch_no)
    setRfid(row.rfid_tag)
    setTareWt(row.tare_wt)
    setGrossWt(row.gross_wt)
    setNetWt(row.gross_wt - row.tare_wt)
    setSapBatch(row.sap_batch)
    setPrintModal(true)
  };

    const printView = () => {
     var x = document.getElementById("title");
      x.style.display = "none";
      var x = document.getElementById("print");
      x.style.display = "none";
      window.resizeTo(960, 600);
      window.print();
      window.close();
      var x = document.getElementById("title");
      x.style.display = "block";
      var x = document.getElementById("print");
      x.style.display = "block";
  }

  const handleDateChange = (date) => {
   const formatDate =  moment(date).format('YYYY-MM-DD');
   setSelectedDate(formatDate);
  };



return (  
  <div>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    {showPrintModal ?
      <Dialog maxwidth={'xs'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={showPrintModal}>
      <Typography id="title">
       <DialogTitle style={{color:"#3f51b5"}}id="customized-dialog-title" onClose={handleClose}>
        Tag Print
        </DialogTitle> 
        </Typography>
        <DialogContent dividers>
          <Typography style={{textAlign:"center", fontWeight:"Bold", fontSize:"16px"}}>Pallet Rfid-{getPlant}-{getLoc} </Typography>
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography variant="subtitle1" style={{marginTop:"10px", fontWeight:"Bold"}}>Date</Typography>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{marginTop:"10px",fontWeight:"Bold",marginLeft:"67px"}}>:</Typography>
            </Grid>
            <Grid item>
              <ThemeProvider theme={theme}>
              <Typography style={{marginTop:"10px", fontWeight:"Bold"}}>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date())}</Typography>
               </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Material</Typography>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"44px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{getSfgCode}</Typography>
              </ThemeProvider>
            </Grid>
          </Grid>
            <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Batch Ref</Typography>   
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"31.5px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{getBatchRef}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Old Batch No</Typography>   
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"6.7px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{warp:"nowrap",fontWeight:"Bold"}} >{getOldBatchNo}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Sap Batch</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"28px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{getSapBatch}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Gross Wt</Typography>  
             </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"35px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{getGrossWt}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Tare Wt</Typography>  
             </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"48px"}}>:</Typography>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{getTareWt}</Typography>
             </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
              <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Net Wt</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"55px"}}>:</Typography>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{getNetWt}</Typography>
             </ThemeProvider>
            </Grid>
          </Grid>
          <Grid style={{width:"420px"}} container spacing={1} > 
            <Grid item style={{width:"420px"}}   align="center">
              <Barcode  value={getRfid} height="40px" />  
           </Grid>  
          </Grid> 
        </DialogContent>   
       <Typography id="print"> 
        <DialogActions>  
           <Button variant="contained" onClick={() => printView()} color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",textTransform:" capitalize"}}>
          Print
           </Button>     
        </DialogActions> 
        </Typography>
      </Dialog> : null }
      <Sidebar name = {Helper.PALLET_RFID_SIDEBAR_NAME}/>
        <form  noValidate autoComplete="off">
          <Card elevation={20} style={{width:"1800px"}} >
            <CardContent style={{ marginLeft:"100px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
              <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore}/>
                <Grid container style={{marginLeft:"0px"}} spacing={4}>
                  <Grid item style={{marginTop:"4px"}}   >
                    <Typography variant="caption" display="block">Plant</Typography>
                    <Box id="plant" borderColor="text.primary" {...Stylehelper.displayViewProps()}>  
                    <Typography style={{paddingLeft:"5px", paddingTop: "5px"}} variant="subtitle2" gutterBottom >{getPlant}</Typography>                 
                    </Box>
                  </Grid>
                  <Grid item style={{marginTop:"4px"}} >
                    <Typography variant="caption" display="block">Location</Typography>
                    <Box id="loaction" borderColor="text.primary" {...Stylehelper.displayViewProps()}>  
                    <Typography style={{paddingLeft:"5px", paddingTop: "5px"}} 
                    variant="subtitle2" gutterBottom >{getLoc}</Typography>                 
                    </Box>              
                  </Grid>
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
                  <Grid item style={{marginTop:"-2px"}}>
                      <TextField  id="search" label="Search Filter"  value={getSearchInput} onInput={e => setSearchInput(e.target.value)}  variant="outlined"   
                      /> 
                  </Grid>
                  <Grid item>
                    <Button variant="contained"   onClick={() => showSfgStocks('display')} color="primary" style={{ borderRadius:"20px",backgroundColor:"#b30059",height:"40px", marginLeft:25,marginTop:"10px",textTransform:" capitalize"}}>
                    Display
                    </Button> 
                    <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="primary" />
                    </Backdrop>
                  </Grid>  
                </Grid>        
                {showTable ? 
                <Grid container style={{marginLeft:"15px",marginTop:"15px"}}>
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
                   {getReportList.map((row) => (
                    <StyledTableRow>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.work_center}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.sfg_code}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.sap_batch}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.lot_no}</StyledTableCell>
                    <StyledTableCell style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>{row.gross_wt}</StyledTableCell>
                    <StyledTableCell  style={Stylehelper.tableHeaderStyle(), Stylehelper.tableStyle()}>
                    <Grid container  justify="center"><Grid item><PrintIcon  onClick={() => printHandler(row)} style={{cursor:"pointer"}}   color="primary"/></Grid></Grid>
                    </StyledTableCell>
                    </StyledTableRow>
                    ))}
                   </TableBody>
                   </Table>
                   </TableContainer>
              </Grid> : null }
            <Grid container   style={{ marginTop:30,width:"1300px"}} spacing={2} justify="center" >
              <Grid item>
                <Button variant="contained" onClick={Actionhelper.clearBtn('pallet_rfid')}  style={{borderRadius:"20px",textTransform:" capitalize",backgroundColor:"#8585ad"}}>Clear</Button>
              </Grid>
              <Grid item>
                 <Button variant="contained"  onClick={Actionhelper.exitBtn()}  style={{borderRadius:"20px",backgroundColor:"#8585ad",textTransform:" capitalize"}}>
                 Exit
              </Button>
            </Grid>
            {showPagination ? 
              <Grid item style={{marginLeft:"250px"}}>
                <div className={classes.root}>
                  <Pagination count={getPageCount} color="primary" page={getPage} onChange={showSfgStocks} />
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




