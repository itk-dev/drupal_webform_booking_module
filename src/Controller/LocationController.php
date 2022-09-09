<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Site\Settings;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Location controller.
 */
class LocationController extends ControllerBase {
  protected BookingHelper $bookingHelper;
  protected bool $bookingApiSampleData;

  /**
   * @param BookingHelper $bookingHelper
   *   A booking helper service.
   */
  public function __construct(BookingHelper $bookingHelper) {
    $this->bookingHelper = $bookingHelper;
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): LocationController {
    return new static(
      $container->get('itkdev_booking.booking_helper')
    );
  }

  /**
   * Get locations.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getLocations(): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = \SampleDataHelper::getSampleData("locations");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getLocations();
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
