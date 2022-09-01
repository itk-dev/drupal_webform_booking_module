export function getUserBookings() {
    return new Promise((resolve) => {
        fetch('https://selvbetjening.local.itkdev.dk/da/itkdev_booking/user-bookings')
            .then((response) => response.json())
            .then((data) => {
                data = data['hydra:member'];
                resolve(data);
            });
    })
}