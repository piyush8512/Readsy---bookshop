// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Routes, Route, Navigate } from 'react-router-dom';
// import HomePage from './Page/HomePage';
// import Layout from './layout/layout';

// function App() {


//   return (
//     <div className='flex flex-col items-center justify-start'>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<HomePage />} />
//         </Route>

//       </Routes>

//     </div>
//   )
// }

// export default App

// App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './Page/HomePage';
import Layout from './layout/layout';

function App() {
  return (
    <div className="flex flex-col items-center justify-start">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
