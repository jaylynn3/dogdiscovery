import { useState } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dog, setDog] = useState(null);

  const fetchDog = async () => {
    try {
      const response = await fetch(
        "https://api.thedogapi.com/v1/images/search",
        {
          headers: {
            "x-api-key": ACCESS_KEY,
          },
        }
      );

      const data = await response.json();
      setDog(data[0]); // show the first dog from the API
    } catch (error) {
      console.error("Error fetching dog:", error);
      alert("Failed to fetch dog. Try again.");
    }
  };

  return (
    <div>
      <h1>Dog Discovery Machine</h1>
      <button onClick={fetchDog}>Discover</button>

      {dog && (
        <div style={{ marginTop: "20px" }}>
          <img src={dog.url} width="300" alt="Random Dog" />

          {dog.breeds && dog.breeds.length > 0 && (
            <div>
              <p><strong>Breed:</strong> {dog.breeds[0].name}</p>
              {dog.breeds[0].origin && <p><strong>Origin:</strong> {dog.breeds[0].origin}</p>}
              {dog.breeds[0].temperament && <p><strong>Temperament:</strong> {dog.breeds[0].temperament}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;