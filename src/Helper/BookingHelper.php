<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;
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
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function getLocations(): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/locations", ['headers' => $this->headers]);
  }

  /**
   * Get resources by query.
   *
   * @param array $query
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function getResources(array $query): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/resources", ['query' => $query, 'headers' => $this->headers]);
  }

  /**
   * Get resource by id.
   *
   * @param string $resourceId
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function getResourceById(string $resourceId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/resources/$resourceId", ['headers' => $this->headers]);
  }

  /**
   * Get busy intervals.
   *
   * @param mixed $resources
   * @param string $dateStart
   * @param string $dateEnd
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function getBusyIntervals($resources, string $dateStart, string $dateEnd): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/busy-intervals", [
      'query' => [
        'resources' => $resources,
        'dateStart' => $dateStart,
        'dateEnd' => $dateEnd,
      ],
      'headers' => $this->headers,
    ]);
  }

  /**
   * Get user bookings.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Psr\Http\Message\ResponseInterface
   * @throws \JsonException
   */
  public function getUserBookings(Request $request): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'] ?? '';

    return $client->get("{$endpoint}v1/user-bookings?userId=$userId", ['headers' => $this->headers]);
  }

  /**
   * Delete user booking.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $bookingId
   *
   * @return \Psr\Http\Message\ResponseInterface
   * @throws \JsonException
   */
  public function deleteUserBooking(Request $request, string $bookingId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'] ?? '';

    return $client->delete("{$endpoint}v1/user-bookings/$bookingId?userId=$userId", ['headers' => $this->headers]);
  }

  /**
   * Get booking details.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   * @param string $hitId
   *
   * @return \Psr\Http\Message\ResponseInterface
   * @throws \JsonException
   */
  public function getUserBookingDetails(Request $request, string $hitId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    $userArray = $this->userHelper->getUserValues($request);
    $userId = $userArray['userId'] ?? '';

    return $client->get("{$endpoint}v1/user-bookings/$hitId?userId=$userId", ['headers' => $this->headers]);
  }
}
