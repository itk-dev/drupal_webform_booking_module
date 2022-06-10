<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Drupal\Core\Site\Settings;

/**
 * Resource import controller.
 */
class ResourceImportController extends ControllerBase {

  /**
   * Fetch resources from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   */
  public function getResources(Request $request) {
    $bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint', NULL);
    if ($bookingApiEndpoint) {
      $json_data = $request->getContent();
    }
    else {
      $json_data = file_get_contents(__DIR__ . '/../../sampleData/resources.json');
    }
    $payload = json_decode($json_data, TRUE);
    if (empty($payload)) {
      throw new BadRequestHttpException('Invalid or empty payload');
    }

    return new JsonResponse($payload);
  }

}
