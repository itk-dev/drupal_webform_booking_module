import React, { useEffect } from 'react';
import Api from "../util/api";
import "./list.scss";
import { ReactComponent as IconChair } from "../assets/chair.svg";
function List({ 
    resources,
    setShowResourceDetails
 }) {

  useEffect(() => {
    
  }, [resources])
    useEffect(() => {
    }, []);
    const showResourceView = (event) => {
      let key = event.target.getAttribute('data-key');
        if (resources[key]) {
          setShowResourceDetails(resources[key]);
        }
    }
      /**
   * Get facilities list.
   *
   * @returns {string} Facilities list.
   */
  const getFacilitiesList = (resource) => {
    return (
      <div className="facility-container">
        <div className="facility-item">
          <div className="facility-icon">
            <IconChair /> {resource.capacity}
          </div>
        </div>
        {Object.keys(resource.facilities).map((key) => {
          return (
            <div className="facility-item" key={key}>
              <div className="facility-icon">{resource.facilities[key].icon}</div>
            </div>
          );
        })}
      </div>
    );
  }
    return (
        <div>
            {Object.keys(resources).map((key) => {
                return (
                    <div className="list-resource">
                        <div className="list-resource-image">
                        <img src="https://placekitten.com/150/150" />
                        </div>
                        <div className="list-resource-details col-md-10">
                            <span><b>{resources[key].resourceName}</b></span>
                            <div>
                                <span className="">{resources[key].location}</span>
                                <div>
                                  {getFacilitiesList(resources[key])}
                                </div>
                            </div>
                            <span>{resources[key].resourceDescription}</span>
                        </div>
                        <div className="list-resource-actions col-md-2">
                            <button className="booking-btn" data-key={key} onClick={showResourceView}>Vis resource</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default List;