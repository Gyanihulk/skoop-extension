import React, { useState, useEffect } from 'react';
import { MdOutlineScheduleSend } from "react-icons/md";
import API_ENDPOINTS from '../apiConfig';
import { handleCopyToClipboard } from '../../utils';

const ChatGpt = ({ appendToBody }) => {
  const [cgpt, setCgpt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [waitingMessage, setWaitingMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'cgpt') {
      setCgpt(value);
    }
    if(name === 'prompt'){
      setPrompt(value);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingTime(prevLoadingTime => prevLoadingTime + 1);
    }, 1000);

    if (loadingTime > 5) {
      setWaitingMessage("Generating a suitable response, please wait");
    }
    if (loadingTime > 15) {
      setWaitingMessage("Bigger text takes more time , please wait");
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [loading, loadingTime]);

  useEffect(() => {
    const responseText = prompt;
    const lineCount = (responseText.match(/\n/g) || []).length + 1;
    const lineHeight = 16;  // same as font size of textarea
    const newHeight = lineHeight * lineCount;

    const responseArea = document.getElementById('skoop_cgpt_response');
    if (responseArea !== null) {
      responseArea.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  const sendPrompt = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const choices = await fetch(API_ENDPOINTS.cgpt + new URLSearchParams({ input: cgpt }), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
      });

      const response = await choices.json();
      setLoading(false);
      setWaitingMessage('');
      setPrompt(response.choices[0].message.content);
    } catch (err) {
      console.log("could not get chatGpt response", err);
      alert("could not get chatGpt response");
    }
  };

  return (
    <div>
      <form onSubmit={sendPrompt}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ask ChatGPT..."
            name="cgpt"
            value={cgpt}
            onChange={handleChange}
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

        {loading ? (
          <>
            <div className="sbl-circ-ripple"></div>
            <h6>{waitingMessage}</h6>
          </>
        ) : null}

        {prompt !== '' && !loading && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <label className="mb-2 text-center">Response</label>
                  <textarea
                    className="form-control"
                    aria-multiline="auto"
                    name="prompt"
                    value={prompt}
                    onChange={handleChange}
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

      {prompt !== '' && !loading && (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            onClick={()=>{handleCopyToClipboard(prompt)}}
          >
            Copy
          </button>
          <button
            type="button"
            className="btn btn-outline-primary chatgpt-button"
            style={{ fontSize: '14px' }}
            onClick={() => {
              appendToBody(prompt);
            }}
          >
            Insert
          </button>
        </div>
      )}
      <br />
      <br />
    </div>
  );
};

export default ChatGpt;
