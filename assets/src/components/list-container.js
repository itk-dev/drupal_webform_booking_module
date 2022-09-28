import React, { useEffect } from 'react';
import List from "./list";
import "./list-container.scss";

function ListContainer({ 
    resources,
    setShowResourceViewId
 }) {

    useEffect(() => {

    }, []);
    return (
        <div className="List no-gutter col-md-12">
            <div className="row">
                <div className="col-md-12">
                    {!resources && <span>Vælg filtre for at vise liste over resourcer..</span>}
                    {resources && <List resources={resources} setShowResourceViewId={setShowResourceViewId}/>}
                </div>
            </div>    
        </div>
    );
}
export default ListContainer;