import React,{ Component ,useEffect,useState} from 'react';
import { Container, Form, Button, Col, Card} from 'react-bootstrap';
import API_ENDPOINTS from '../apiConfig';

export class UserInput extends Component{
  constructor(props){
    super(props)
    this.state = { 
      videoTitle:'',
      directoryName:'',
      listOfDirectories: [],
      selectedOption: "none",
      loading: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit= this.handleSubmit.bind(this)
  }

  async componentDidMount(){
    try{
        const response=await this.getDirectories()
        this.setState({
            listOfDirectories: response
        },()=>{
          this.setState({
            loading: false
          })
        })
    }catch(err){
        console.log("something went wrong")
    }
  }

  async getDirectories(){
    var response = await fetch(API_ENDPOINTS.videoDirectories,{
        method: "GET",
        headers: {
            "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    response= await response.json();
    return response 
  }

  handleChange(event){
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault()
    var drName=this.state.selectedOption=='none' ? this.state.directoryName : this.state.selectedOption
    this.props.sharingDetails(this.state.videoTitle,drName)
  }
  render(){
    if(this.state.loading==false){
      return(
        <div style={{position: "relative",zIndex: '5000'}}>
        <Container fluid style={{ marginTop: '3px', background: 'white'}}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Video Title</Form.Label>
              <Form.Control
                type="text"
                name="videoTitle"
                placeholder=""
                value={this.state.videoTitle}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Folder</Form.Label>
              <Form.Control
                as="select"
                name="selectedOption"
                value={this.state.selectedOption}
                onChange={this.handleChange}
              >
                <option value="none">
                  <em>Choose or Create Folder</em>
                </option>
                {this.state.listOfDirectories.map((item) => (
                  <option key={item.directory_name} value={item.directory_name.toString()}>
                    {item.directory_name.toString()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {this.state.selectedOption === 'none' && (
              <Form.Group>
                <Form.Label>Enter New Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="directoryName"
                  placeholder=""
                  value={this.state.directoryName}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            )}
            <div className="d-flex justify-content-end pt-3 gap-2">
            <button style={{ fontSize: '14px', border:'none', background:'none', color:'#0a66c2' }} type="submit">
              Upload
            </button>
            <button style={{ fontSize: '14px', border:'none', background:'none', color:'#000000' }} onClick={this.props.cancelUpload}>
              Cancel
            </button>
            </div>
          </Form>
        </Container>
        <br />
        <br />
      </div>
        
      )
    }
    
  }
}

export const NewFolderInput=(props)=>{
  const [values, setValues] = useState({
      directoryName: ""
  });

  const handleChange = (event)=>{
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
  };
  const CreateNewDirectory= async()=>{
    try{
      const res=await fetch(API_ENDPOINTS.addNewDirectory,{
        method: "POST",
        body: JSON.stringify({
          "directory": values.directoryName
        }),
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      if(res.ok){
        props.closePopup()
        setValues({
          directoryName: ''  
        })
      }
      else throw "error in the database"
    }catch(err){
      alert("some error occured during update");
    }
  }
  const renameDirectory= async()=>{
    try{
      const res=await fetch(API_ENDPOINTS.renameFolder,{
        method: "PATCH",
        body: JSON.stringify({
          "oldDirectoryName": props.oldDirectoryName,
          "newDirectoryName": values.directoryName
        }),
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      if(res.ok){
        props.closePopup()
        setValues({
          directoryName: ''  
        })
      }
    }catch(err){
      alert("some error occurred")
    }
  }
  const handleSubmit = async (event)=>{
      event.preventDefault();
      if(props.oldDirectoryName){
        await renameDirectory();
        return ;
      }
      await CreateNewDirectory()
  }

  return(
    <Card>
  <Card.Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label><strong>{props.oldDirectoryName?"Enter New Folder Name":"Add New Folder"}</strong></Form.Label>
        <Form.Control
          type="text"
          name="directoryName"
          onChange={handleChange}
          value={values.directoryName}
          placeholder="Enter folder Name"
          style={{ width: '100%' }}
        />
        <div className="mt-4 d-flex justify-content-end">
  <button type="submit" size="lg" style={{background:"none", border:"none", color:'#0a66c2'}}>
    Save
  </button>
</div>

      </Form.Group>
    </Form>
  </Card.Body>
</Card>
  )
}
