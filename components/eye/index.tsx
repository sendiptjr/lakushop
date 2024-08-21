// components/EyeIcon.js
import React from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const EyeIcon = ({ isVisible, toggleVisibility }: any) => {
  return (
    <div onClick={toggleVisibility} style={{ cursor: 'pointer' }}>
      {isVisible ? <RiEyeLine color='grey' size={20} /> : <RiEyeOffLine color='grey'  size={20} />}
    </div>
  );
};

export default EyeIcon;
