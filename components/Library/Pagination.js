import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
   console.log("pageno:",pageNumbers)

   const renderButtons = () => {
    return Array.from({ length: totalPages+1 }, (_, index) => (

        <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
        <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            disabled={currentPage === index + 1}
        >
            {index + 1}
        </button>
      </li>
    ));
};

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {/* <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li> */}
          {renderButtons()}
          {/* <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li> */}
        </ul>
      </nav>
    );
  };

  
  export default Pagination;
  