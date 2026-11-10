import React from 'react';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>কুশাখালী আওয়ামী প্রবাসী ফাউন্ডেশন</h1>
        <p>মানবতার সেবায় আমরা একসাথে</p>
      </header>

      <main className="dashboard">
        <h2>প্রশাসনিক ড্যাশবোর্ড</h2>

        <div className="cards">
          <div className="card">
            <h3>মোট আয়</h3>
            <p>৳ ০</p>
          </div>
          <div className="card">
            <h3>মোট ব্যয়</h3>
            <p>৳ ০</p>
          </div>
          <div className="card">
            <h3>বর্তমান ক্যাশ</h3>
            <p>৳ ০</p>
          </div>
          <div className="card">
            <h3>মোট সদস্য</h3>
            <p>০</p>
          </div>
        </div>
      </main>
    </div>
  );
}
