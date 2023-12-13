import React from 'react';
//import MyComponent from './MyComponent'; // Import MyComponent
import UIComponent from './UIComponent'; // Import MyComponent

function App() {
  return (
    <div className="App">
    <header className="App-header">
      <UIComponent /> {/* Use MyComponent */}
    </header>
  </div>
  );
}

export default App;
