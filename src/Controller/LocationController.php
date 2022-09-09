<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Location controller.
 */
class LocationController extends ControllerBase {
  protected BookingHelper $bookingHelper;

  /**
   * LocationController constructor.
   *
   * @param BookingHelper $bookingHelper
   *   A booking helper service.
   */
  public function __construct(BookingHelper $bookingHelper) {
    $this->bookingHelper = $bookingHelper;
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
   * Fetch bookings from booking service.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getLocations(): JsonResponse {
    $response = $this->bookingHelper->getLocations();
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
