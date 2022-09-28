import React, { useEffect } from 'react';
import Api from "../util/api";
import "./list.scss";
function List({ 
    resources,
    setShowResourceViewId,

 }) {
  // useEffect(() => {
  //   if (config && showResourceViewId !== null) {
  //     // Api.fetchResourceFacilities(config.api_endpoint, showResourceViewId).then((resourceData) => {
  //     //   console.log(resourceData);
  //     //   setResource(resourceData);
  //     //   setFacilities(resourceData.facilities);
  //     // });
  //   }
  // }, [config]);
  useEffect(() => {
    console.log(resources);
  }, [resources])
    useEffect(() => {
    }, []);
    const showResourceView = (event) => {
        let resourceId = event.target.getAttribute('data-id');
        if (resourceId) {
            setShowResourceViewId(resourceId);
        }
    }
      /**
   * Get facilities list.
   *
   * @returns {string} Facilities list.
   */
  // const getFacilitiesList = () => {
    // return (
    //   <div className="facility-container">
    //     <div className="facility-item">
    //       <div className="facility-icon">
    //         <IconChair />
    //       </div>
    //       <span>{resource.capacity} siddepladser</span>
    //     </div>
    //     {Object.keys(facilities).map((key) => {
    //       return (
    //         <div className="facility-item" key={key}>
    //           <div className="facility-icon">{facilities[key].icon}</div>
    //           <span>{facilities[key].title}</span>
    //         </div>
    //       );
    //     })}
    //   </div>
    // );
  // }
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
                                </div>
                            </div>
                            <span>{resources[key].resourceDescription}</span>
                        </div>
                        <div className="list-resource-actions col-md-2">
                            <button className="booking-btn" data-id={resources[key].id} onClick={showResourceView}>Vis resource</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default List;