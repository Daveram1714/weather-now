import Navbar from "./components/Navbar";
import bgImg from "/bg-image.jpg";
import Home from './pages/home'

function App() {
  return (
    <>

    <div 
      className="relative bg-center bg-cover bg-no-repeat min-h-screen"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
     
      <div className="absolute inset-0 bg-black/30"></div>

         
      <div className="relative z-10 p-5 sm:mx-5 mx:0">
        {/* <Navbar /> */}
        <Home />
      </div>
    </div>
    </>
    
  );
}

export default App;
