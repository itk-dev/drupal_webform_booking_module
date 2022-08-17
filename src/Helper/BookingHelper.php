<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Core\Site\Settings;
use Drupal\Core\Url;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\HttpFoundation\Request;

/**
 * Booking helper.
 */
class BookingHelper
{
  /**
   * Guzzle Http Client.
   *
   * @var GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * The booking api endpoint.
   *
   * @var string|mixed
   */
  protected string $bookingApiEndpoint;

  /**
   * The booking api key.
   *
   * @var string|mixed
   */
  protected string $bookingApiKey;

  /**
   * BookingHelper constructor.
   *
   * @param \GuzzleHttp\ClientInterface $guzzleClient
   *   The http client.
   */
  public function __construct(ClientInterface $guzzleClient)
  {
    // $this->bookingApiEndpoint = Settings::get('itkdev_booking_api_endpoint', NULL);
    // $this->bookingApiKey = Settings::get('itkdev_booking_api_key', NULL);
    $this->bookingApiEndpoint = "https://stgbookaarhus.adm.aarhuskommune.dk/";
    $this->bookingApiKey = "8f8dbb047163321ee125ea504fda17d6352711e920f7ac286895d85b02bdaacbdd8419af2839025a288d194e983b6f772bbb2f0b7af9ee98719f57df0f4e2c8f";

    $this->httpClient = $guzzleClient;
  }

  /**
   * Get resources from local resources endpoint.
   *
   * @return mixed
   */
  public function getResources()
  {
    $response = [];
    $client = new Client();
    try {
      $response = $client->get(
        $this->bookingApiEndpoint . "v1/resources",
        ['headers' => [
          'accept' => 'application/ld+json',
          'Authorization' => 'Apikey ' . $this->bookingApiKey
        ]]
      );
    } catch (RequestException $e) {
      // Exception is logged.
    }
    return $response;
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
   * @return mixed
   *   Decoded json data as array.
   */
  public function getResult(string $apiEndpoint, Request $request)
  {
    if ($this->bookingApiEndpoint && $this->bookingApiKey) {
      $response = $this->getData($apiEndpoint, $request->getQueryString());
      return json_decode($response->getBody(), TRUE);
    } else {
      $response = $this->getSampleData($apiEndpoint);
      return json_decode($response, TRUE);
    }
  }

  /**
   * Get real data.
   *
   * @param $apiEndpoint
   *   The api endpoint specification.
   * @param $queryString
   *   An additional querystring.
   * @return array|\Psr\Http\Message\ResponseInterface
   *   The api response.
   */
  private function getData($apiEndpoint, $queryString)
  {

    $response = [];
    $client = new Client();
    // if ($apiEndpoint == "v1/busy-intervals") {
    //   die(print('<pre>' . print_r($this->bookingApiEndpoint . $apiEndpoint . '?' . $queryString, true) . '</pre>'));
    // }
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
