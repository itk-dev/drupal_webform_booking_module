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
class UserBookingsHelper
{
  protected ClientInterface $httpClient;
  protected string $bookingApiEndpoint;
  protected string $bookingApiKey;
  protected bool $bookingApiSampleData;

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
  }

  /**
   * Get resources from local resources endpoint.
   *
   * @return mixed
   */
  public function getUserBookings()
  {
    $url = Url::fromRoute('itkdev_booking.user_bookings', ['userId' => '1'], ['absolute' => TRUE])->toString();
    $client = new Client();
    try {
      $response = $client->get($url);
    } catch (RequestException $e) {
      // Exception is logged
    }

    return json_decode($response->getBody(), TRUE);
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
      // TODO: Cleanup hacks.
      switch ($apiEndpoint) {
        case "v1/user-bookings":
          if ($request->isMethod("DELETE")) {
            $response = $this->deleteData($apiEndpoint, $request->getQueryString());
          } else {
            $response = $this->getData($apiEndpoint, $request->getQueryString());
          }
          return json_decode($response->getBody(), TRUE);
        case "v1/booking-details":
          $hitId = base64_decode($request->attributes->get('hitid'));
          $response = $this->getBookingDetails($apiEndpoint, $hitId);
          return json_decode($response->getBody(), TRUE);
        default:
          return "No endpoint defined";
      }
    } else {
      $response = \SampleDataHelper::getSampleData($apiEndpoint);
      return json_decode($response, TRUE);
    }
  }

  /**
   * Request action depending on request and desired api endpoint.
   *
   *
   *
   * @param string $apiEndpoint
   *   The api endpoint specification.
   * @param Request $request
   *   The original request.
   * @return mixed
   *   Decoded json data as array.
   */
  public function sendRequest(string $apiEndpoint, Request $request, $queryString)
  {
    $fields = json_decode($request->getContent());
    $param1 = $fields->param1;
    $param2 = $fields->param2;


    return $param1;
    // $response = [];
    // $client = new Client();
    // try {
    //   $response = $client->get(
    //       $this->bookingApiEndpoint . $apiEndpoint . '?' . $queryString,
    //     ['headers' => [
    //       'accept' => 'application/ld+json',
    //       'Authorization' => 'Apikey ' . $this->bookingApiKey
    //     ]]);

    // } catch (RequestException $e) {
    //   // Exception is logged.
    // }
    // return $response;

    // if ($this->bookingApiEndpoint && $this->bookingApiKey) {
    //   $response = $this->getData($apiEndpoint, $request->getQueryString());
    //   return json_decode($response->getBody(), TRUE);
    // }
    // else {
    //   $response =  \SampleDataHelper::getSampleData($apiEndpoint);
    //   return json_decode($response, TRUE);
    // }
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
    $client = new Client();

    return $client->get(
      $this->bookingApiEndpoint . $apiEndpoint . '?' . $queryString,
      ['headers' => [
        'accept' => 'application/ld+json',
        'Authorization' => 'Apikey ' . $this->bookingApiKey
      ]]
    );
  }

  /**
   * @param $apiEndpoint
   * @param $queryString
   *
   * @return \Psr\Http\Message\ResponseInterface
   */
  private function deleteData($apiEndpoint, $queryString)
  {
    $client = new Client();

    return $client->delete(
      $this->bookingApiEndpoint . $apiEndpoint . '?' . $queryString,
      ['headers' => [
        'accept' => 'application/ld+json',
        'Authorization' => 'Apikey ' . $this->bookingApiKey
      ]]
    );
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
  private function getBookingDetails($apiEndpoint, $queryString)
  {
    $client = new Client();

    return $client->get(
      $this->bookingApiEndpoint . $apiEndpoint . '?bookingId=' . $queryString . '&page=1',
      ['headers' => [
        'accept' => 'application/ld+json',
        'Authorization' => 'Apikey ' . $this->bookingApiKey
      ]]
    );
  }
}
