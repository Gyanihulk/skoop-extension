import React from 'react'

const PasswordTooltip = () => {
  return (
    <div id="password-tooltip">
      <h5>Password Instructions</h5>
      <ul>
        <li>At least 1 uppercase character (A-Z)</li>
        <li>At least 1 lowercase character (a-z)</li>
        <li>At least 1 special character (e.g., @#$%!^&*)</li>
        <li>At least 1 numeric character (i.e., 0-9)</li>
        <li>Password length must be 8-16 characters long</li>
      </ul>
    </div>
  )
}

export default PasswordTooltip
