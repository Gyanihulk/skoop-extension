import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);


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
          
          {renderButtons()}
         
        </ul>
      </nav>
    );
  };

  
  export default Pagination;
  