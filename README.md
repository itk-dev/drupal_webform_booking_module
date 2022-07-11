# ITK Dev booking
Provides a webform element for creating bookings through the AAK booking service.

## Development
See assets README.md for working with assets and compilation and assets code styles.

## Setup
When used without setup the module will fallback to use sample data from sampleData folder.
To connect to the AAK booking service add the following lines to your settings.local.php file.
```php
$settings['itkdev_booking_api_endpoint'] = [INSERT ENDPOINT IN QUOTES];
$settings['itkdev_booking_api_key'] = [INSERT API KEY IN QUOTES];
$settings['itkdev_booking_fullcalendar_license'] = [INSERT FULLCALENDAR LICENSE KEY IN QUOTES];
```

If you need to connect to the booking service through an insecure connection add this:
```php
$settings['itkdev_booking_api_allow_insecure_connection'] = TRUE;
```
