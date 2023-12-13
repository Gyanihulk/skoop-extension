import React, { Component } from 'react';
import { MdOutlineScheduleSend } from "react-icons/md";
import { Container, Card, Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import API_ENDPOINTS from './apiConfig.js';

class ChatGpt extends Component {
  constructor(props) {
    super(props);
    this.state = { cgpt: '', prompt: '', loading: false, loadingTime: 0, waitingMessage: ''};
    this.handleChange = this.handleChange.bind(this);
    this.sendPrompt = this.sendPrompt.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {prompt,loading, loadingTime } = this.state;
  
    if (loading !== prevState.loading || loadingTime !== prevState.loadingTime) {
      let intervalId;
  
      if (loading) {
        intervalId = setInterval(() => this.setState({ loadingTime: this.state.loadingTime + 1 }), 1000);
        
        if (this.state.loadingTime> 5) {
          this.setState({
            waitingMessage: "Generating a suitable response, please wait"
          })
        }
        if (this.state.loadingTime> 15) {
          this.setState({
            waitingMessage: "Bigger text takes more time , please wait"
          })
        }
      }
  
      if (prevState.intervalId) {
        clearInterval(prevState.intervalId);
      }
  
      this.setState({ intervalId });
    }
    if (prompt !== prevState.prompt) {
      const responseText=prompt
      const lineCount = (responseText.match(/\n/g) || []).length + 1;
      const lineHeight = 16;  // same as font size of textarea
      const newHeight = lineHeight * lineCount;
      console.log("the line count is ",lineCount)
      const responseArea=document.getElementById('skoop_cgpt_response')
      if(responseArea!=null)
        responseArea.style.height=`${newHeight}px`;
    }
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

  render() {
    return (
      <div>
        <Card class="card-body" style={{ padding: '10px', textAlign: 'center' }}>
            <Form onSubmit={this.sendPrompt}>
              <Form.Group as={Row} className="align-items-center">
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="Message ChatGPT..."
                    name="cgpt"
                    value={this.state.cgpt}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={2}>
                  <button type="submit" style={{ fontSize: '24px', color: '#0d6efd', border:'none', background:'none' }}>
                    <MdOutlineScheduleSend />
                  </button>
                </Col>
              </Form.Group>

              {this.state.loading ? (
                <>
                <div className="sbl-circ-ripple"></div>
                <h6>{this.state.waitingMessage}</h6>
                </>
                
              ) : null}

              {this.state.prompt !== '' && !this.state.loading && (
                <>
                  <Form.Label className="mb-2 text-start">Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="auto"
                    name="prompt"
                    value={this.state.prompt}
                    onChange={this.handleChange}
                    id="skoop_cgpt_response"
                    style={{
                      overflow: 'hidden',
                      resize: 'none',
                      fontSize: '16px',
                      border:'none',
                      height: 'auto', 
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';  
                        e.target.style.height = `${e.target.scrollHeight}px`; 
                      }}
                      />
                  <Row>
                    <Col sm={7}></Col>
                    <Col sm={5} className="d-flex justify-content-end">
                    
                    </Col>
                  </Row>
                </>
              )}
            </Form>
            {this.state.prompt !== '' && !this.state.loading && (
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop:'4px' }}>
              <button
                style={{ fontSize: '14px', color: '#0d6efd', border: 'none', background: 'none' }}
                onClick={() => {
                  navigator.clipboard.writeText(this.state.prompt);
                }}
              >
                Copy
              </button>
              <button
                style={{ fontSize: '14px', color: '#0d6efd', border: 'none', background: 'none' }}
                onClick={() => {
                  this.props.appendToBody(this.state.prompt);
                }}
              >
                Merge
              </button>
            </div>
            )}
            </Card>
        <br />
        <br />
      </div>
    );
  }
}

export default ChatGpt;
