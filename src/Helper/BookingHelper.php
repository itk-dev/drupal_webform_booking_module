<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Request;

/**
 * Booking helper.
 */
class BookingHelper
{
  protected string $bookingApiEndpoint;
  protected string $bookingApiKey;
  protected string $bookingApiAllowInsecureConnection;
  protected array $headers;
  protected UserHelper $userHelper;

  public function __construct()
  {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint');
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key');
    $this->bookingApiAllowInsecureConnection = Settings::get('itkdev_booking_api_allow_insecure_connection', FALSE);
    $this->userHelper = new UserHelper();

    $this->headers = [
      'accept' => 'application/ld+json',
      'Authorization' => 'Apikey ' . $this->bookingApiKey
    ];
  }

  /**
   * Get locations.
   *
   * @return array
   */
  public function getLocations(): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $response = $client->get("{$endpoint}v1/locations", ['headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Get resources by query.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   */
  public function getResources(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = $request->query->all();

    $response = $client->get("{$endpoint}v1/resources", ['query' => $query, 'headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Get resource by id.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $resourceId
   *
   * @return array
   */
  public function getResourceById(Request $request, string $resourceId): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $response = $client->get("{$endpoint}v1/resources/$resourceId", ['headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Get busy intervals.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   */
  public function getBusyIntervals(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = $request->query;
    $resources = $query->get('resources');
    $dateStart = $query->get('dateStart');
    $dateEnd = $query->get('dateEnd');

    $response = $client->get("{$endpoint}v1/busy-intervals", [
      'query' => [
        'resources' => $resources,
        'dateStart' => $dateStart,
        'dateEnd' => $dateEnd,
      ],
      'headers' => $this->headers,
    ]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Get user bookings.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   * @throws \JsonException
   */
  public function getUserBookings(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'];

    $response = $client->get("{$endpoint}v1/user-bookings?userId=$userId", ['headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Delete user booking.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $bookingId
   *
   * @return array
   * @throws \JsonException
   */
  public function deleteUserBooking(Request $request, string $bookingId): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'];

    $response = $client->delete("{$endpoint}v1/user-bookings/$bookingId?userId=$userId", ['headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }

  /**
   * Get booking details.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $hitId
   *
   * @return array
   * @throws \JsonException
   */
  public function getUserBookingDetails(Request $request, string $hitId): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'];

    $response = $client->get("{$endpoint}v1/user-bookings/$hitId?userId=$userId", ['headers' => $this->headers]);

    $statusCode = $response->getStatusCode();
    $content = $response->getBody()->getContents();

    try {
      $data = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException $e) {
      $data = [];
    }

    return [
      'statusCode' => $statusCode,
      'data' => $data,
    ];
  }
}
