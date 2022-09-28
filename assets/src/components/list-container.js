import React, { useEffect } from 'react';
import List from "./list";
import "./list-container.scss";

function ListContainer({ 
    resources,
    setShowResourceDetails,
    facilities
 }) {

    useEffect(() => {

    }, []);
    return (
        <div className="List no-gutter col-md-12">
            <div className="row">
                <div className="col-md-12">
                    {!resources && <span>Vælg filtre for at vise liste over resourcer..</span>}
                    {resources && <List resources={resources} setShowResourceDetails={setShowResourceDetails} facilities={facilities}/>}
                </div>
            </div>    
        </div>
    );
}
export default ListContainer;