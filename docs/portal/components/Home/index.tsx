import React from 'react';

const Home = () => {
  return (
    <div
      style={{
        height: '100vh',
        padding: '200px',
        background: 'grey',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <h1 style={{ fontSize: '60px', marginBottom: '12px' }}> GraphScope Portal</h1>
      <h2 style={{ fontSize: '40px', marginBottom: '12px' }}>A user-friendly web interface</h2>
      <h5 style={{ fontSize: '20px' }}>
        Offers one-stop access to data modeling, importing, querying, and monitoring, catering to both Interactive and
        Insight engines within the GraphScope Flex architecture.
      </h5>
    </div>
  );
};

export default Home;
