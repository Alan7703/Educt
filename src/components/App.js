import React, { Component } from 'react';
import Web3 from 'web3';
import Document from '../abis/Document.json'
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }



  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState({ account : accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Document.networks[networkId]
    if(networkData){
      const abi = Document.abi
      const address = networkData.address
      console.log(address)
      const contract = web3.eth.Contract(abi,address)
      this.setState({contract})
      console.log(hashValue)
      const hashValue = await contract.methods.get().call()
      this.setState({hashValue})

    }else{
      window.alert('Smart contract not deployed to detected network')
    }
  }
  //Set state to null
  constructor(props){
    super(props);
    this.state = {
      account: '',
      buffer: null,
      contract:null,
      hashValue: "QmTkJYE114pXbeLecRpWpMFS76WoQEst8dX72vXx7N5e6x"
    };
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert("Please use metamask")
    }
  }

  // Capture File
  captureFile = (event) =>{
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({buffer : Buffer(reader.result)})
      //console.log('buffer :', Buffer(reader.result))
    }

  }

  // After submitting 
  // example hash : QmTkJYE114pXbeLecRpWpMFS76WoQEst8dX72vXx7N5e6x
  // example url : https://ipfs.infura.io/ipfs/QmTkJYE114pXbeLecRpWpMFS76WoQEst8dX72vXx7N5e6x
  onSubmit = (event) =>{
    event.preventDefault()
    console.log('submitting...')
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('ipfs result : ', result)
      if(error){
        console.error(error)
        return
      }
      this.state.contract.methods.set(result[0].hash).send({from: this.state.account}).then((r) =>{
          this.setState({hashValue : result[0].hash})
      })
    })
  }

//${this.state.hashValue}
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Credit Platform
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >


                  <iframe src= {`https://ipfs.infura.io/ipfs/${this.state.hashValue}`} height = "500" width = "700"></iframe>
                </a>
                <p>&nbsp;</p>
                <form onSubmit = {this.onSubmit}>
                  <input type = 'file' onChange = {this.captureFile} />
                  <input type = 'submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
