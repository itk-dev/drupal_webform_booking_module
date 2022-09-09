<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Site\Settings;
use Drupal\itkdev_booking\Helper\SampleDataHelper;
use Drupal\itkdev_booking\Helper\UserBookingsHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * UserBooking controller.
 */
class UserBookingsController extends ControllerBase {
  protected UserBookingsHelper $bookingHelper;
  protected bool $bookingApiSampleData;

  /**
   * UserBookingsController constructor.
   *
   * @param UserBookingsHelper $userBookingsHelper
   */
  public function __construct(UserBookingsHelper $userBookingsHelper) {
    $this->bookingHelper = $userBookingsHelper;
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): UserBookingsController {
    return new static(
      $container->get('itkdev_booking.user_bookings_helper')
    );
  }

  /**
   * Get logged in user's booking.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getUserBookings(): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("user-bookings");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getUserBookings();
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Delete booking with given bookingId.
   *
   * @param string $bookingId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function deleteUserBooking(string $bookingId): JsonResponse {
    if ($this->bookingApiSampleData) {
      return new JsonResponse([], 201);
    }

    $response = $this->bookingHelper->deleteUserBooking($bookingId);

    return new JsonResponse(null, $response->getStatusCode());
  }

  /**
   * Get booking details for a given hitId.
   *
   * @param string $hitId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getBookingDetails(string $hitId): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("booking-details");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getBookingDetails($hitId);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
