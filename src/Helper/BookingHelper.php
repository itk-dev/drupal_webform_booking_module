<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Request;

/**
 * Booking helper.
 */
class BookingHelper {

  protected string $bookingApiEndpoint;

  protected string $bookingApiKey;

  protected string $bookingApiAllowInsecureConnection;

  protected array $headers;

  protected UserHelper $userHelper;

  public function __construct() {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint');
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key');
    $this->bookingApiAllowInsecureConnection = Settings::get('itkdev_booking_api_allow_insecure_connection', FALSE);
    $this->userHelper = new UserHelper();

    $this->headers = [
      'accept' => 'application/ld+json',
      'Authorization' => 'Apikey ' . $this->bookingApiKey,
    ];
  }

  /**
   * Get locations.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   * @throws \JsonException
   */
  public function getLocations(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = [];

    // Attach user query parameters if user is logged in.
    $query = $this->userHelper->attachPermissionQueryParameters($request, $query);

    $response = $client->get("{$endpoint}v1/locations", [
      'query' => $query,
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
   * Get resources by query.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   * @throws \JsonException
   */
  public function getResources(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = $request->query->all();

    // Attach permission query parameters if user is logged in.
    $query = $this->userHelper->attachPermissionQueryParameters($request, $query);

    $response = $client->get("{$endpoint}v1/resources", [
      'query' => $query,
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
   * Get all resources.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   * @throws \JsonException
   */
  public function getAllResources(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = [];

    // Attach permission query parameters if user is logged in.
    $query = $this->userHelper->attachPermissionQueryParameters($request, $query);

    $headers = $this->userHelper->attachUserToHeaders($request, $this->headers);

    $response = $client->get("{$endpoint}v1/resources-all", [
      'query' => $query,
      'headers' => $headers,
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
   * Get resource by id.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $resourceId
   *
   * @return array
   * @throws \JsonException
   */
  public function getResourceById(Request $request, string $resourceId): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = [];

    // Attach user query parameters if user is logged in.
    $query = $this->userHelper->attachPermissionQueryParameters($request, $query);

    $response = $client->get("{$endpoint}v1/resources/$resourceId", [
      'query' => $query,
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
   * Get busy intervals.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return array
   * @throws \JsonException
   */
  public function getBusyIntervals(Request $request): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $query = $request->query->all();

    // Attach user query parameters if user is logged in.
    $query = $this->userHelper->attachPermissionQueryParameters($request, $query);

    $response = $client->get("{$endpoint}v1/busy-intervals", [
      'query' => $query,
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

    $query = [];

    $headers = $this->userHelper->attachUserToHeaders($request, $this->headers);

    $response = $client->get("{$endpoint}v1/user-bookings", [
      'query' => $query,
      'headers' => $headers,
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

    $headers = $this->userHelper->attachUserToHeaders($request, $this->headers);

    $response = $client->delete("{$endpoint}v1/user-bookings/$bookingId", [
      'headers' => $headers,
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
   * Delete user booking.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $bookingId
   *
   * @return array
   * @throws \JsonException
   */
  public function patchUserBooking(Request $request, string $bookingId): array {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $headers = $this->userHelper->attachUserToHeaders($request, $this->headers);

    $headers['content-type'] = 'application/merge-patch+json';

    $response = $client->patch("{$endpoint}v1/user-bookings/$bookingId", [
      'json' => json_decode($request->getContent()),
      'headers' => $headers,
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

    $query = [];

    $headers = $this->userHelper->attachUserToHeaders($request, $this->headers);

    $response = $client->get("{$endpoint}v1/user-bookings/$hitId", [
      'query' => $query,
      'headers' => $headers,
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

}
