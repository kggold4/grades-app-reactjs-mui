import * as React from 'react';
import Inset from './Inset';
import GradeList from './GradesList';
import Header from './Header';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Inset />
      <GradeList />
      <Footer />
    </div>
  );
}

export default App;