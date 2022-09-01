export function getResource(id) {
    return new Promise((resolve) => {
        fetch('https://selvbetjening.local.itkdev.dk/da/itkdev_booking/resources')
            .then((response) => response.json())
            .then((data) => {
                data['resource'] = data['hydra:member'];
                data['facilities'] = {
                    ...data['resource'][0].monitorequipment && {'Projektor / Skærm': '/assets/images/icons/Projector.svg'},
                    ...data['resource'][0].wheelchairaccessible && {'Handicapvenligt': '/assets/images/icons/Wheelchair.svg'},
                    ...data['resource'][0].videoconferenceequipment && {'videoconferenceequipment': '/assets/images/icons/Video-camera.svg'},
                    ...data['resource'][0].catering && {'catering': '/assets/images/icons/Food.svg'},
                    ...data['resource'][0].holidayOpeningHours && {'holidayOpeningHours': '/assets/images/icons/Candles.svg'},
                }
                resolve(data);
            });
    })
}