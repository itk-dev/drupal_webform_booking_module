<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Booking controller.
 */
class BookingController extends ControllerBase {
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
  public static function create(ContainerInterface $container): BookingController {
    return new static(
      $container->get('itkdev_booking.booking_helper')
    );
  }

  /**
   * Fetch bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *
   * @throws \Exception
   */
  public function getBusyIntervals(Request $request): JsonResponse {
    $query = $request->query;
    $resourceEmails = $query->get('resources');
    $dateStart = $query->get('dateStart');
    $dateEnd = $query->get('dateEnd');

    $response = $this->bookingHelper->getBusyIntervals($resourceEmails, $dateStart, $dateEnd);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
