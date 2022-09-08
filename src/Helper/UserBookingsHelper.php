<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use Drupal\Core\Url;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;

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
   * UserBookingsHelper constructor.
   *
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

  public function getUserBookings(): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    // TODO: Attach userid.
    $userId = "TODO";
    $client = new Client();

    return $client->delete("$endpoint/v1/user-bookings?userid=$userId", ['headers' => $this->headers]);
  }

  public function deleteUserBooking(string $bookingId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    // TODO: Attach userid.
    $userId = "TODO";
    $client = new Client();

    return $client->delete("$endpoint/v1/user-bookings/$bookingId?userid=$userId", ['headers' => $this->headers]);
  }

  /**
   * Get booking details.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   The api response.
   */
  public function getBookingDetails(string $hitId): ResponseInterface {
    $endpoint = $this->bookingApiEndpoint;
    // TODO: Attach userid.
    $userId = "TODO";

    $client = new Client();

    return $client->get("$endpoint/v1/user-bookings/$hitId?userid=$userId", ['headers' => $this->headers]);
  }
}
