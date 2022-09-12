<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Site\Settings;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Drupal\itkdev_booking\Helper\SampleDataHelper;
use Drupal\itkdev_booking\Helper\UserHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * UserBooking controller.
 */
class BookingController extends ControllerBase {
  protected BookingHelper $bookingHelper;
  protected bool $bookingApiSampleData;
  protected UserHelper $userHelper;

  /**
   * UserBookingsController constructor.
   *
   * @param BookingHelper $bookingsHelper
   */
  public function __construct(BookingHelper $bookingsHelper) {
    $this->bookingHelper = $bookingsHelper;
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
    $this->userHelper = new UserHelper();
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): BookingController {
    return new static($container->get('itkdev_booking.booking_helper'));
  }

  /**
   * Get locations.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getLocations(): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("locations");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getLocations();
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Get resources.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *
   * @throws \Exception
   */
  public function getResources(Request $request): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("resources");
      return new JsonResponse($data, 200);
    }

    $query = $request->query->all();

    $response = $this->bookingHelper->getResources($request, $query);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Get resource by id.
   *
   * @param string $resourceId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getResource(Request $request, string $resourceId): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("resource");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getResourceById($request, $resourceId);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Get busy intervals.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *
   * @throws \Exception
   */
  public function getBusyIntervals(Request $request): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("busy-intervals");
      return new JsonResponse($data, 200);
    }

    $query = $request->query;
    $resourceEmails = $query->get('resources');
    $dateStart = $query->get('dateStart');
    $dateEnd = $query->get('dateEnd');

    $response = $this->bookingHelper->getBusyIntervals($request, $resourceEmails, $dateStart, $dateEnd);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
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

    $response = $this->bookingHelper->getUserBookings($request);
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
   * @throws \JsonException
   */
  public function deleteUserBooking(Request $request, string $bookingId): JsonResponse {
    if ($this->bookingApiSampleData) {
      return new JsonResponse([], 201);
    }

    $response = $this->bookingHelper->deleteUserBooking($request, $bookingId);

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
  public function getUserBookingDetails(Request $request, string $hitId): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = SampleDataHelper::getSampleData("booking-details");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getUserBookingDetails($request, $hitId);
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
  public function getUserInformation(Request $request): JsonResponse {
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
