import React,{UNSAFE_componentWillMount} from 'react';
import Login from './Login';
import Nav from './Nav';
import OSMVehicle from './OSMVehicle';
import Checklist from './Checklist';
import Checklistedit from './Checklistedit';
import OSMvehicleedit from './OSMvehicleedit';
import FactoryRegistration from './FactoryRegistration';
import Weighbridge from './Weighbridge';
import Dashboard from './Dashboard';
import Unloadingprocess from './Unloadingprocess';
import Grnprocess from './Grnprocess';
import OSMReport from './osmreport/OSMReport';
import ExcessStock from './ExcessStock';
import storeport from './storeport';
import TruckTransfer from './TruckTransfer';
import TruckVehicleMaster from './truckVehicleMaster';
import palletRfid from './palletRfid';
import './App.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
require('dotenv').config()



class App extends React.Component{
    render(){
      return(
        <div >
        <main>
          <Router>     
            <Route exact path="/login" component={Login} />
            <Route exact path="/nav" component={Nav} />
            <Route exact path="/osm_vehicle" component={OSMVehicle} />
            <Route exact path="/checklist" component={Checklist} />
            <Route exact path="/checklistedit" component={Checklistedit} />
            <Route exact path="/osmvehicle_edit" component={OSMvehicleedit} />
            <Route exact path="/factory_registration" component={FactoryRegistration} />
            <Route exact path="/weighbridge" component={Weighbridge} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/unloading_process" component={Unloadingprocess} />
            <Route exact path="/grnprocess" component={Grnprocess} />
            <Route exact path="/osmreport" component={OSMReport} />
            <Route exact path="/excessstock" component={ExcessStock} />
            <Route exact path="/storeport" component={storeport} />
            <Route exact path="/trucktransfer" component={TruckTransfer} />
            <Route exact path="/pallet_rfid" component={palletRfid} />
            <Route exact path="/truck_vehicle_master" component={TruckVehicleMaster} />
          </Router>   
        </ main>
        </div>
      )
    }
}



export default App;
