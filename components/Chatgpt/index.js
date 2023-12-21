import React, { Component } from 'react';
import { MdOutlineScheduleSend } from "react-icons/md";
import API_ENDPOINTS from '../apiConfig';

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
        <form onSubmit={this.sendPrompt}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Message ChatGPT..."
              name="cgpt"
              value={this.state.cgpt}
              onChange={this.handleChange}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="submit"
              >
                <MdOutlineScheduleSend />
              </button>
            </div>
          </div>

          {this.state.loading ? (
            <>
              <div className="sbl-circ-ripple"></div>
              <h6>{this.state.waitingMessage}</h6>
            </>
          ) : null}

          {this.state.prompt !== '' && !this.state.loading && (
            <>
             <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <label className="mb-2 text-center">Response</label>
                  <textarea
                    className="form-control"
                    aria-multiline="auto"
                    name="prompt"
                    value={this.state.prompt}
                    onChange={this.handleChange}
                    //id="skoop_cgpt_response"
                    //className="chatgpt-response"
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                  <div className="row">
                    <div className="col-sm-7"></div>
                    <div className="col-sm-5 d-flex justify-content-end"></div>
                  </div>
                </div>
              </div>
            </div>

            </>
          )}
        </form>

        {this.state.prompt !== '' && !this.state.loading && (
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-primary chatgpt-button"
              onClick={() => {
                navigator.clipboard.writeText(this.state.prompt);
              }}
            >
              Copy
            </button>
            <button
              type="button"
              className="btn btn-outline-primary chatgpt-button"
              style={{ fontSize: '14px' }}
              onClick={() => {
                this.props.appendToBody(this.state.prompt);
              }}
            >
              Merge
            </button>
          </div>
        )}
        <br />
        <br />
    </div>
    );
  }
}

export default ChatGpt;
