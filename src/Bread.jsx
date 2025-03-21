import React from "react";
import BreadData from "./BreadData"; 

const Bread = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {BreadData.map((card) => (
            <div className="col" key={card.id}>
              <div className="card">
                <img src={card.image_url} className="card-img-top" alt={card.name} />
                <div className="card-body">
                  <h5>{card.name}</h5>
                  <p>Rs: {card.price}</p>
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bread;
