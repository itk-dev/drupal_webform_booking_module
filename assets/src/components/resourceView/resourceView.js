import { useState } from 'react';
import { useEffect } from "react";
import ResourceDetails from '../resourceDetails/resourceDetails';
import Loadingspinner from '../loadingSpinner/loadingSpinner';
import "./resourceView.scss";

function Resourceview({ id, config }) {

    useEffect(() => {

    }, []);

    return (
        <div className="Resourceview">
            <br></br>
            <hr></hr>
            <br></br>
            <h1>Ressource Information:</h1>
            {<ResourceDetails config={config}/>}
        </div>
    );
}

export default Resourceview;
