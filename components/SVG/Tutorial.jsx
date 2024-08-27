import React from 'react'
const Tutorial = ({ children }) => {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_3_1847)">
        <rect width="64" height="48" rx="6" fill="#2D68C4" fill-opacity="0.8" />
        <rect width="64" height="12" fill="#2D6891" />
      </g>
      <foreignObject x="10" y="15" width="65%" height="55%">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{children}</div>
      </foreignObject>
      <defs>
        <clipPath id="clip0_3_1859">
          <rect width="5.18919" height="5.18919" fill="white" transform="translate(27.1351 25.0811)" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Tutorial
