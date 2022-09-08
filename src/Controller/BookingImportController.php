<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Booking import controller.
 */
class BookingImportController extends ControllerBase {

  /**
   * Booking helper
   *
   * @var BookingHelper
   *   A booking helper service.
   */
  protected BookingHelper $bookingHelper;

  /**
   * ResourceImportController constructor.
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
  public static function create(ContainerInterface $container): BookingImportController {
    return new static(
      $container->get('itkdev_booking.booking_helper')
    );
  }

  /**
   * Fetch bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   *
   * @throws \Exception
   */
  public function getBusyIntervals(Request $request): JsonResponse {
    $payload = $this->bookingHelper->getResult('v1/busy-intervals', $request);
    return new JsonResponse($payload);
  }

}
