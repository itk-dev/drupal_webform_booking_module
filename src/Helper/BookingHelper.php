<?php

namespace Drupal\itkdev_booking\Helper;

use GuzzleHttp\ClientInterface;
use Drupal\Core\Url;

/**
 * Booking helper.
 */
class BookingHelper {
  /**
   * Guzzle Http Client.
   *
   * @var GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * BookingHelper constructor.
   *
   * @param \GuzzleHttp\ClientInterface $guzzleClient
   *   The http client.
   */
  public function __construct(ClientInterface $guzzleClient) {
    $this->httpClient = $guzzleClient;
  }

  /**
   * Get resources from booking endpoint.
   */
  public function getResources() {
    $url = Url::fromRoute('itkdev_booking.resources_endpoint', [], ['absolute' => TRUE])->toString();
    try {
      $request = $this->httpClient->get($url);
      $file_contents = $request->getBody()->getContents();
    }
    catch (RequestException $e) {
      watchdog_exception('itkdev_booking', $e);
    }

    return json_decode($file_contents, TRUE);
  }

}
