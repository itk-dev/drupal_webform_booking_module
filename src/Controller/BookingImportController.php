<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Drupal\Core\Site\Settings;

/**
 * Booking import controller.
 */
class BookingImportController extends ControllerBase {

  /**
   * Fetch bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   */
  public function getBookings(Request $request) {
    $bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint', NULL);
    if ($bookingApiEndpoint) {
      $json_data = $request->getContent();
    }
    else {
      $json_data = file_get_contents(__DIR__ . '/../../sampleData/busy-intervals.json');
    }

    $payload = json_decode($json_data, TRUE);
    if (empty($payload)) {
      throw new BadRequestHttpException('Invalid or empty payload');
    }

    return new JsonResponse($payload);
  }

}
