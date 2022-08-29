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
class BookingHelper
{
  /**
   * Guzzle Http Client.
   */
  protected ClientInterface $httpClient;

  /**
   * The booking api endpoint.
   */
  protected string $bookingApiEndpoint;

  /**
   * The booking api key.
   */
  protected string $bookingApiKey;

  /**
   * Whether we use a secure connection
   */
  protected string $bookingApiAllowInsecureConnection;

  private bool $bookingUseSampleData;

  /**
   * BookingHelper constructor.
   *
   * @param \GuzzleHttp\ClientInterface $guzzleClient
   *   The http client.
   */
  public function __construct(ClientInterface $guzzleClient)
  {
    $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint', NULL);
    $this->bookingApiKey = Settings::get('itkdev_booking_api_key', NULL);
    $this->bookingUseSampleData = Settings::get('itkdev_booking_use_sample_data', FALSE);
    $this->bookingApiAllowInsecureConnection = Settings::get('itkdev_booking_api_allow_insecure_connection', FALSE);
    $this->httpClient = $guzzleClient;
  }

  /**
   * Get resources from local resources endpoint.
   *
   * @return mixed
   * @throws \HttpException
   */
  public function getResources()
  {
    $request = new Request(['page' => 1]);

    return $this->getResult('v1/resources', $request);
  }

  /**
   * Get a data result depending on request and desired api endpoint.
   *
   * Uses sample data if no api endpoint is set. See module README.md.
   *
   * @param string $apiEndpoint
   *   The api endpoint specification.
   * @param Request $request
   *   The original request.
   *
   * @return mixed
   *   Decoded json data as array.
   *
   * @throws \HttpException
   */
  public function getResult(string $apiEndpoint, Request $request)
  {
    if ($this->bookingUseSampleData) {
      $response = $this->getSampleData($apiEndpoint);

      return json_decode($response, TRUE);
    }
    if ($this->bookingApiEndpoint && $this->bookingApiKey) {
      $queryString = http_build_query($request->query->all());
      $response = $this->getData($apiEndpoint, $queryString);

      return json_decode($response->getBody(), TRUE);
    } else {

    }
  }

  /**
   * Get data from booking service.
   *
   * @param $apiEndpoint
   *   The api endpoint specification.
   * @param $queryString
   *   An additional querystring.
   *
   * @return \Psr\Http\Message\ResponseInterface
   *   The api response.
   * @throws \HttpException
   */
  private function getData($apiEndpoint, $queryString): ResponseInterface {
    $clientConfig = [];

    if ($this->bookingApiAllowInsecureConnection) {
      $clientConfig['verify'] = false;
    }

    $client = new Client($clientConfig);

    try {
      $response = $client->get(
        $this->bookingApiEndpoint . $apiEndpoint . '?' . $queryString,
        ['headers' => [
          'accept' => 'application/ld+json',
          'Authorization' => 'Apikey ' . $this->bookingApiKey
        ]]
      );
    } catch (RequestException $e) {
      // Exception is logged.
      \Drupal::logger('itkdev_booking')->error($e);

      throw new \HttpException($e->getMessage(), $e->getCode());
    }

    return $response;
  }

  /**
   * Get sample data from local file.
   *
   * @param $apiEndpoint
   *   The api endpoint specification.
   * @return false|string
   *   The sample data requested.
   */
  private function getSampleData($apiEndpoint)
  {
    switch ($apiEndpoint) {
      case 'v1/busy-intervals':
        return file_get_contents(__DIR__ . '/../../sampleData/busy-intervals.json');
      case 'v1/resources':
        return file_get_contents(__DIR__ . '/../../sampleData/resources.json');
    }
  }
}
