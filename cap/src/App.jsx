import { useState } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    let valid = false;
    let data;
    let attempts = 0;

    while (!valid && attempts < 10) {
      attempts++;

      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search?has_breeds=1",
        {
          headers: {
            "x-api-key": ACCESS_KEY,
          },
        }
      );

      data = await response.json();

      if (!data[0].breeds || data[0].breeds.length === 0) {
        continue;
      }

      const breed = data[0].breeds[0].name;
      const origin = data[0].breeds[0].origin;
      const traits = data[0].breeds[0].temperament
        ? data[0].breeds[0].temperament.split(", ")
        : [];

      const hasBanned =
        banList.includes(breed) ||
        banList.includes(origin) ||
        traits.some((t) => banList.includes(t));

      if (hasBanned) {
        continue;
      }

      valid = true;
    }

    if (!valid) {
      alert("Valid cat not found");
      return;
    }

    setCat(data[0]);
  };

  const addBan = (item) => {
    if (!banList.includes(item)) {
      setBanList([...banList, item]);
    }
  };

  const removeBan = (item) => {
    setBanList(banList.filter((b) => b !== item));
  };

  return (
    <div>
      <h1>Cat Contrivance Component ≽^•⩊•^≼</h1>

      <button className="button" onClick={fetchCat}>Discover ฅ ฅ</button>

      {cat && (
        <div>
          <img src={cat.url} width="300" alt="Cat" />

          {cat.breeds && cat.breeds.length > 0 && (
            <div>
  <p>
    Breed:
    <button onClick={() => addBan(cat.breeds[0].name)}>
      {cat.breeds[0].name}
    </button>
  </p>

  <p>
    Origin:
    <button onClick={() => addBan(cat.breeds[0].origin)}>
      {cat.breeds[0].origin}
    </button>
  </p>

  <p>
    Temperament:
    {cat.breeds[0].temperament
      ? cat.breeds[0].temperament.split(", ").map((trait) => (
          <button
            key={trait}
            onClick={() => addBan(trait)}
          >
            {trait}
          </button>
        ))
      : " No data"}
  </p>
</div>
          )}
        </div>
      )}

      <div className="banlist">
  <h2>Ban List</h2>

  {banList.length === 0 && <p>No bans yet</p>}

  {banList.map((item, index) => (
    <button key={index} onClick={() => removeBan(item)}>
      {item}
    </button>
  ))}
</div>
    </div>
  );
}

export default App;