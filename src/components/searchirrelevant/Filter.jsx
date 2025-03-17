import React from 'react';
import './filter.css';

const Filter = () => {
  return (
    <div className="filter-container">
      {/* Dropdown Filters */}
      <div className="filter-group">
        <select className="filter-select">
          <option value="">Make/Brand</option>
          <option value="toyota">Toyota</option>
          <option value="honda">Honda</option>
          <option value="ford">Ford</option>
          {/* Add more brands */}
        </select>

        <select className="filter-select">
          <option value="">Transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
          <option value="cvt">CVT</option>
        </select>

        <select className="filter-select">
          <option value="">Drive Type</option>
          <option value="fwd">FWD</option>
          <option value="rwd">RWD</option>
          <option value="awd">AWD</option>
          <option value="4wd">4WD</option>
        </select>

        <select className="filter-select">
          <option value="">Start Code</option>
          <option value="run_drive">Run and Drive</option>
          <option value="starts">Starts</option>
          <option value="stationary">Stationary</option>
        </select>

        <select className="filter-select">
          <option value="">Auction Type</option>
          <option value="live">Live</option>
          <option value="online">Online</option>
        </select>

        <select className="filter-select">
          <option value="">Archived</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Checkmark Filters */}
      <div className="filter-group checkmarks">
        <div className="filter-section">
          <h4>Loss Type</h4>
          <label><input type="checkbox" value="collision" /> Collision</label>
          <label><input type="checkbox" value="theft" /> Theft</label>
          <label><input type="checkbox" value="water" /> Water</label>
        </div>

        <div className="filter-section">
          <h4>Exterior Color</h4>
          <label><input type="checkbox" value="black" /> Black</label>
          <label><input type="checkbox" value="white" /> White</label>
          <label><input type="checkbox" value="silver" /> Silver</label>
          {/* Add more colors */}
        </div>

        <div className="filter-section">
          <h4>Body Style</h4>
          <label><input type="checkbox" value="sedan" /> Sedan</label>
          <label><input type="checkbox" value="suv" /> SUV</label>
          <label><input type="checkbox" value="coupe" /> Coupe</label>
          {/* Add more styles */}
        </div>

        <div className="filter-section">
          <h4>Fuel Type</h4>
          <label><input type="checkbox" value="gasoline" /> Gasoline</label>
          <label><input type="checkbox" value="diesel" /> Diesel</label>
          <label><input type="checkbox" value="electric" /> Electric</label>
          <label><input type="checkbox" value="hybrid" /> Hybrid</label>
        </div>
      </div>
    </div>
  );
};

export default Filter;
