<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Site\Settings;
use Drupal\itkdev_booking\Helper\SampleDataHelper;
use Drupal\itkdev_booking\Helper\UserBookingsHelper;
use Drupal\itkdev_booking\Helper\UserHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * UserBooking controller.
 */
class UserBookingsController extends ControllerBase {
  protected UserBookingsHelper $bookingHelper;
  protected bool $bookingApiSampleData;
  protected UserHelper $userHelper;

  /**
   * UserBookingsController constructor.
   *
   * @param UserBookingsHelper $userBookingsHelper
   */
  public function __construct(UserBookingsHelper $userBookingsHelper) {
    $this->bookingHelper = $userBookingsHelper;
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
    $this->userHelper = new UserHelper();
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
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getUserBookings(Request $request): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("user-bookings");
      return new JsonResponse($data, 200);
    }

    $userArray = $this->userHelper->getUserValues($request);

    $response = $this->bookingHelper->getUserBookings($userArray['userId']);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Delete booking with given bookingId.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $bookingId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  public function deleteUserBooking(Request $request, string $bookingId): JsonResponse {
    if ($this->bookingApiSampleData) {
      return new JsonResponse([], 201);
    }

    $userArray = $this->userHelper->getUserValues($request);

    $response = $this->bookingHelper->deleteUserBooking($userArray['userId'], $bookingId);

    return new JsonResponse(null, $response->getStatusCode());
  }

  /**
   * Get booking details for a given hitId.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $hitId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getBookingDetails(Request $request, string $hitId): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("booking-details");
      return new JsonResponse($data, 200);
    }

    $userArray = $this->userHelper->getUserValues($request);

    $response = $this->bookingHelper->getBookingDetails($userArray['userId'], $hitId);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Get user information.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getUserInformationAction(Request $request): JsonResponse {
    if ($this->bookingApiSampleData) {
      $userArray = SampleDataHelper::getSampleData("user");
    } else {
      $userArray = $this->userHelper->getUserValues($request);
    }

    return new JsonResponse([
      'userType' => $userArray['userType'],
    ], 200);
  }
}
