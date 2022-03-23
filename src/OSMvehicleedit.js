import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import  Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import css from "./App.css"
import lifecycle from 'react-pure-lifecycle';
import { Alert } from 'reactstrap';
import Sidebar from './utlis/Sidebar'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import ReactToPrint from 'react-to-print';
import Icon from "@material-ui/core/Icon";
import { loadCSS } from 'fg-loadcss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Helper from './utlis/Helper'
import Actionhelper from './utlis/Actionhelper'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what the font-size on the html element is.
      fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
     
    htmlFontSize: 18,
  },
});
	
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: -1,
    width: 225,
  },

   backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const iconStyles = makeStyles(theme => ({
  root: {
   '& > .fa': {
      margin: theme.spacing(2),
    },
  }
}));

export default function OSMVehicleedit() {
  var Barcode = require('react-barcode');
  const classes = useStyles();
  const classesIcon = iconStyles();
  const inputDoc = React.useRef(null);
  const [labeldoc, setLabeldoc] = React.useState(0);
  const [id, setid] = useState('');
  const [regdate, setregdate] = useState('');
  const [transportvendor, setTransport] = useState('');
  const [trip, setTrip] = useState('');
  const [displaytrucktype, setdisplaytrucktype] = useState('');
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [empty, setempty] = useState('');
  const [loaded, setloaded] = useState('');
  const [dl, setdl] = useState('');
  const [sto, setsto] = useState('');
  const [fromplant, setfromplant] = useState('');
  const [disabled,setdisables] = useState(false)
  const [openstatus,setopenstatus] = useState(false)
  const [showcompleted,setcompleted] = useState(false)
  const [loading, setLoading] = React.useState(true);
  const [regdoc, setdoc] = React.useState([
    { label: "No records found", value: [] }
  ]);
  const [dbvalue, setdbvalue] = React.useState('');
  const [ebbill, setebbil] = React.useState('');
  const [create, setcreate] = React.useState('');
  const [getBinCount, setBinCount] = React.useState('');
  const [update, setupdate] = React.useState('');
  const [displayvendor, setdisplayvendor] = React.useState('');
  const [doc, setdocno] = React.useState('');
  const [showebbill, setshowebbil] = React.useState(false);
  const [showspinner, setspinner] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [print, setprint] = React.useState(false);
  const date = new Date(create)
  const updatedate = new Date(update)
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const inputTrip = React.useRef(null);
  const [labelTrip, setLabelTrip] = React.useState(0);
  const inputTruck = React.useRef(null);
  const [labelTruck, setLabelTruck] = React.useState(0);
  const inputPlant = React.useRef(null);
  const [labelPlant, setLabelPlant] = React.useState(0);
  const [plant, setplant] = useState('');
  const [strloc, setstrloc] = useState('');
  const [toplant, settoplant] = useState('');
  const [sourceplant, setsourceplant] = useState('');
  const [sourcestrloc, setsourcestrloc] = useState('');
  const [showsapn, setsapn] = useState(false);
  const [showsapy, setsapy] = useState(false);
  const [showsapsto, setsapsto] = useState(false);
  const [triptype, setTripType] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [plantname, setplantname] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [truck, settruck] = React.useState([
    { label: "No records found..", value: [] }
  ]);
  const [trucktypecode, settrucktypecode] = useState('');
  const [trucktype, settrucktype] = React.useState('');
  const [vendor, setVendor]  = React.useState('');
  const [truckno, settruckno] = useState('');
  const [vendorcode, setvendorcode] = useState('');
  const [routedesc, setroutedesc] = useState('');
  const [routecode, setroutecode] = useState('');
  const [action, setaction] = useState('save');
  const [val,setVal]=useState({})
  const [showemptystatus, setemptystatus] = useState(false);
  const [getNetWt, setNetWt] = useState(0);
  const [showNetWtBox,setNetWtBox] = useState(false);
  const [getWt,setWt] = useState('');
  const [getCount,setCount] = useState();
  const [getActionStatus,setActionStatus] = useState();
  const [getToken, setToken] = useState('');
  const [getLabel,setLabel] = useState();
  const [getTotalTareWt,setTotalTareWt] = useState();
  const [getTotalMatWt,setTotalMatWt] = useState();
  const [getPlant,setPlant] = useState();


  React.useEffect(() => {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
    let user = localStorage.getItem('userid');
    setLabelTrip(inputTrip.current.offsetWidth);
    setLabelPlant(inputPlant.current.offsetWidth);
    let dbname = localStorage.getItem('db');
    let loginplant = localStorage.getItem('plant')
    let headers = localStorage.getItem('headers');
    setToken(headers)
    setdbvalue(dbname)
    if (dbname == 'dglrmwh'){
      setshowebbil(true)
    }
    setLabeldoc(inputDoc.current.offsetWidth);
    tag_print(loginplant)
    if (dbname == 'dglosm'){
    async function getregdoc() {
    const response = await fetch(process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/fetch_docno?plant=${loginplant}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    console.log(body)
    if (response.status == 200){
      setdoc(body.map(({ trns_doc_no }) => ({ label: trns_doc_no, value: trns_doc_no })));
      setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getregdoc();
  }
  else{
    async function getdoc() {
    const response = await fetch(process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/fetch_docno?plant=${loginplant}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    console.log(body)
    if (response.status == 200){
      setdoc(body.map(({ trns_doc_no }) => ({ label: trns_doc_no, value: trns_doc_no })));
      setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getdoc();
  }
    async function getuserdetails() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`mst_user_hdrs/fetch_user?user_id=${user}`,{headers:{'Authorization': headers}});
    const body = await response.json();
    console.log(body.user_details['plant'])
    if (response.status == 200){
    setplant(body.user_details['plant'])
    setstrloc(body.user_details['str_loc'])
    setplantname(body.plant_name.map(({ plant,plant_name}) => ({ label: plant_name, value: plant })));
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    getuserdetails();
    async function gettruckno() {
    const response = await fetch(process.env.REACT_APP_COMMON_URL+`transport_vehicle_masters/fetch_truck`,{headers:{'Authorization': headers}});
    const body = await response.json();
    if (response.status == 200){
    settruck(body);
     setLoading(false);
    }
    else{
      setLoading(true);
    }
    }
    gettruckno();
  

  }, []);
  const styles = theme => ({
  disabledButton: {
    backgroundColor: theme.palette.primary || 'red'
  },
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

 const handletriptype = event => {
  setTrip(event.target.value)
  };

  const handletruck = (event,value) => {
    setVendor(value.name1)
    settrucktype(value.truck_type_desc)
    settrucktypecode(value.truck_type)
    setvendorcode(value.vendor)
    settruckno(value.truck_no)
  }; 

  const handleplant = event => {
   setspinner(true)
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
        setspinner(false)
        settoplant(response.data.plant)
        } 
      })
      .catch(error => {
         setspinner(false)
      })
    };

  const handleDoc = event => {
    setspinner(true)
    axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url: process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/fetch_docno_list?trns_doc_no=${event.target.value}`,
      })
      .then(response =>{
        console.log(response.data)
        if (response.status == 200)
        {
        setspinner(false)
        setregdate(response.data.trns_doc_date)
        setdisplayvendor(response.data.transport_vendor)
        setTrip(response.data.trip_type)
        setdisplaytrucktype(response.data.truck_type)
        setname(response.data.driver_name)
        setphone(response.data.driver_phone)
        setempty(response.data.empty_truck_wt)
        setloaded(response.data.total_truck_wt)
        setdl(response.data.driver_license)
        setsto(response.data.sto_no) 
        setid(response.data.id)  
        setfromplant(response.data.to_plant)  
        setcreate(response.data.created_at) 
        setBinCount(response.data.no_of_bins) 
        setupdate(response.data.updated_at)
        setdocno(response.data.trns_doc_no)  
        setVendor(response.data.transport_vendor)
        settrucktype(response.data.truck_type_desc)
        settrucktypecode(response.data.truck_type)
        setvendorcode(response.data.vendor)
        settruckno(response.data.truck_no)
        setActionStatus(response.data.action_status)
        setTotalTareWt(response.data.total_tare_wt)
        setTotalMatWt(response.data.total_mat_wt)
        setPlant(response.data.plant)
        } 
        const items = truck
          items.map((item,index) => {
           if(item.truck_no == response.data.truck_no)
           {
            setVal(items[index])         
           }
          });
  
        let sto = document.getElementById("sto").value;
          if (response.data.action_status == 'open'){
            var x = document.getElementById("save");
            x.style.display = "block";
            var x = document.getElementById("submit");
            x.style.display = "none"; 
            setopenstatus(true)
            setloaded('')
            setemptystatus(false)
          }
          if (response.data.action_status == 'picked'  && (response.data.total_truck_wt == '0.0' || response.data.total_truck_wt == '0' || response.data.total_truck_wt == '' || response.data.total_truck_wt == null)){
            var x = document.getElementById("save");
            x.style.display = "block";
            var x = document.getElementById("submit");
            x.style.display = "block"; 
            setNetWtBox(true)
            setopenstatus(false)
            setdisables(true)
            route();
            setemptystatus(true)
            getBatchWt();
        }
        if(response.data.action_status == 'closed'){
          if (response.data.empty_truck_wt == null || response.data.total_truck_wt == null){
            var x = document.getElementById("save");
            x.style.display = "block";
            setdisables(true)
            setopenstatus(true)
             setemptystatus(true)
          }
          else{
            var x = document.getElementById("save");
            x.style.display = "none";
            setdisables(true)
            setopenstatus(true)
             setemptystatus(true)
          }
            var x = document.getElementById("submit");
            x.style.display = "none"; 
            setdisables(true)
            setopenstatus(true)
             setemptystatus(true)
          if (sto != ''){
            var x = document.getElementById("Barcode");
            x.style.display = "block"; 
            setdisables(true)
            setopenstatus(true)
             setemptystatus(true)
          }
          else{
            var x = document.getElementById("Barcode");
            x.style.display = "none"; 
            setdisables(true)
            setopenstatus(true)
             setemptystatus(true)
          }
        }
         if(response.data.action_status == 'completed'  || response.data.action_status=='issued'){
            var x = document.getElementById("save");
            x.style.display = "none";
            var x = document.getElementById("submit");
            x.style.display = "none"; 
            setdisables(true)
            setopenstatus(true)
            setemptystatus(true)
            var x = document.getElementById("Barcode");
            x.style.display = "block"; 

          }
          if (response.data.sap_status == 'N'){
            setsapn(true)
            setsapy(false)
          }

          if (response.data.sap_status == 'Y'){
            setsapy(true)
            setsapn(false)
          }

          if(response.data.sto_no != null){
            setsapy(false)
            setsapn(false)
          }
      })
      .catch(error => {
        ToastsStore.error("No records found")
      })
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleDocument = event => {
    setspinner(true)
    axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url: process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/fetch_docno_list?trns_doc_no=${event.target.value}`,
      })
      .then(response =>{
        console.log(response.data)
        if (response.status == 200)
        {
        setspinner(false)
        setregdate(response.data.trns_doc_date)
        setdisplayvendor(response.data.transport_vendor)
        setTrip(response.data.trip_type)
        setdisplaytrucktype(response.data.truck_type)
        setname(response.data.driver_name)
        setphone(response.data.driver_phone)
        setempty(response.data.empty_truck_wt)
        setloaded(response.data.total_truck_wt)
        setdl(response.data.driver_license)
        setsto(response.data.sto_no) 
        setid(response.data.id)  
        setdbvalue(response.data.dbname)
        setfromplant(response.data.to_plant) 
        setshowebbil(true); 
        setebbil(response.data.ewaybil)
        setBinCount(response.data.no_of_bins) 
        setcreate(response.data.created_at)  
        setupdate(response.data.updated_at)
        setdocno(response.data.trns_doc_no) 
        setVendor(response.data.transport_vendor)
        settrucktype(response.data.truck_type_desc)
        settrucktypecode(response.data.truck_type)
        setvendorcode(response.data.vendor)
        settruckno(response.data.truck_no)
        setActionStatus(response.data.action_status)
        setTotalTareWt(response.data.total_tare_wt)
        setTotalMatWt(response.data.total_mat_wt)
        setPlant(response.data.plant)
        } 
        const items = truck
          items.map((item,index) => {
           if(item.truck_no == response.data.truck_no)
           {
            setVal(items[index])         
           }
          });
        let ebbill = document.getElementById("ebbill").value;
        let sto = document.getElementById("sto").value;
        if (response.data.action_status == 'open'){
            var x = document.getElementById("save");
            x.style.display = "block";
            var x = document.getElementById("submit");
            x.style.display = "none"; 
          }
        if (response.data.action_status == 'picked'  && (response.data.total_truck_wt == '0.0' || response.data.total_truck_wt == '0' || response.data.total_truck_wt == '' || response.data.total_truck_wt == null)){
            var x = document.getElementById("save");
            x.style.display = "block";
            var x = document.getElementById("submit");
            x.style.display = "block"; 
            setNetWtBox(true)
            setopenstatus(false)
            setdisables(true)
            route();
            // getBatchWt();
        }
        if(response.data.action_status == 'closed'){
          if (response.data.ewaybil == null || response.data.empty_truck_wt == null || response.data.total_truck_wt == null){      
             setdisables(true)
             setopenstatus(true)
             setemptystatus(true)
          }
          else{
            var x = document.getElementById("save");
            x.style.display = "none";
             setdisables(true)
            setopenstatus(true)
          }
            var x = document.getElementById("submit");
            x.style.display = "none"; 
             setdisables(true)
             setopenstatus(true)
              setemptystatus(true)
          if (sto != ''){
            var x = document.getElementById("Barcode");
            x.style.display = "block"; 
             setdisables(true)
             setopenstatus(true)
          }
          else{
            var x = document.getElementById("Barcode");
            x.style.display = "none"; 
             setdisables(true)
              setopenstatus(true)
               setemptystatus(true)
          }
        }
          if(response.data.action_status == 'completed' || response.data.action_status=='issued'){
            var x = document.getElementById("save");
            x.style.display = "none";
            var x = document.getElementById("submit");
            x.style.display = "none"; 
            var x = document.getElementById("Barcode");
            x.style.display = "block"; 
            setdisables(true)
            setopenstatus(true)
            setemptystatus(true)

          }
          if (response.data.sap_status == 'N'){
            setsapn(true)
            setsapy(false)
          }

          if (response.data.sap_status == 'Y'){
            setsapy(true)
            setsapn(false)
          }

          if(response.data.sto_no !=''){
            setsapy(false)
            setsapn(false)
          }
      })
      .catch(error => {
         ToastsStore.error("No records found")
      })
  };



  const checklist = event => {
    window.location.href = '/checklist'
  };

  const checklistedit = event => {
      window.location.href = '/checklistedit'
   };

  const handletrucktype = event => {
      window.location.href = '/checklistedit'
   };

  const submitHandler =(submit,event) =>{ 
      const params = new URLSearchParams();
      var date = document.getElementById("regdate").value
      var trucknumber = document.getElementById("trucknumber").value
      var triptypes = document.getElementById("triptype").value
      var names = document.getElementById("name").value
      var phones = document.getElementById("phone").value
      var loadeds = document.getElementById("loaded").value
      var dls = document.getElementById("dl").value
      var empty_wt = document.getElementById("empty").value
      var sto_number = document.getElementById("sto").value
      let pickedWt = parseInt(getWt)
      let tolerance_value = getCount * 10
      let minWt = (parseInt(pickedWt) - parseInt(tolerance_value))
      let maxWt  =   (parseInt(pickedWt) + parseInt(tolerance_value)) 
      if (triptypes == '' ){
         ToastsStore.error("Please enter the Truck number")
       }
      else if (loadeds == '' ){
         ToastsStore.error("Please enter the loaded weight")
       }
      else if  (getNetWt < 0){
        ToastsStore.error("Loaded wt is less than empty wt")
      }
      else if ((parseInt(getNetWt) > maxWt || parseInt(getNetWt) < minWt) && getActionStatus == 'picked'){
        ToastsStore.error(`Net wt is not in the range between : ${minWt}Kg and ${maxWt}Kg`)
      }
      else{
          var doc = document.getElementById("doc").innerText
          params.set('trns_doc_no',doc)
          params.set('trns_doc_date',regdate);
          params.set('truck_no',truckno)
          params.set('trip_type',trip)
          params.set('driver_name',name)
          params.set('driver_phone',phone);
          params.set('driver_license',dl)
          params.set('sto_no',sto)
          params.set('empty_truck_wt',empty)
          params.set('total_truck_wt',loaded)
          params.set('truck_route',routecode)
          params.set('transport_vendor',vendor);
          params.set('truck_type',trucktypecode);
          params.set('vendor',vendorcode);
          params.set('truck_type_desc',trucktype);
          params.set('id',id)

         setspinner(true)
        axios({
        method: 'patch',
         headers: {
        'Authorization': getToken
        },
        url: process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/update_status`,
        data: params
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            if (submit == 'submit'){
            ToastsStore.success("Submitted successfully")
            }
            var x = document.getElementById("checkbutton");
            x.style.display = "none";
            var x = document.getElementById("save");
            x.style.display = "none";
            var x = document.getElementById("submit");
            x.style.display = "none";
            setdisables(true)
            setopenstatus(true)
          }
        })
        .catch(error => {
         ToastsStore.error("Not updated")
        })
      }
    }


    const saveHandler =(save,event) =>{
      const params = new URLSearchParams();
      var date = document.getElementById("regdate").value
      var trucknumber = document.getElementById("trucknumber").value
      var triptypes = document.getElementById("triptype").value
      var names = document.getElementById("name").value
      var phones = document.getElementById("phone").value
      var loadeds = document.getElementById("loaded").value
      var dls = document.getElementById("dl").value
      var empty_wt = document.getElementById("empty").value
      var sto_number = document.getElementById("sto").value
      let pickedWt = parseInt(getWt)
      let tolerance_value = getCount * 10
      let minWt = (parseInt(pickedWt) - parseInt(tolerance_value))
      let maxWt  =   (parseInt(pickedWt) + parseInt(tolerance_value)) 

      if (triptypes == '' ){
        ToastsStore.error("Please enter the Truck number")
       }
      else if (getNetWt < 0 ){
        ToastsStore.error("Loaded wt is less than empty wt")
      }
      else if ((parseInt(getNetWt) > maxWt || parseInt(getNetWt) < minWt) && getActionStatus == 'picked'){
        ToastsStore.error(`Net wt is not in the range between : ${minWt}Kg and ${maxWt}Kg`)
      }
      else{
          var doc = document.getElementById("doc").innerText
          params.set('trns_doc_no',doc)
          params.set('trns_doc_date',regdate);
          params.set('truck_no',truckno)
          params.set('trip_type',trip)
          params.set('driver_name',name)
          params.set('driver_phone',phone);
          params.set('driver_license',dl)
          params.set('sto_no',sto)
          params.set('empty_truck_wt',empty)
          params.set('total_truck_wt',loaded)
          params.set('truck_route',routecode)
          params.set('transport_vendor',vendor);
          params.set('truck_type',trucktypecode);
          params.set('vendor',vendorcode);
          params.set('truck_type_desc',trucktype);
          params.set('id',id)

         setspinner(true)
        axios({
        method: 'patch',
         headers: {
        'Authorization': getToken
        },
         url: process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/update_list`,
        data: params
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            if (save == 'save'){
            ToastsStore.success("Updated successfully")
            }
            var x = document.getElementById("checkbutton");
            x.style.display = "none";

          }
                
        })
        .catch(error => {
          ToastsStore.error("Not updated")
        })
      }
   
    }

  const route = event =>{
    var doc = document.getElementById("doc").innerText
    let api_url 
    if (dbvalue == 'dglosm'){
      api_url =  process.env.REACT_APP_OSM_URL+`osm_issue_dtls/fetch_plantlocation?trns_doc_no=${doc}`
    }
    else {
      api_url =  process.env.REACT_APP_STORES_URL+`wh_sto_dtls/fetch_plantlocation?trns_doc_no=${doc}`
    }
     setspinner(true)
      axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url:api_url
      })
      .then(response =>{
        if(response.status == 200){
          setspinner(false)
          setsourceplant(response.data.source_plant)
          setsourcestrloc(response.data.source_str_loc)
          routename(plant,strloc,response.data.source_plant,response.data.source_str_loc)
        } 
      })
      .catch(error => {
        setspinner(false)
         ToastsStore.error("No records found for this document")
      })
    }

  const getBatchWt = event =>{
    var doc = document.getElementById("doc").innerText
    let api_url 
    if (dbvalue == 'dglosm'){
      api_url =  process.env.REACT_APP_OSM_URL+`osm_issue_dtls/fetch_wt?trns_doc_no=${doc}`
    }
    else {
      api_url =  process.env.REACT_APP_STORES_URL+`wh_sto_dtls/fetch_wt?trns_doc_no=${doc}`
    }
     setspinner(true)
      axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url:api_url
      })
      .then(response =>{
        if(response.status == 200){
          setspinner(false)
          setWt(response.data.total_wt[0]['sum'])
          setCount(response.data.rfid_list)
        } 
      })
      .catch(error => {
        setspinner(false)
         ToastsStore.error("No records found for this document")
      })
    }


  const routename = (plant,str_loc,source_plant,source_str_loc) =>{
     setspinner(true)
      axios({
      method: 'get',
       headers: {
      'Authorization': getToken
      },
      url:process.env.REACT_APP_COMMON_URL+`plant_route_masters/fetch_route?plant=${plant}&str_loc=${str_loc}&source_plant=${source_plant}&source_str_loc=${source_str_loc}`
      })
      .then(response =>{
        if(response.status == 200){
          setspinner(false)
          setroutecode(response.data.truck_route)
          setroutedesc(response.data.route_description)
        } 
        if(response.status == 201){
          setspinner(false)
          ToastsStore.error("No records found for this plant and location")
        } 
      })
      .catch(error => {
        setspinner(false)
        ToastsStore.error("No records")
      })
    }

    const warehousebarcode = event =>{
    setOpen(true)
    }

    const osmbarcode = event =>{
      setOpen(true)
     }


    const osmcompleted = event =>{
       var doc = document.getElementById("doc").innerText
        setspinner(true)
        axios({
        method: 'patch',
         headers: {
      'Authorization': getToken
      },
        url: process.env.REACT_APP_OSM_URL+`osm_issue_hdrs/update_completed?trns_doc_no=${doc}`
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            ToastsStore.success("Completed successfully")
            window.location.href = '/osmvehicle_edit'
            
          } 
        })
        .catch(error => {
           setspinner(false)
            ToastsStore.error("Not Completed")
        })
      }

     
    const warehousecompleted = event =>{
       var doc = document.getElementById("doc").innerText
       setspinner(true)
        axios({
        method: 'patch',
         headers: {
        'Authorization': getToken
        },
        url: process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_completed?trns_doc_no=${doc}`
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            ToastsStore.success("Completed successfully")
            window.location.href = '/osmvehicle_edit'
          } 
        })
        .catch(error => {
          setspinner(false)
           ToastsStore.error("Not Completed")
        })
      }

    const warehousesubmithandler  =(submit,event) =>{ 

      const params = new URLSearchParams();
      var doc = document.getElementById("doc").innerText
      var trucknumber = document.getElementById("trucknumber").value
      var ebbill = document.getElementById("ebbill").value
       alert(ebbill.length)
      if (doc == '' ){
         ToastsStore.error("Please enter the Truck number")
       }
      else if (ebbill == '' ){
         ToastsStore.error("Please enter the Ewaybill")
      }
      else if (ebbill.length < 12 ){
         ToastsStore.error("Please enter the 12 digit number")
      }
      else if (getNetWt < 0){
        ToastsStore.error("Loaded wt is less than empty wt")
      }
      else{
      params.set('trns_doc_no',doc)
      params.set('trns_doc_date',regdate);
      params.set('truck_no',truckno)
      params.set('trip_type',trip)
      params.set('driver_name',name)
      params.set('driver_phone',phone);
      params.set('driver_license',dl)
      params.set('sto_no',sto)
      params.set('empty_truck_wt',empty)
      params.set('total_truck_wt',loaded)
      params.set('ewaybil',ebbill)
      params.set('dbname',dbvalue)
      params.set('transport_vendor',vendor);
      params.set('truck_type',trucktypecode);
      params.set('vendor',vendorcode);
      params.set('truck_type_desc',trucktype);
      params.set('id',id)
      var date = document.getElementById("regdate").value
      var trucknumber = document.getElementById("trucknumber").value
      var triptypes = document.getElementById("triptype").value
      var names = document.getElementById("name").value
      var phones = document.getElementById("phone").value
      var loadeds = document.getElementById("loaded").value
      var dls = document.getElementById("dl").value
      var empty_wt = document.getElementById("empty").value
      var sto_number = document.getElementById("sto").value
        setspinner(true)
        axios({
        method: 'patch',
         headers: {
        'Authorization': getToken
        },
        url: process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_status`,
        data: params
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            if (submit == 'submit'){
            ToastsStore.success("Submitted successfully")
            }
            var x = document.getElementById("checkbutton");
            x.style.display = "none";
            var x = document.getElementById("save");
            x.style.display = "none";
            var x = document.getElementById("submit");
            x.style.display = "none";
             setdisables(true)
             setopenstatus(true)
             setemptystatus(true)
          }
        })
        .catch(error => {
            ToastsStore.error("Not Updated")
        })
      }
    }

    const printhandlerWH = (print) => {
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
        warehousecompleted()
    }

     const printhandlerOSM = (print) => {
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
        osmcompleted()
      }
   

    const warehousesaveHandler = (save,event,submit) =>{ 
      if (getNetWt < 0 ){
        ToastsStore.error("Loaded wt is less than empty wt")
      }
      else{
      const params = new URLSearchParams();
      var doc = document.getElementById("doc").innerText
      params.set('trns_doc_no',doc)
      params.set('trns_doc_date',regdate);
      params.set('truck_no',truckno)
      params.set('trip_type',trip)
      params.set('driver_name',name)
      params.set('driver_phone',phone);
      params.set('driver_license',dl)
      params.set('sto_no',sto)
      params.set('empty_truck_wt',empty)
      params.set('total_truck_wt',loaded)
      params.set('ewaybil',ebbill)
      params.set('dbname',dbvalue)
      params.set('transport_vendor',vendor);
      params.set('truck_type',trucktypecode);
      params.set('vendor',vendorcode);
      params.set('truck_type_desc',trucktype);
      params.set('id',id)
      var date = document.getElementById("regdate").value
      var trucknumber = document.getElementById("trucknumber").value
      var triptypes = document.getElementById("triptype").value
      var names = document.getElementById("name").value
      var phones = document.getElementById("phone").value
      var loadeds = document.getElementById("loaded").value
      var dls = document.getElementById("dl").value
      var empty_wt = document.getElementById("empty").value
      var sto_number = document.getElementById("sto").value
        setspinner(true)
        axios({
        method: 'patch',
         headers: {
        'Authorization': getToken
        },
        url: process.env.REACT_APP_STORES_URL+`wh_sto_hdrs/update_list`,
        data: params
        })
        .then(response =>{
          if(response.status == 200){
            setspinner(false)
            if (save == 'save'){
            ToastsStore.success("Updated successfully")
            }
            var x = document.getElementById("checkbutton");
            x.style.display = "block";}
        })
        .catch(error => {
            ToastsStore.error("Not Updated")
        })
      }
    }

   const loadHandler = (event) =>{ 
    var net =''
    var netwt = ''
    setloaded(event.target.value)
    netwt = event.target.value - empty
    if (netwt < 0){
      net = 0
    }
    else{
      net = netwt
    }
    setNetWt(net)
   };

    const handleEbil = (e)=>{
    if (e.target.value == '' || ebbill.length > 11){
    }
    else{
      setebbil(e.target.value)
    }
  }

   const tag_print = (loginPlant) =>{
    if (loginPlant == '1801')
    {
     setLabel('OWH-STO-TSL')
    }
    else{
     setLabel('OSM-STO-TSL')
    }
  }




  return (
    <div>
     {open ?
      <Dialog maxwidth={'xs'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <Typography id="title">
       <DialogTitle style={{color:"#3f51b5"}}id="customized-dialog-title" onClose={handleClose}>
        Tag Print
        </DialogTitle> 
        </Typography>
        <DialogContent dividers>
        {dbvalue == 'dglosm' ||  getPlant == '8001' || getPlant == '8002' ?
          <Typography style={{textAlign:"center", fontWeight:"Bold", fontSize:"16px"}}>{getPlant == '8001' ? 'SUPER RUBBER PRODUCT' : 'SUPER RUBBER MIX' }</Typography> :
         <Typography style={{textAlign:"center", fontWeight:"Bold", fontSize:"16px"}}>TVS Srichakra Limited</Typography> }
           <Typography style={{textAlign:"center", fontWeight:"Bold", fontSize:"16px"}}>{getLabel}</Typography>
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography variant="subtitle1" style={{marginTop:"10px", fontWeight:"Bold"}}>Print Time</Typography>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{marginTop:"10px",fontWeight:"Bold",marginLeft:"60px"}}>:</Typography>
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
              <Typography style={{fontWeight:"Bold"}}>Reg. Doc No</Typography>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"44px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{doc}</Typography>
              </ThemeProvider>
            </Grid>
          </Grid>
            <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>STO No</Typography>   
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"77px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{sto}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Transporter Name</Typography>   
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"6px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{warp:"nowrap",fontWeight:"Bold"}} >{vendor}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Truck No</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"68px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{truckno}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Supplier Name</Typography>  
             </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"28px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{fromplant}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>No. of Bins</Typography>  
             </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"52px"}}>:</Typography>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{getBinCount}</Typography>
             </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
              <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>InTime</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"83px"}}>:</Typography>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}} >{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date)}</Typography>
             </ThemeProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>OutTime</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold", marginLeft:"71px"}}>:</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(updatedate)}</Typography>
             </ThemeProvider>
            </Grid>
          </Grid>
          {dbvalue == 'dglrmwh' ? 
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Ewaybill</Typography>
             </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{marginLeft:"74px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{ebbill}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid> : null }
          {dbvalue == 'dglosm' ?
          <Grid container spacing={3} >
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>GrossWt</Typography>
           </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"17px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{loaded}</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>Truck Weight</Typography>
           </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold",marginLeft:"15px"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold"}}>{empty}</Typography>
            </ThemeProvider>
            </Grid>
             </Grid>  : null}
          {dbvalue == 'dglosm' ?
          <Grid container spacing={3} >
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold",marginLeft:"1px"}}>Bin Weight</Typography>
           </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontSize:"14px",fontWeight:"Bold"}}>{getTotalTareWt}</Typography>
            </ThemeProvider>
            </Grid>
            <Grid item>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight:"Bold",marginLeft:"-5px"}}>Material Weight</Typography>
           </ThemeProvider>
            </Grid>
            <Grid item>
              <Typography style={{fontWeight:"Bold"}}>:</Typography>
            </Grid>
            <Grid item>
             <ThemeProvider theme={theme}>
              <Typography style={{fontSize:"14px",fontWeight:"Bold"}}>{getTotalMatWt}</Typography>
            </ThemeProvider>
            </Grid>
          </Grid>  : null}
          <Grid style={{width:"420px"}} container spacing={1} > 
            <Grid item style={{width:"420px"}}   align="center">
              <Barcode  value={sto} height="40px" />  
           </Grid>  
          </Grid> 
        </DialogContent>   
       <Typography id="print"> 
        <DialogActions>
        {showebbill ?
           <Button variant="contained" onClick={() => printhandlerWH({print})}  color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",textTransform:" capitalize"}}>
          Print
           </Button> :   
           <Button variant="contained" onClick={() => printhandlerOSM({print})}  color="primary"  style={{ borderRadius:"20px",backgroundColor:"#b30059",textTransform:" capitalize"}}>
          Print
           </Button>}
        
        </DialogActions> 
        </Typography>
      </Dialog> : null}

    <Sidebar name={Helper.VEHICLE_EDIT_SIDEBAR_NAME}/>
    <form  noValidate autoComplete="off">
    <Grid container justify="center" className="mainContainer" style={{ marginTop: "-25px" }} spacing={0} direction="column" alignItems="center" >
      <Grid item >
        <Card elevation={20}>
          <CardContent style={{ marginLeft:"30px",marginRight:"30px",marginBottom:"10px",marginTop:"10px" }}> 
            <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
            <Backdrop className={classes.backdrop} open={showspinner}>
                  <CircularProgress color="primary" />
            </Backdrop>
             <input type='hidden' value={id} style={{display:'none'}}>
             </input>
            <Grid container spacing={5} >
              <Grid item>
              {showebbill ?
                <FormControl  variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputDoc}    InputLabelProps={{ required: true}} id="demo-simple-select-outlined-label">
                   Reg Doc               
                  </InputLabel>
                 <Select
                    labelId="demo-simple-select-outlined-label"
                    id="doc"
                    onChange={handleDocument}
                    labelWidth={labeldoc}                  
                  >
                    {regdoc.map(item => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                   ))}
                 </Select>
                </FormControl> :   <FormControl  variant="outlined" className={classes.formControl} >
                  <InputLabel ref={inputDoc}    InputLabelProps={{ required: true}} id="demo-simple-select-outlined-label">
                   Reg Doc               
                  </InputLabel>
                 <Select
                    labelId="demo-simple-select-outlined-label"
                    id="doc"
                    onChange={handleDoc}
                    labelWidth={labeldoc}
                                   >
                    {regdoc.map(item => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                         ))}
                 </Select>
                </FormControl>}
                </Grid>
                <Grid item style={{marginLeft:"30px"}} >
                  <TextField id="regdate" disabled={disabled}  label="Registration Date"  value={regdate}   variant="outlined"   
                  />     
                </Grid>
              <Grid item style={{marginLeft:"30px"}} >
               <Autocomplete
                    value={val}
                    disabled={disabled}
                    id="trucknumber" 
                    options={truck }
                    getOptionLabel={(option) => option.truck_no}
                    style={{ width: 220 }}
                    onChange={handletruck}
                    renderInput={(params) => <TextField {...params} label="Truck No" variant="outlined" />}
                  /> 
              </Grid>
              </Grid>
              <Grid container spacing={5} >
                <Grid item>
                  <TextField id="vendor" label="Transport Vendor" disabled={disabled}   InputLabelProps={{ required: true}} variant="outlined" value={vendor} onInput={e => setVendor(e.target.value)}
                  />  
                </Grid>
                <Grid item style={{marginLeft:"30px"}}>
                 <TextField id="trucktype" label="Truck Type" disabled={disabled}  InputLabelProps={{ required: true}} variant="outlined" value={trucktype} onInput={e => settrucktype(e.target.value)}
                  /> 
             
               </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                 <FormControl variant="outlined" disabled={disabled} className={classes.formControl} >
                <InputLabel ref={inputTrip} id="demo-simple-select-outlined-label">
                  Trip Type               
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="triptype"            
                  onChange={handletriptype}
                  labelWidth={labelTrip}
                  value={trip}
                >              
                <option value="Empty Vehicle">Empty Vehicle</option>
                <option value="Load Vehicle">Load Vehicle</option>
              </Select>
            </FormControl>  
                 
              </Grid>
            </Grid>
            <Grid container spacing={5}>
              <Grid item >
                <TextField id="name" onInput={e => setname(e.target.value)} disabled={disabled} InputLabelProps={{ required: true}} label="Driver Name" variant="outlined"
              value={name}/>
              </Grid>
             <Grid item style={{marginLeft:"30px"}} >        
                <TextField 
                type="number"
                id="phone"                       
                label="Driver Phone"
                variant="outlined"  
                value={phone} 
                onInput={e => setphone(e.target.value)} 
                disabled={disabled} 
                InputLabelProps={{ required: true}}                           
                />
              </Grid>
              <Grid item style={{marginLeft:"30px"}} >
                <TextField id="dl" onInput={e => setdl(e.target.value)} disabled={disabled} InputLabelProps={{ required: true}} label="DL Num" variant="outlined"
              value={dl}/>
              </Grid>
              </Grid>
             <Grid container spacing={5}>
             <Grid item>
             {showemptystatus ? 
                <TextField type="number" id="empty" onInput={e => setempty(e.target.value)} disabled InputLabelProps={{ required: true}} label="Vehicle Empty wt in kg" variant="outlined"            
              value={empty}/> :  <TextField type="number" id="empty" onInput={e => setempty(e.target.value)}  InputLabelProps={{ required: true}} label="Vehicle Empty wt in kg" variant="outlined"            
              value={empty}/> }
              </Grid>
              <Grid item style={{marginLeft:"30px"}} > 
               {openstatus ?     <TextField id="loaded" type="number" onInput={loadHandler}  disabled   InputLabelProps={{ required: true}}value={loaded} label="Loaded Wt in Kg"variant="outlined"  
                />   :  
                  <TextField id="loaded"  onInput={loadHandler}  type="number"  InputLabelProps={{ required: true}}value={loaded} label="Loaded Wt in Kg"variant="outlined"  
                />  }            
             </Grid>
              <Grid item style={{marginLeft:"30px"}} > 
               {showNetWtBox ?     <TextField id="netwt" onInput={e => setNetWt(e.target.value)} disabled  InputLabelProps={{ required: true}} value={getNetWt} label="Net Wt in Kg"variant="outlined"  
                />   :  null }            
             </Grid>
            </Grid>
            <Grid container spacing={5}>
             <Grid item >
             <FormControl variant="outlined" disabled={disabled} className={classes.formControl} >
                <InputLabel ref={inputPlant} id="demo-simple-select-outlined-label">
                To Plant         
                </InputLabel>
                <Select
                  labelId="ToPlant"
                  id="plantname"
                  InputLabelProps={{ required: true}}
                  onChange={handleplant}
                  labelWidth={labelPlant}
                  value={fromplant}
                >
                  {plantname.map(item => (
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
              <Grid item style={{marginLeft:"30px"}}>
                <TextField id="sto" onInput={e => setsto(e.target.value)} disabled value={sto} label="STO Invoice" variant="outlined"  
                />
              </Grid>
                {showebbill ? 
               <Grid item style={{marginLeft:"30px"}}>
               {openstatus ? 
              <TextField  type="number" id="ebbill"  disabled value={ebbill} onInput={handleEbil}  label="EBbill" variant="outlined"  
                /> :  <TextField type="number" id="ebbill"   value={ebbill} onInput={handleEbil}  label="EBbill" variant="outlined"  
                /> }
              </Grid> : null }
               {showsapn && dbvalue == 'dglosm' ?
              <Grid item>
               <Typography style={{marginTop:"20px", marginLeft:"30px"}}>SAP Status: </Typography>
              </Grid> : null}
               {showsapn  && dbvalue == 'dglosm' ?
              <Grid item style={{marginLeft:"-30px",marginTop:"3px"}}>
                <div className={classesIcon.root}>
                 <Icon className="fa fa-check-circle" style={{ color:"orange" }} />
                </div>
              </Grid> : null}
              {showsapy  && dbvalue == 'dglosm' ?  
              <Grid item>
              <Typography style={{marginTop:"20px", marginLeft:"30px"}}>SAP Status:</Typography>
              </Grid> : null}
              {showsapy   && dbvalue == 'dglosm' ?    
              <Grid item  style={{marginLeft:"-30px",marginTop:"3px"}}>
               <div className={classesIcon.root}>
                 <Icon className="fa fa-check-circle" style={{ color:"green" }} />
                </div>
              </Grid> : null}
              </Grid> 
              {dbvalue == 'dglrmwh' ?
              <Grid container spacing={5}>
               {showsapn ?
              <Grid item style={{marginTop:"20px"}}>
               <Typography >SAP Status: </Typography>
              </Grid> : null}
               {showsapn ?
              <Grid item style={{marginLeft:"-30px",marginTop:"3px"}} >
                <div className={classesIcon.root}>
                 <Icon className="fa fa-check-circle" style={{ color:"orange" }} />
                </div>
              </Grid> : null}
              {showsapy ?         
              <Grid item style={{marginTop:"20px"}}>
              <Typography >SAP Status:</Typography>
              </Grid> : null}
              {showsapy ?         
              <Grid item  style={{marginLeft:"-30px",marginTop:"3px"}} >
               <div className={classesIcon.root}>
                 <Icon className="fa fa-check-circle" style={{ color:"green" }} />
                </div>
              </Grid> : null}
              </Grid> : null}
            <Grid container justify="center"  style={{ marginTop:35}} >
            <Grid item>
            {showebbill ? 
              <Button id="save" variant="contained" onClick={() => warehousesaveHandler('save')}   color="primary"  style={{ borderRadius:"20px",marginLeft:25,color: "white",textTransform:" capitalize"}}>
                Save
              </Button> : <Button id="save" variant="contained"onClick={() => saveHandler('save')}   color="primary"  style={{ borderRadius:"20px",marginLeft:25,color: "white",textTransform:" capitalize"}}>
                Save
              </Button>}
            </Grid>
             <Grid item>
             {showebbill ? 
              <Button id="submit" variant="contained" onClick={() => warehousesubmithandler('submit')}   style={{borderRadius:"20px", marginLeft:25,backgroundColor:"green",color: "white",textTransform:" capitalize"}}>
                Submit
              </Button> : <Button id="submit" variant="contained" onClick={() => submitHandler('submit')}   style={{borderRadius:"20px", marginLeft:25,backgroundColor:"green",color: "white",textTransform:" capitalize"}}>
                Submit
              </Button>}
            </Grid>
            <Grid item>
              <Button id="checkbutton" onClick={checklistedit}  variant="contained" color="primary" style={{borderRadius:"20px",display:'none',marginLeft:25,textTransform:" capitalize"}} >
                Checklist
              </Button>
            </Grid>
             <Grid item>
             {showebbill ?
              <Button id ='Barcode' variant="contained" onClick={warehousebarcode} color="primary" style={{ borderRadius:"20px",marginLeft:25,backgroundColor:"Tomato",textTransform:" capitalize",display:'none'}} >
                Barcode
              </Button> :   <Button id ='Barcode' onClick={osmbarcode} variant="contained" color="primary" style={{ borderRadius:"20px",marginLeft:25,backgroundColor:"Tomato",textTransform:" capitalize",display:'none'}} >
                Barcode
              </Button>}
            </Grid>
           
            <Grid item>
              <Button variant="contained" onClick={Actionhelper.exitBtn()}   style={{borderRadius:"20px", marginLeft:25,textTransform:" capitalize",backgroundColor:"#8585ad"}}>
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


