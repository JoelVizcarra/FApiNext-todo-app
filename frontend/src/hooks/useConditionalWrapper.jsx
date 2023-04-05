import React from 'react';

const useConditionalWrapper = () => {
  return (condition, wrapper, children) =>
    condition ? React.cloneElement(wrapper, { children }) : children;
};

export default useConditionalWrapper;
