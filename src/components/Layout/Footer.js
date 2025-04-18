import React from 'react';
import '../../assets/css/App.css'; 

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Tekmonk Courses. For educational purposes only.</p>
      {}
    </footer>
  );
};

export default Footer;