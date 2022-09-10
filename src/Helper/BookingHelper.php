<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

/**
 * Booking helper.
 */
class BookingHelper
{
  protected string $bookingApiEndpoint;
  protected string $bookingApiKey;
  protected string $bookingApiAllowInsecureConnection;
  protected array $headers;

  public function __construct()
  {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint');
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key');
    $this->bookingApiAllowInsecureConnection = Settings::get('itkdev_booking_api_allow_insecure_connection', FALSE);

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
}
