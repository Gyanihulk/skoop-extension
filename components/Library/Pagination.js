import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderButtons = () => {
    const buttons = [];
  
    // Render the first page button if not on the first page
    if (currentPage > 1) {
      buttons.push(
        <li key={1} className="page-item">
          <button className='pagination-button' onClick={() => onPageChange(1)}>1</button>
        </li>
      );
    }
  
    // Render the previous two pages if available
    let startPage = Math.max(2, currentPage - 2);
    if (startPage > 2) {
      buttons.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span>...</span>
        </li>
      );
    }
    for (let i = startPage; i < currentPage; i++) {
      buttons.push(
        <li key={i} className="page-item">
          <button className='pagination-button' onClick={() => onPageChange(i)}>{i}</button>
        </li>
      );
    }
  
    // Render the current page button
    buttons.push(
      <li key={currentPage} className="page-item active">
        <button className='pagination-button active' disabled>{currentPage}</button>
      </li>
    );
  
    // Render the next two pages if available
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    for (let i = currentPage + 1; i <= endPage; i++) {
      buttons.push(
        <li key={i} className="page-item">
          <button className='pagination-button' onClick={() => onPageChange(i)}>{i}</button>
        </li>
      );
    }
    if (endPage < totalPages - 1) {
      buttons.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span>...</span>
        </li>
      );
    }
  
    // Render the last page button if not on the last page
    if (currentPage < totalPages) {
      buttons.push(
        <li key={totalPages} className="page-item">
          <button className='pagination-button' onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </li>
      );
    }
  
    return buttons;
  };
    return (
        <nav className='pagination-nav'>
            <ul className="pagination">{renderButtons()}</ul>
        </nav>
    );
};

export default Pagination;
