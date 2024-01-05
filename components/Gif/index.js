import React, { useState, useEffect } from 'react';
import { GrSearchAdvanced } from 'react-icons/gr';
import API_ENDPOINTS from '../apiConfig';

function GiphyWindow(props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizeOfGif,setSizeOfGif] = useState(20);
  
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
      props.appendToBody(`<img src=${url} style="width: ${sizeOfGif}%; height: auto;" >`);
    } else {
      props.appendToLinkedIn(url);
    }
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setSizeOfGif(newSize);
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
    <div className="container gif-container">
        <form onSubmit={(e) => e.preventDefault()}>
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
              >
                <GrSearchAdvanced />
              </button>
            </div>
          </div>
        </form>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="sbl-circ-ripple"></div>
          </div>
        )}

        {results.length>0 && 
          <div>
            <label>
              <input
                type="radio"
                name="gifSize"
                value="20"
                checked={sizeOfGif === 20}
                onChange={handleSizeChange}
              />
              Small
            </label>
            <label>
              <input
                type="radio"
                name="gifSize"
                value="50"
                checked={sizeOfGif === 50}
                onChange={handleSizeChange}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                name="gifSize"
                value="100"
                checked={sizeOfGif === 100}
                onChange={handleSizeChange}
              />
              Large
            </label>
          </div>
        }
        <div className="row no-wrap">
          {results.map((result) => (
            <div key={result.id} className="col-4 col-md-4 col-lg-4 gif-result">
              <img
                src={result.images.downsized.url}
                alt={result.title}
                className="gif-img"
                onClick={() => handleInsertion(result.images.downsized.url)}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
 );
}
export default GiphyWindow;
