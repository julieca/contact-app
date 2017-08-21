import React, {Component} from 'react'
import Router from 'next/router'
import btoa from 'btoa'
import 'isomorphic-fetch'
import Head from 'next/head'
import withRoot from '../components/withRoot'
import Avatar from 'material-ui/Avatar'
import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table'
import Checkbox from 'material-ui/Checkbox'
//import FilterListIcon from 'material-ui-icons/FilterList'
import Link from 'next/link'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

const basicAuth = btoa(`ikhsan@test.com:1234567`)
const styles = {
  avatar: {
    width: 50,
    height: 50,
    display: 'block'
  },
  btnAdd : {
   position:'fixed',
   right:'4px',
   bottom:'4px',  }
}

class Index extends Component {
  static async getInitialProps(){
    const res = await fetch(`https://kontakplus.herokuapp.com/api/contacts`, {
      method : 'GET', 
      headers : {
        'Authorization' : `Basic ${basicAuth}`
      }
    })
    const json = await res.json()
    return {
      results : json
    }
  }

  render (){
    const { results } = this.props;
    return <div>
        <Table>
          <TableBody>
            {results && results.map((result, index) => (
              <Link key={index} as={`/contact/${result._id}`} href={`/detail?id=${result._id}`}>
                <TableRow hover>
                    <TableCell><Avatar src={result.avatar || '../static/img/default-people.png'} style={styles.avatar} /> </TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell><Checkbox /></TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
        <div style={styles.btnAdd}>
          <Link href='/add'>
            <Button fab color="primary" aria-label="add">
              <AddIcon />
            </Button>
          </Link>
        </div>
        
      </div>
  }
}

export default withRoot(Index)
//<Link as={`/detail/${result._id}`} href={`/detail?id=${result._id}`}>
//onClick={() => Router.push('/detail?${result._id}')}
/*
const Index = (props) => (
  <div>
    <table>
      {props.shows.map((show) => (
        <tr key={show._id}>
        <td> <img src={show.avatar} /> </td>
          <td>{show.name}</td>
          <td>{show.created}</td>
        </tr>
      ))}
    </table>
  </div>
)

Index.getInitialProps = async function() {
  const res = await fetch('https://kontakplus.herokuapp.com/api/contacts', {
    method : 'GET', 
    headers : {
      'Authorization' : `Basic ${basicAuth}`
    }
  })
  const json = await res.json()
  console.log(json[0])
  return {
    shows : json
  }
}

export default Index
*/
/*
export default class extends React.Component {
  static async getInitialProps({req}){
    return req
      ? {userAgent : req.headers['user-agent']}
      : {userAgent : navigator.userAgent}
  }

  render (){
    return <div>
    <Head>
      <title>yeah</title>
      <meta name ="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" type="image/x-icon" href="static/img/logo.png" />
    </Head>
    <p style={{color : 'red'}}>annyeong! aha</p>
  </div>
  }
}
*/

/*
import Head from 'next/head'
export default () => (
  <div>
    <Head>
      <title>yeah</title>
      <meta name ="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" type="image/x-icon" href="static/img/logo.png" />
    </Head>
    <p style={{color : 'red'}}>annyeong</p>
  </div>
)
*/