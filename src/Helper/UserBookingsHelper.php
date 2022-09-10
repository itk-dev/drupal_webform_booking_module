<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * Booking helper.
 */
class UserBookingsHelper
{
  protected ClientInterface $httpClient;
  protected string $bookingApiEndpoint;
  protected string $bookingApiKey;
  protected bool $bookingApiSampleData;
  protected array $headers;

  /**
   * @param \GuzzleHttp\ClientInterface $guzzleClient
   *   The http client.
   */
  public function __construct(ClientInterface $guzzleClient)
  {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint');
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key');
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
    $this->httpClient = $guzzleClient;

    $this->headers = [
      'accept' => 'application/ld+json',
      'Authorization' => 'Apikey ' . $this->bookingApiKey
    ];
  }

  /**
   * Get user bookings.
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function getUserBookings(string $userId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/user-bookings?userId=$userId", ['headers' => $this->headers]);
  }

  /**
   * Delete user booking.
   *
   * @param string $bookingId
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  public function deleteUserBooking(string $userId, string $bookingId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->delete("{$endpoint}v1/user-bookings/$bookingId?userId=$userId", ['headers' => $this->headers]);
  }

  /**
   * Get booking details.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   The api response.
   */
  public function getBookingDetails(string $userId, string $hitId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    $client = new Client();

    return $client->get("{$endpoint}v1/user-bookings/$hitId?userId=$userId", ['headers' => $this->headers]);
  }
}
