import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [breeds, setBreeds] = useState([]);
  const [images, setImages] = useState({});
  const [selectedBreed, setSelectedBreed] = useState('');
  const [breedInfo, setBreedInfo] = useState('');

  // Fetch dog breeds and images on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await axios.get('https://dog.ceo/api/breeds/list/all');
        setBreeds(Object.keys(res.data.message));
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  // Fetch breed details (Wikipedia URL) when a breed is selected
  const fetchBreedInfo = async (breed) => {
    try {
      const res = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          exintro: true,
          titles: breed,
        },
      });
      const page = res.data.query.pages;
      const info = page[Object.keys(page)[0]].extract;
      setBreedInfo(info);
    } catch (error) {
      console.error('Error fetching breed info:', error);
    }
  };

  // Fetch breed images when a breed is selected
  const fetchBreedImages = async (breed) => {
    try {
      const res = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random/5`);
      setImages(res.data.message);
      setSelectedBreed(breed);
      fetchBreedInfo(breed);
    } catch (error) {
      console.error('Error fetching breed images:', error);
    }
  };

  return (
    <div className="App">
      <h1>Dog Breeds</h1>
      <div className="breed-selector">
        <h3>Select a breed:</h3>
        <select onChange={(e) => fetchBreedImages(e.target.value)} value={selectedBreed}>
          <option value="">-- Select a breed --</option>
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div className="dog-details">
        {selectedBreed && (
          <div>
            <h2>{selectedBreed.charAt(0).toUpperCase() + selectedBreed.slice(1)} Breed</h2>
            <div className="dog-images">
              {images.map((image, index) => (
                <img key={index} src={image} alt={selectedBreed} />
              ))}
            </div>
            <div className="breed-info" dangerouslySetInnerHTML={{ __html: breedInfo }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
