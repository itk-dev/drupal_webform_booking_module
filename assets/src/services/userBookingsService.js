import testdata from '../components/data/userBookings.json';

export function getUserBookings() {
    return new Promise((resolve) => {
        setTimeout(function() {
            let data = testdata['hydra:member'];
            resolve(data);
        }, 1000)
        // fetch("https://selvbetjening.local.itkdev.dk/da/itkdev_booking/bookings").then(response => {
        //     console.log(response);
            
        // });
    })
}