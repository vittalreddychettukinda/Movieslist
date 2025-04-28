import React from 'react';
import { Box, Typography } from '@mui/material';

const Scrolling = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Scrolling Disclaimer Box */}
      <Box 
        sx={{
          position: 'fixed', 
          top: '60px', // Adjust top to create margin between the navbar and disclaimer
          left: 0, 
          width: '100%', 
          backgroundColor: '#039dfc', 
          color: 'white', // Change to white to improve contrast
          padding: '10px', 
          zIndex: 1000,
          animation: 'scrolling 30s linear infinite', // Slow down the scroll animation (increase duration)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden', // Prevents overflow
        }}
      >
        <Typography 
          variant="body1" 
          sx={{
            fontFamily: 'Arial, sans-serif', // Ensure a clear, standard font
            fontWeight: 'bold', // Make text bold for better visibility
            fontSize: { xs: '12px', sm: '14px', md: '16px' },  // Adjust font size responsively
            textRendering: 'optimizeLegibility', // Ensure better font rendering
            WebkitFontSmoothing: 'antialiased', // Make text smoother
            MozOsxFontSmoothing: 'grayscale', // Make text smoother on macOS
          }}
        >
          Disclaimer: Please use the Pinterest site for the image URL.
        </Typography>
        <Box
          sx={{
            marginLeft: '20px',
            display: 'inline-block',
            height: { xs: '20px', sm: '25px', md: '30px' },  // Image size scales based on screen width
            width: { xs: '20px', sm: '25px', md: '30px' },
            backgroundImage: 'url(https://www.pinterest.com/pin/123456789012345678/)', // Example image URL
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '5px',
          }}
        />
      </Box>

      {/* Inline Style for Keyframes Animation */}
      <style>
        {`
          @keyframes scrolling {
            0% {
              transform: translateX(-100%);  /* Start from right (inside the screen) */
            }
            100% {
              transform: translateX(100%); /* End at left (completely off screen) */
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Scrolling;
