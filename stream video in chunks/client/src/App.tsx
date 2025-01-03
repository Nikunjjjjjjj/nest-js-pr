// //import React from "react";
// const App=()=> {
  

//   return (
//     <>
//       <video controls src="http://localhost:3000/file"></video>
      
//     </>
//   )
// }

// export default App



import React from "react";

const App = () => {
  const handleContextMenu = (e:any) => {
    // Prevent the context menu (right-click menu)
    e.preventDefault();
  };

  return (
    <>
      <video
        controls
        src="http://localhost:3000/file"
        onContextMenu={handleContextMenu} // Disable right-click menu
        preload="auto" // Helps load the video ahead of time for smooth streaming
        style={{ width: "100%" }} // Ensure video fits the container
      >
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default App;
