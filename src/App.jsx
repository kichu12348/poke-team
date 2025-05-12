import Navbar from "./components/nav";
import Search from "./components/searchBar";
import TeamDisplay from "./components/TeamDisplay";
import TeamProvider from "./context/team";
import { FaHeart } from "react-icons/fa";

function App() {
  return (
    <TeamProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <h1 className="title">Pokémon Team Builder</h1>
          <Search />
          <TeamDisplay />
        </div>
        <footer
          className="footer"
          onClick={() => {
            window.open("https://github.com/kichu12348/poke-team", "_blank");
          }}
        >
          <p>
            Made with <FaHeart color="#ff0000" size={16} /> by kichu
          </p>
        </footer>
      </div>
    </TeamProvider>
  );
}

export default App;
