import { useState } from 'react';
import { useEffect } from "react";
import { getResource } from "../../services/resourceService";
import Loadingspinner from '../loadingSpinner/loadingSpinner';
import "./resourceView.css";

function Resourceview({ location, id }) {
    const [resource, setResource] = useState();
    const [facilities, setFacilities] = useState();

    useEffect(() => {
        getResource(id)
            .then(d => {
                console.log(d);
                setResource(d['resource'][0])
                setFacilities(d['facilities'])
            })
    }, [location]);

    const facilitiesList = resource && facilities && (
        <div>
            <div><div><img src={'/assets/images/icons/Chair.svg'} /></div><span>{resource.capacity} siddepladser</span></div>
            {
                Object.entries(facilities).map((value) => {
                    return (
                        <div><div><img src={value[1]} /></div><span>{value[0]}</span></div>
                    )
                })
            }
        </div>
    )
    const resourceDetails = resource && (
        <div className="resource-container">
            <div className="resource-headline">
                <span>Ressource information</span>
                <button>Tilbage til listen</button>
            </div>
            <div className="resource-title">
                <h2>
                    {resource.resourcemail}
                </h2>
            </div>
            <div className="resource-details">
                <div className="image"><img src="https://via.placeholder.com/500x300" /></div>
                <div className="facilities">
                    <span>Faciliteter</span>
                    {facilitiesList}
                </div>
                <div className="location">
                    <span>Lokation</span>
                    <div>
                        <span>{resource.location}</span>
                    </div>
                    <div>
                        <span>Adresse...</span>
                    </div>
                </div>
            </div>
            <div className="resource-description">
                <span>Beskrivelse</span>
                <div>
                    <span>{resource.resourcedescription}</span>
                </div>
            </div>
            <div className="resource-guidelines">
                <span>Priser og vilkår</span>
                <div>
                    <span>Priser og vilkår...</span>
                </div>
            </div>
        </div>
    )


    return (
        <div className="Resourceview">
            Selected location: {location}
            {resourceDetails ? resourceDetails : <Loadingspinner />}
        </div>
    );
}

export default Resourceview;
