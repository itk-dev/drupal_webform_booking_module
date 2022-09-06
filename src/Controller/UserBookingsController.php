<?php

namespace Drupal\itkdev_booking\Controller;

// use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\UserBookingsHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Booking import controller.
 */
class UserBookingsController extends ControllerBase {

  /**
   * Booking helper
   *
   * @var UserBookingsHelper
   *   A booking helper service.
   */
  protected UserBookingsHelper $UserBookingsHelper;

  /**
   * UserBookingsController constructor.
   *
   * @param UserBookingsHelper $bookingHelper
   *   A booking helper service.
   */
  public function __construct(UserBookingsHelper $UserBookingsHelper) {
    $this->bookingHelper = $UserBookingsHelper;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('itkdev_booking.user_bookings_helper')
    );
  }

  /**
   * Fetch  bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   */
  public function getUserBookings(Request $request) {
    $payload = $this->bookingHelper->getResult('v1/user-bookings', $request);
    return new JsonResponse($payload);
  }

   /**
   * delete bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   */
  public function DeleteUserBooking(Request $request, $bookingId) {
    $request->attributes->set('bookingId', $bookingId);
    $payload = $this->bookingHelper->getResult('v1/user-bookings', $request);
    return new JsonResponse($payload);
  }

    /**
   * Fetch bookings from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The payload.
   */
  public function getBookingDetails(Request $request) {
    $payload = $this->bookingHelper->getResult('v1/booking-details', $request);
    return new JsonResponse($payload);
  }

}
