import React,{ Component ,useEffect,useState} from 'react';
import { Tabs, Tab, Tooltip, Link, Typography, Box, Paper } from '@mui/material';
import { AiFillRobot } from "react-icons/ai";
import { HiMiniGif } from "react-icons/hi2";
import { RiMessage2Fill } from "react-icons/ri";
import { PiCalendarCheckFill } from "react-icons/pi";
import { MdVideoLibrary } from "react-icons/md";
import ChatGpt from '../Chatgpt/index.js';
import GiphyWindow from '../Gif/index.js';
import Library from '../Library/index.js';
import AI from '../Pre-Determined-Msg/index.js';
import API_ENDPOINTS from '../apiConfig.js';
import {insertHtmlAtPositionInMail} from '../../utils'

class EmailComposer extends Component{
  constructor(props){
    super(props)
    this.state = { emailId:'',subject:'',emailBody:``,
     cgpt:'', prompt:'',loading: false , displayComp: 'DefaultCard' ,
     showSuccess: false,cursorPosition: -1
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.sendPrompt= this.sendPrompt.bind(this)
    this.componentDisplaySwitch= this.componentDisplaySwitch.bind(this)
    this.closeShowSuccess=this.closeShowSuccess.bind(this)
    this.send=this.send.bind(this)
    this.getMailResponse=this.getMailResponse.bind(this)
    this.handleInsertion=this.handleInsertion.bind(this)
    this.openCalender=this.openCalender.bind(this)
  }
  
  async send(receiver,sub,mailBody){
    console.log("sending mail using website")
    try{
      var res=await fetch(API_ENDPOINTS.sendMail,{
      method: "POST",
      body: JSON.stringify( {
        "from": "seemant.bishnoi@appfoster.com",
        "to": receiver,
        "subject": sub,
        "html" : mailBody
      }),
      headers: {
        "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        "Content-type":  "application/json; charset=UTF-8"
      }
    })
    this.setState({
      showSuccess: true
    })
    console.log("the show success",this.state.showSuccess)
    setTimeout(this.closeShowSuccess,5000)
    }catch(err){
      console.log("failed to send mail",err)
    }
  }

  closeShowSuccess(){
    this.setState({
      showSuccess: false
    })
    console.log("closing show success",this.state.showSuccess)
  }

  async getMailResponse(inp){
    this.setState({
      emailBody: "Loading ..."
    })
    inp=`write me a reply to mail with snippet =${inp}`
    const choices=await fetch(API_ENDPOINTS.cgpt+ new URLSearchParams({
      input: inp
    }),{
      method: 'GET',
      headers:{
        "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
      }
    });
    const response=await choices.json();
    this.setState({
      emailBody: response.choices[0].message.content
    })
  }

  async handleSubmit(event){
    const { emailId, subject, emailBody, cgpt} = this.state
    event.preventDefault();
    await this.send(emailId,subject,emailBody);
    this.setState({
      emailId: '',
      subject: '',
      emailBody: ''
    })
  }

  handleChange(event){
    this.setState({
      [event.target.name] : event.target.value
    })
  }

 handleInsertion(text){
  console.log("handle insertion end of procedure");
  insertHtmlAtPositionInMail(text);
 }

  componentDisplaySwitch(input) {
    this.setState({
      displayComp: input 
    });
  }  
  
  async sendPrompt(event) {
    event.preventDefault();
    try{
      const { cgpt } = this.state;
      this.setState({
        loading: true,
      });
      const choices = await fetch(API_ENDPOINTS.cgpt + new URLSearchParams({ input: cgpt }), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });
      const response = await choices.json();
      this.setState({
        loading: false,
      });
      this.setState({
        waitingMessage: ''
      });
      this.setState({
        prompt: response.choices[0].message.content,
      });
    }catch(err){
      console.log("could not get chatGpt response",err)
      alert("could not get chatGpt response")
    }      
  }

  openCalender=()=>{  
    this.handleInsertion(`<a href="${API_ENDPOINTS.skoopCalendarUrl}/?username=${JSON.parse(localStorage.getItem('skoopUsername'))}">schedule a meet</a>`)
  }

  handleIconClick = (eventKey) => {
    if(eventKey=='Calendar'){
      this.openCalender();
      return ;
    }
    this.componentDisplaySwitch(eventKey);
  };

  renderTooltip = (props, text) => (
    <Tooltip {...props}>{text}</Tooltip>
  );

  renderNavItem = (eventKey, icon, tooltipText) => (
    <Tab
      key={eventKey}
      label={
        <Tooltip title={tooltipText} placement="right">
          <Link
            component="div"
            className={`custom-nav-link d-flex align-items-center justify-content-center ${
              this.state.displayComp === eventKey ? 'active' : ''
            } mb-3`}
            onClick={() => this.handleIconClick(eventKey)}
          >
            {React.cloneElement(icon, { size: 30, color: '#0a66c2' })}
          </Link>
        </Tooltip>
      }
      value={eventKey}
    />
  );

  render() {
    return (
      <Box sx={{ mt: 4 ,display: 'flex'}}>
        
          <Box sx={{ width: '20%' }}>
            <Tabs
              value={this.state.displayComp}
              onChange={(event, newValue) => this.setState({ displayComp: newValue })}
              orientation="vertical"
            >
              {this.renderNavItem('Chatgpt', <AiFillRobot />, 'Send Chatgpt responses to Mail')}
              {this.renderNavItem('Giphy', <HiMiniGif />, 'Send your favorite GIFs to Mail')}
              {this.renderNavItem('AI', <RiMessage2Fill />, 'Send predetermined custom message responses.')}
              {this.renderNavItem('Calendar', <PiCalendarCheckFill />, 'Send Meeting scheduling calendar link')}
              {this.renderNavItem('Library', <MdVideoLibrary />, 'Send any recorded video or audio file')}
            </Tabs>
          </Box>
          <Box sx={{ width: '5%' }}></Box>
          <Box sx={{ width: '70%' }}>
            {this.state.displayComp === 'Chatgpt' && <ChatGpt appendToBody={this.handleInsertion} />}
            {this.state.displayComp === 'Giphy' && <GiphyWindow appendToBody={this.handleInsertion} />}
            {this.state.displayComp === 'Library' && <Library appendToBody={this.handleInsertion} />}
            {this.state.displayComp === 'AI' && <AI appendToBody={this.handleInsertion} />}

            {this.state.displayComp === 'DefaultCard' && (
              <Paper elevation={1} sx={{ p: 4, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="h5" mb={4} sx={{ textAlign: 'center' }}>
                  Welcome to Skoop
                </Typography>
                <Typography mb={4} sx={{ textAlign: 'center' }}>
                  This is your default view. You can switch between different tabs on the left to explore various features.
                  <br />
                  Explore the features and make the most out of your Email Sending experience!
                </Typography>
              </Paper>
            )}
          </Box>
        
      </Box>
    );
  }
}

export default EmailComposer  

