import React, {Component} from 'react'
import btoa from 'btoa'
import 'isomorphic-fetch'
import withRoot from '../components/withRoot'
import Link from 'next/link'
import Router from 'next/router'

import Snackbar from 'material-ui/Snackbar'
import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table'
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList'
import Button from 'material-ui/Button'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'

import { Email, Work, Phone, LocationOn} from 'material-ui-icons'
import IconButton from 'material-ui/IconButton'
import StarBorderIcon from 'material-ui-icons/StarBorder'
import StarIcon from 'material-ui-icons/Star'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import CloseIcon from 'material-ui-icons/Close'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'

const basicAuth = btoa(`ikhsan@test.com:1234567`)
const styles = {
  avatar: {
    width: '100%',
    height: 'auto',
    display: 'block',
    marginLeft: 'auto',
    marginRight:'auto',
    position : 'absolute'
  },
  divImage : {
    width : '100%',
    height : '300px',
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative'
  },
  backClr : {
    margin: 0,
    position: 'absolute',
    bottom: 0,
    center : 0,
    width : '100%',
    height : '20%',
    backgroundColor : 'rgba(0,0,0,0.3)',
    color : 'white'
  },
  left :{
    position: 'relative',
    float: 'left',
    top: '50%',
    left: '2%',
    transform: 'translate(0%, -50%)'
  },
  right : {
    position: 'relative',
    float: 'right',
    top: '50%',
    right: '2%',
    transform: 'translate(0%, -50%)'
  },
  leftTop :{
    position: 'relative',
    float: 'left',
    top: '2%',
    left: '2%'
  }
}

const stylesTheme = theme => ({
  gridList: {
    width: '100%',
    transform: 'translateZ(0)'
  }
});

class Detail extends Component {
  static async getInitialProps(context){
    const {id} = context.query
    const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts/${id}`, {
      method : 'GET', 
      headers : {
        'Authorization' : `Basic ${basicAuth}`
      }
    })
    const json = await res.json()
    
    if(json == null){
      Router.push('/')
    }
    return {
      result : json
    }
  }

  state = {
    fav: this.props.result.favorite,
    openSnackBar : false,
    message: null,
    openDeleteDialog : false
  }

  handleCloseSnackBar = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }

    this.setState({openSnackBar : false});
  }

  async addFav(id, fav) {
    this.setState({ openSnackBar : true });
    const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts/${id}`, {
      method : 'PUT', 
      headers : {
        'Authorization' : `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        favorite : !fav,
      })
    });
    this.setState({ fav: !fav });
    
  }

  async deleteContact(id, fav) {
    const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts/${id}`, {
      method : 'DELETE', 
      headers : {
        'Authorization' : `Basic ${basicAuth}`
      }
    });
    Router.push('/')
  }

  handleRequestCloseDialog = () => {
    this.setState({ openDeleteDialog: false });
  }

  handleRequestOpenDialog = () => {
    console.log(this)
    this.setState({ openDeleteDialog: true });
  }

  render (){
    const { result } = this.props;
    return (
      <div>
        <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton>
                <Link href="/"><ArrowBackIcon color="white"/></Link>
              </IconButton>
              <Typography type="title" color="inherit">
                Contact
              </Typography>
              <Link as={`/add/${result._id}`} href={`/add?id=${result._id}`}>
                <Button color="contrast" style={{float:"right !important"}}><EditIcon /></Button>
              </Link>
              <Button color="contrast" style={{float:"right !important"}} onClick={this.handleRequestOpenDialog}><DeleteIcon /></Button>
            </Toolbar>
          </AppBar>

          <Dialog open={this.state.openDeleteDialog} onRequestClose={this.handleRequestCloseDialog}>
            <DialogTitle>
              {"Delete Contact"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to delete {result.name} contact ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleRequestCloseDialog} color="primary">
                Disagree
              </Button>
              <Button onClick={() => this.deleteContact(result._id)} color="primary">
                Agree
              </Button>
            </DialogActions>
          </Dialog>

        <div style={styles.divImage}>
          <img src={result.avatar || '../static/img/default-people.png'} style={styles.avatar}/>
          <div style={styles.backClr}>
            <div style={styles.left}><b>{result.name}</b></div>
            <div style={styles.right}>
              <IconButton aria-label="change favorite" onClick={() => this.addFav(result._id, this.state.fav)}>
                {this.state.fav ? <StarIcon color="white" /> : <StarBorderIcon color="white" />}
              </IconButton>
            </div>
          </div>
        </div>

        <Table>
          <TableBody>
            {result.company && 
              <TableRow>
                  <TableCell><Work/></TableCell>
                  <TableCell><b>{result.company}</b></TableCell>
                  <TableCell></TableCell>
              </TableRow>
            }
            {result.address && result.address.map((item, index) => (
              <TableRow key={index}>
                  <TableCell><LocationOn/></TableCell>
                  <TableCell>{item.option}</TableCell>
                  <TableCell><b>{item.address || '-'}</b></TableCell>
              </TableRow>
            ))}
            
            {result.phone && result.phone.map((item, index) => (
              <TableRow key={index}>
                  <TableCell><Phone/></TableCell>
                  <TableCell>{item.option}</TableCell>
                  <TableCell><b>{item.phone || '-'}</b></TableCell>
              </TableRow>
            ))}

            {result.email && result.email.map((item, index) => (
              <TableRow key={index}>
                  <TableCell><Email/></TableCell>
                  <TableCell>{item.option}</TableCell>
                  <TableCell><b>{item.email || '-'}</b></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
          message={<span id="message-id">favorite updated</span>}
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
      </div>
    )
  }
}
export default withRoot(Detail)

/*

        <div style={styles.divImage}>
          <img src={result.avatar} style={styles.avatar}/>
        </div>


        <GridList cellHeight={200} spacing={1}  className={stylesTheme.gridList}>
          <GridListTile key={result._id} cols={1} rows={1}>
            <img src={result.avatar} style={styles.avatar}/>
            <GridListTileBar title={result.name} titlePosition="top" 
                actionIcon={
                  <IconButton>
                    <StarBorderIcon color="white" />
                  </IconButton>                }
                actionPosition="right"
               />
          </GridListTile>
        </GridList>
*/