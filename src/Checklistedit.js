import React from 'react'
import axios from 'axios';
import './Search.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Table} from 'react-bootstrap';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Spinner from 'react-bootstrap/Spinner'
import Sidebar from './utlis/Sidebar'


class Checklistedit extends React.Component {

 constructor(props){
      super(props);
      this.state={
        checked: '',
        input: '',
        doc_no:'',
        checklists : '',
        checklist : [],
        selectchecklist : {
          arraylist:[]
        }, 
      }
     }

    ChangeHandler = (s,e) =>{
      let list = Object.assign([],this.state.checklist);
      let mapList = list.map((item) => {
        if (item.id === s.id) {
          item.input = e.target.value 
        }
      });
      this.setState({ checklist : list }) ;    
    }



  componentDidMount() {  
      axios
      .get(`http://10.10.1.192:3001/api/check_lists/fetch_lists`)
        .then(response =>{
        let items = response.data.records;
        items.map((item) => {
          item.checked = false;
          item.input = ''
          return item;
        });
        items.map((item) => {
        const ischecked = response.data.checklist.some(n => {
         if (item.check_list_code == n.check_list_code){
          item.checked = true
          item.input = n.remark         
         }     
        });
       });
        this.setState({ checklist: items,selectchecklist:items})
        this.setState({ doc_no: response.data.doc_no.trns_doc_no})
        var x = document.getElementById("items");
        x.style.display = "none";
        var x = document.getElementById("save");
        x.style.marginLeft = "130px";
        var x = document.getElementById("exit");
        x.style.marginLeft = "40px";

        })
        .catch(error => {
        })
  }


  
  check = (s,e) =>{
    let list = Object.assign([],this.state.checklist);
    let mapList = list.map((item) => {
      if (item.id === s.id) {
      item.checked = !item.checked     
      }
      return item;
    });
     this.setState({checklist:mapList})


    if (s.checked == true){
     let newlist = Object.assign({},this.state.selectchecklist);
      newlist.arraylist.push(s)
      this.setState({selectchecklist:newlist})
    }
    else{
     this.state.selectchecklist.arraylist.map((item, key) =>{
       if(s.check_list_code == item['check_list_code']){
         this.state.selectchecklist.arraylist.splice(key,1);
       }
     });
    }
  }


  submit = () =>{
    let payload = {
     checklists: this.state.selectchecklist.arraylist
    };
     var x = document.getElementById("spinner");
     x.style.display = "block";
      axios({
        method: 'patch',
        url: `http://10.10.1.192:3001/api/trn_check_lists/update_list?trns_doc_no=${this.state.doc_no}`,
        data: payload
        })
        .then(response =>{
          console.log(response)
          if (response.status == 201)
          {
            var x = document.getElementById("spinner");
            x.style.display = "none";
            window.location.href = '/osm_vehicle'
                 
          }    
          else{
          var x = document.getElementById("erroralert");
          x.style.display = "block";
          window.location.href = '/checklist'
          } 
        })
        .catch(error => {
        })
  }

    exit = event => {
      window.location.href = '/osmvehicle_edit'
     };
 

  render() {
    const {checklists} = this.state
    const {doc_no} = this.state
    const {input} = this.state
    return (
      <div>
      <Sidebar/>
      <Grid container justify="center" className="mainContainer" style={{ marginTop: "30px" }} spacing={0} direction="column" alignItems="center" >
        <Grid item >
          <h6 id="erroralert" style={{display:'none',color:"red"}}>
            Not saved
          </h6>
          <Grid item align='center'>
          <Spinner id='spinner' style={{display:'none'}} animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          </Grid>
          <Card elevation={20} >
            <CardContent style={{ margin:"30px" }}> 
              <Grid container>
                <Grid item >
                  <h5 align='center'>Checklist</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr style={{ backgroundColor: "#3f51b5" }} >
                        <th  style={{ border: "1px solid black",color:"white"}}>Select</th>
                        <th  style={{ border: "1px solid black",color:"white" }}>Check List</th>
                        <th  style={{ border: "1px solid black" ,color:"white"}}>Remarks</th>
                      </tr>
                      <tr id="items">
                        <th colspan="4" style={{backgroundColor: "white",textAlign:"center"}} scope="colgroup">No items</th>
                      </tr>
                    </thead>
                    {this.state.checklist.map((s) => (
                    <tbody style={{ border: "1px solid black" }}>             
                      <tr rowkey={s.id} >
                        <td   style={{ border: "1px solid black" }}><input checked = {s.checked} onChange={(e)=>this.check(s,e)} type="checkbox"  id ='checks'name="name2" /></td>
                        <td  style={{ border: "1px solid black" }}>{s.check_list_desc}</td>
                        <td  style={{ border: "1px solid black" }}><input type="text"  onChange={(e) => this.ChangeHandler(s, e)} className="form-control" name={s.id} value={s.input} />
                        <input type="hidden"  name={doc_no} value={doc_no} /></td>
                      </tr>
                    </tbody>
                    ))
                   }
                  </Table>
                </Grid>
              </Grid>
              <Grid item>
               <Button id="save" variant="contained" color="primary" style={{marginLeft:"180px",borderRadius:"20px"}} onClick={this.submit}>
                Save
              </Button>
               <Button id="exit" variant="contained" color="primary"style={{borderRadius:"20px",backgroundColor:"#ff6666",marginLeft:"50px"}} onClick={this.exit}>
                Exit
              </Button>
             </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </div>
    );
  }
}
export default Checklistedit