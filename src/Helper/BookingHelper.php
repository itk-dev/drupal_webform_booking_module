<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Booking helper.
 */
class BookingHelper
{
  protected string $bookingApiEndpoint;
  protected string $bookingApiKey;
  protected string $bookingApiAllowInsecureConnection;
  protected bool $bookingApiSampleData;

  /**
   * BookingHelper constructor.
   */
  public function __construct()
  {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint');
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key');
    $this->bookingApiAllowInsecureConnection = Settings::get('itkdev_booking_api_allow_insecure_connection', FALSE);
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
  }

  /**
   * Get a data result depending on request and desired api endpoint.
   *
   * Uses sample data if the setting 'itkdev_booking_api_sample_data' is set. See module README.md.
   *
   * @param string $apiEndpoint
   *   The api endpoint.
   * @param Request $request
   *   The original request.
   *
   * @return mixed
   *   Decoded json data as array.
   *
   * @throws \Exception
   */
  public function getResult(string $apiEndpoint, Request $request)
  {
    if (!$this->bookingApiSampleData) {
      if (!$this->bookingApiEndpoint && !$this->bookingApiKey) {
        throw new \Exception('Booking module not configured.', 500);
      }

      $queryString = $request->getQueryString();

      $response = $this->getResponse($apiEndpoint, $queryString);

      return json_decode($response->getBody(), TRUE);
    }
    else {
      $response = \SampleDataHelper::getSampleData($apiEndpoint);

      return json_decode($response, TRUE);
    }
  }

  /**
   * Get data from booking service.
   *
   * @param string $apiEndpoint
   *   The api endpoint.
   * @param string|null $queryString
   *   An optional query string.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   The api response.
   */
  private function getResponse(string $apiEndpoint, string $queryString = null): ResponseInterface {
    $clientConfig = [];

    if ($this->bookingApiAllowInsecureConnection) {
      $clientConfig['verify'] = false;
    }

    $client = new Client($clientConfig);

    try {
      $response = $client->get(
        $this->bookingApiEndpoint . $apiEndpoint . ($queryString ? '?' . $queryString : ''),
        ['headers' => [
          'accept' => 'application/ld+json',
          'Authorization' => 'Apikey ' . $this->bookingApiKey
        ]]
      );
    } catch (RequestException $e) {
      // Exception is logged.
      \Drupal::logger('itkdev_booking')->error($e);

      throw new HttpException($e->getCode(), $e->getMessage());
    }

    return $response;
  }
}
