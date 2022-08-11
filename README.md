# ITK Dev booking

Provides a webform element for creating bookings through the AAK booking service.

## Development

See assets README.md for working with assets and compilation and assets code styles.

## Setup

When used without the following settings the module will fallback to use sample data from sampleData folder.
To connect to the book_aarhus service add the following lines to your settings.local.php file.

```php
$settings['itkdev_booking_api_endpoint'] = [INSERT ENDPOINT IN QUOTES];
$settings['itkdev_booking_api_key'] = [INSERT API KEY IN QUOTES];
$settings['itkdev_booking_fullcalendar_license'] = [INSERT FULLCALENDAR LICENSE KEY IN QUOTES];
```

If you need to connect to the booking service through an insecure connection add this:
```php
$settings['itkdev_booking_api_allow_insecure_connection'] = TRUE;
```

## Setting up the booking module and the booking service

To set up the project the following steps should be followed.

### 1. Install os2forms selvbetjening.

Git clone https://github.com/itk-dev/os2forms_selvbetjening

Follow the steps in https://github.com/itk-dev/os2forms_selvbetjening/blob/develop/README.md

### 2. Git clone drupal_webform_booking_module into `web/modules/custom` and enable module.

```
git clone https://github.com/itk-dev/drupal_webform_booking_module itkdev_booking
```
```
itkdev-docker-compose drush pm:enable itkdev_booking
```

### 3. Create an 'os2forms_rest_api' api key.

https://github.com/itk-dev/os2forms_selvbetjening/blob/develop/web/modules/custom/os2forms_rest_api/README.md#authentication

### 4. Create an Affiliation in os2forms selvbetjening

```
Structure->Taxonomy->Affiliation

+ Add Term
```

The name is not important in development.

### 5. Install booking service

Git clone: https://github.com/itk-dev/book_aarhus

Follow the readme: https://github.com/itk-dev/book_aarhus/blob/develop/README.md

Create an ApiKeyUser with the following command:

```
docker compose exec phpfpm bin/console app:auth:create-apikey
```

use the api-key that was set up in step 3.

### 6. Set up settings.local.php

Set up the book_aarhus service fields.

```php
$settings['itkdev_booking_api_endpoint'] = [SERVICE_ENDPOINT];
$settings['itkdev_booking_api_key'] = [SERVICE_APIKEY];
```

SERVICE_APIKEY is the apikey created in step 5.

SERVICE_ENDPOINT is found by running:

```
docker ps
```

Find the internal name of the "bookaarhus" nginx container. Something like `bookaarhus-nginx-1` and append `.frontend`.

Eg.

```php
$settings['itkdev_booking_api_endpoint'] = 'http://bookaarhus-nginx-1.frontend/';
$settings['itkdev_booking_api_key'] = '1234567890';
```

### 7. Set up a webform

Go to `http://selvbetjening.local.itkdev.dk/da/admin/structure/webform` and "Add webform".
Select a name and the Affiliation that was set up in step 4.

In "build" press "+ Add element" and add "Booking" type.

### 8. Set up "Api request handler"

In "Settings -> Emails/Handlers" press "+ Add handler".

In "API url" set the SERVICE_ENDPOINT from step 6 with the path "v1/bookings-webform" appended.

In "API authorization header" set the text "Apikey SERVICE_APIKEY"

### 9. Creating a booking through the webform

First create data for the booking in `http://selvbetjening.local.itkdev.dk/da/webform/[WEBFORM_MACHINENAME]/test`.

After submitting the data the submission is added to the queue in os2forms.

To send the submission to book_aarhus the queue needs to run.

```
itkdev-docker-compose drush --uri=http://[SERVICE_ENDPOINT] advancedqueue:queue:process os2forms_api_request_handler -vvv
```

This will create a "WebformSubmitMessage" job in the book_aarhus service.

To create the booking in Exchange the job queue in book_aarhus needs to run.

```
itkdev-docker-compose exec phpfpm composer queues
```

This will handle the submission job. This job will retrieve the webform submission data and create a
"CreateBookingMessage" job will handle the actual submission to Exchange.
