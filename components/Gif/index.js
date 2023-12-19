import React, { useState, useEffect } from 'react';
import { GrSearchAdvanced } from 'react-icons/gr';
import { Container, InputGroup, FormControl, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import API_ENDPOINTS from '../apiConfig';

function GiphyWindow(props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.gifs + new URLSearchParams({ search }), {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertion = (url) => {
    if (props.appendToBody) {
      props.appendToBody(`<img src=${url} />`);
    } else {
      props.appendToLinkedIn(url);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSearch();
    }
  };

  useEffect(() => {
    setResults([]); 
  }, [search]);

  return (
    <Container style={{ width: '92%', padding: '10px', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto' }}>
      <div style={{ borderRadius: '5px' }}>
        <Form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search GIFs"
              aria-label="Search GIFs"
              aria-describedby="basic-addon2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleSearch}
                //style={{ fontSize: '20px', color: '#0d6efd' }}
              >
                <GrSearchAdvanced />
              </button>
            </div>
          </div>
        </Form>
      {loading && <>
        <div className="sbl-circ-ripple"></div>
      </>
      }
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
