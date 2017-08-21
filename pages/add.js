import React, {Component} from 'react'
import Router from 'next/router'
import btoa from 'btoa'
import 'isomorphic-fetch'
import Head from 'next/head'
import withRoot from '../components/withRoot'

import Link from 'next/link'
import Formsy from 'formsy-react';
import FormsyText from '../components/FormsyWrapper/FromsyText';
import Select from 'react-select';

import Avatar from 'material-ui/Avatar'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import { Email, Work, Phone, LocationOn} from 'material-ui-icons'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

const basicAuth = btoa(`ikhsan@test.com:1234567`)
const styles = {
  root: {
    marginTop: 30,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    position:'absolute',
    margin:'auto'
  },
  frame : {
    position:'relative',
    height:'150px'
  },
  btn : {
    display: 'inline-block',
    verticalAlign:'middle',
    position:'absolute',

    marginTop : '15%'
  }
}

const option = {
  address : [
    { value: 'Work', label: 'Work' },
    { value: 'Home', label: 'Home' },
    { value: 'Other', label: 'Other' }
  ],
  phone : [
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Work', label: 'Work' },
    { value: 'Home', label: 'Home' }
  ],
  email : [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Other', label: 'Other' }
  ]
}

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail : {
        name: '',
        title: '',
        address: [{
          option : "Work"
        }],
        phone: [{
          option : "Mobile"
        }],
        email: [{
          option : "Personal"
        }],
        avatar : ""
      },
      file : "",
      openSnackBar : false,
      message: null
    };
  }

  async componentDidMount(){
    const {id} = this.props.url.query
    if(id){
      const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts/${id}`, {
        method : 'GET', 
        headers : {
          'Authorization' : `Basic ${basicAuth}`
        }
      });
      const json = await res.json()
      this.setState({detail : json})
    }
  }

  async submitAdd(){

   await this.setStateAsync({openSnackBar : true, message : "saving contact..."})

   if(this.state.detail._id){
      const id =  this.state.detail._id
      const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts/${id}`, {
        method : 'PUT', 
        headers : {
          'Authorization' : `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.detail)
      });
      Router.push('/contact/' + this.state.detail._id)
   }else{
      const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts`, {
        method : 'POST', 
        headers : {
          'Authorization' : `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.detail)
      });

      Router.push('/')
      }
  }

  addMore = (index) => {
    const detail = this.state.detail;
    detail[index].push({
      option: 'Work'
    });
    this.setState({ detail : detail});
  }

  handleChangeName = (event) => {
    const detail = this.state.detail;
    detail.name = event.target.value;
    this.setState({ detail : detail });
  };

  handleChangeTitle = (event) => {
    const detail = this.state.detail;
    detail.title = event.target.value;
    this.setState({ detail : detail });
  };

  handleChangeWork = (event) => {
    const detail = this.state.detail;
    detail.company = event.target.value;
    this.setState({ detail : detail });
  };

  handleChangeValue = (event, i, menu, prop) => {
    const detail = this.state.detail;
    detail[menu][i][prop] = event.target.value;
    this.setState({ detail : detail });
  };

  handleChangeOption = (val, i, menu) => {
    const detail = this.state.detail;
    detail[menu][i].option = val.value;
    this.setState({ detail : detail });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }


  async upload(event){
    const files = event.target.files
    const avatar = ""
    await this.setStateAsync({files : files})
    if(files.length > 0){
      const fd = new FormData(); 
      /*
      files.map((file)=>(
        fd.append('avatar', file.lfFile)
      ))
      */
      fd.append('avatar', files[0]);
      
      await fetch(`https://kontakplus.herokuapp.com/api/contacts/upload`, {
        method : 'POST', 
        headers : {
          'Authorization' : `Basic ${basicAuth}`
        },
        credentials: 'include',
        body: fd
      }).then(function(response) {
        console.log(response)
        //await this.setStateAsync({openSnackBar : true, message : "image uploaded"})
        const avatar = response.data.avatar
      }).catch(function(error){
        console.log(error)
        //this.setState({openSnackBar : true, message : "uploading image failed"});
      });
      
      await this.setStateAsync({openSnackBar : true, message : "image uploaded", avatar: avatar})
    }
  }

  handleCloseSnackBar = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    this.setState({openSnackBar : false});
  }

  render (){
    //this.setState({detail : this.props.result})
    return (
      <div>
        <Formsy.Form onValidSubmit={()=> this.submitAdd()}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton>
                <Link href="/"><ArrowBackIcon color="white"/></Link>
              </IconButton>
              <Typography type="title" color="inherit">
                {this.state.detail._id ? 'Edit Contact' : 'Add New Contact'}
              </Typography>
              <Button type="submit" color="contrast" style={{float:"right !important"}}><SaveIcon /></Button>
            </Toolbar>
          </AppBar>


        
          <table style={{ width:'100%', margin:'5px' }}>
            <tbody>
              <tr>
                <td>Name</td>
                <td colSpan="2">
                  <FormsyText label="Name" style={{ width: '90%' }} type="text" name="name" id="name" 
                    requiredError="Name is required" required value={this.state.detail.name} onChange={this.handleChangeName}
                  />
                </td>
              </tr>
              <tr>
                <td>Title</td>
                <td colSpan="2">
                  <FormsyText label="Title" style={{ width: '90%' }} type="text" name="title" id="title"
                    requiredError="Title is required" required value={this.state.detail.title} onChange={this.handleChangeTitle}
                  />
                </td>
              </tr>
              {this.state.detail.address.map((address, index) => (
                <tr key={index}>
                  <td><LocationOn/></td>
                  <td><Select
                    name="address"
                    value={address.option}
                    options={option.address}
                    onChange={(val) => this.handleChangeOption(val, index, 'address')}
                    style={{ width: '100%' }}
                  /></td>
                  <td><FormsyText
                    label="Address"
                    style={{ width: '90%' }}
                    type="text"
                    name="address"
                    id="address"
                    value={address.address}
                    onChange={(event) => this.handleChangeValue(event, index, 'address', 'address')}
                  /></td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td><Button color="primary" aria-label="addMore" onClick={()=> this.addMore('address')} style={{float: 'right'}}>
                      <AddIcon /> Add more
                    </Button></td>
              </tr>


              {this.state.detail.email.map((email, index) => (
                <tr key={index}>
                  <td><Email/></td>
                  <td><Select
                    name="email"
                    value={email.option}
                    options={option.email}
                    onChange={(val) => this.handleChangeOption(val, index, 'email')}
                    style={{ width: '100%' }}
                  /></td>
                  <td><FormsyText
                    label="email"
                    style={{ width: '90%' }}
                    type="text"
                    name="email"
                    id="email"
                    value={email.email}
                    onChange={(event) => this.handleChangeValue(event, index, 'email', 'email')}
                  /></td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td><Button color="primary" aria-label="addMore" onClick={()=> this.addMore('email')} style={{float: 'right'}}>
                      <AddIcon /> Add more
                    </Button></td>
              </tr>


              {this.state.detail.phone.map((phone, index) => (
                <tr key={index}>
                  <td><Phone/></td>
                  <td><Select
                    name="phone"
                    value={phone.option}
                    options={option.phone}
                    onChange={(val) => this.handleChangeOption(val, index, 'phone')}
                    style={{ width: '100%' }}
                  /></td>
                  <td><FormsyText
                    label="phone"
                    style={{ width: '90%' }}
                    type="text"
                    name="phone"
                    id="phone"
                    value={phone.number}
                    onChange={(event) => this.handleChangeValue(event, index, 'phone', 'number')}
                  /></td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td><Button color="primary" aria-label="addMore" onClick={()=> this.addMore('phone')} style={{float: 'right'}}>
                      <AddIcon /> Add more
                    </Button></td>
              </tr>
              


              <tr>
                <td><Work/></td>
                <td colSpan="2">
                  <FormsyText label="Work" style={{ width: '90%' }} type="text" name="work" id="work"
                   value={this.state.detail.company} onChange={this.handleChangeWork}
                  />
                </td>
              </tr>

              
            </tbody>
          </table>


          <table style={{ width:'100%', margin:'10px' }}>
            <tbody>
              <tr>
                <td>
                  <div style={styles.frame}>
                    <Avatar src={this.state.detail.avatar || '../static/img/default-people.png'} style={styles.avatar} />
                  </div>
                </td>
                <td>
                  <div style={styles.frame}>
                   <input type="file" name="pic" accept="image/*" 
                      onChange={(event) => this.upload(event)} 
                      style={styles.btn} />
                  </div>
                </td>

                
              </tr>
            </tbody>
          </table>
          
          <Snackbar style={{width : '30%', height : '20%', marginLeft : '1%'}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.openSnackBar}
            autoHideDuration={6e3}
            onRequestClose={this.handleCloseSnackBar}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.message}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleCloseSnackBar}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </Formsy.Form>
      </div>
    )
  }
}

export default withRoot(Add)
/*
{
"_id": "5954d77e7520a4028cc04ecf",
"__v": 2,
"updated": "2017-07-01T10:08:16.178Z",
"created": "2017-06-29T10:33:34.872Z",
"favorite": false,
"avatar": "https://storage.googleapis.com/multer-sharp.appspot.com/60378c649ce916427ada096cd31a833b",
"company": "asdasdsa",
"address": [
{
"option": "Work"
},
{
"option": "Home"
},
{
"address": "grrhfghfgh",
"option": "Other"
}
],
"phone": [
{
"number": "234234",
"option": "Mobile"
},
{
"number": "234234",
"option": "Work"
}
],
"email": [
{
"email": "ikhsan@123.com",
"option": "Personal"
},
{
"email": "ikhsan@test.com",
"option": "Work"
}
],
"title": "adasd",
"name": "Ana Barbera"
}
*/