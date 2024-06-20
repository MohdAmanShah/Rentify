import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('Loading.');

  useEffect(() => {
    const texts = ['Loading.', 'Loading..', 'Loading...'];
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 500); // Change text every 500ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return <div>{loadingText}</div>;
};

export default Loading;