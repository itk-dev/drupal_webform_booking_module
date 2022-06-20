<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Resource import controller.
 */
class ResourceImportController extends ControllerBase {

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
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('itkdev_booking.booking_helper')
    );
  }

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
    $payload = $this->bookingHelper->getResult('v1/resources', $request);
    return new JsonResponse($payload);
  }
}
