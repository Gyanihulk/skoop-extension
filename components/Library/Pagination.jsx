import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => onPageChange(currentPage - 1)}
            tabIndex="-1"
            aria-disabled="true"
          >
            Previous
          </a>
        </li>

        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <a className="page-link" href="#" onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </a>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a className="page-link" href="#" onClick={() => onPageChange(currentPage + 1)}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
