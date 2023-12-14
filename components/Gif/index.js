import React, { useState } from 'react';
import { GrSearchAdvanced } from "react-icons/gr";
import { Container, InputGroup, FormControl, Button, Row, Col, Form } from 'react-bootstrap';
import API_ENDPOINTS from '../apiConfig';

function GiphyWindow(props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      console.log("The access token is this one", localStorage.getItem('accessToken'))
      const response = await fetch(API_ENDPOINTS.gifs + new URLSearchParams({
        search: search
      }), {
        method: "GET",
        headers: {
          "authorization": `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const handleInsertion = (url) => {
    if (props.appendToBody) {
      props.appendToBody(`<img src=${url} />`);
    } else {
      props.appendToLinkedIn(url);
    }
  }

  return (
    <Container style={{ width: '92%', padding: '10px', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto' }}>
      <div style={{ borderRadius: '5px' }}>
        <Form.Group as={Row} className="align-items-center mb-3">
          <Col sm={11}>
            <FormControl
              type="text"
              placeholder="Search GIFs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col sm={1}>
            <button onClick={handleSearch} style={{ fontSize: '20px', color: '#0d6efd', border:'none', background:'none' }}>
            <GrSearchAdvanced/>
            </button>
          </Col>
        </Form.Group>
        <Row style={{ whiteSpace: 'nowrap' }}>
          {results.map((result) => (
            <Col key={result.id} xs={12} sm={6} md={4} lg={4} style={{ cursor: 'pointer', display: 'inline-block', margin: '0', width: '25%' }}>
              <img
                src={result.images.downsized.url}
                alt={result.title}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                onClick={() => handleInsertion(result.images.downsized.url)}
                loading="lazy"
              />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default GiphyWindow;
