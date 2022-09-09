<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Site\Settings;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Resource controller.
 */
class ResourceController extends ControllerBase {
  protected BookingHelper $bookingHelper;
  protected bool $bookingApiSampleData;

  /**
   * @param BookingHelper $bookingHelper
   *   A booking helper service.
   */
  public function __construct(BookingHelper $bookingHelper) {
    $this->bookingHelper = $bookingHelper;
    $this->bookingApiSampleData = Settings::get('itkdev_booking_api_sample_data', FALSE);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): ResourceController {
    return new static(
      $container->get('itkdev_booking.booking_helper')
    );
  }

  /**
   * Get resources.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *
   * @throws \Exception
   */
  public function getResources(Request $request): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = \SampleDataHelper::getSampleData("resources");
      return new JsonResponse($data, 200);
    }

    $query = $request->query->all();

    $response = $this->bookingHelper->getResources($query);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Get resource by id.
   *
   * @param string $resourceId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getResource(string $resourceId): JsonResponse {
    if ($this->bookingApiSampleData) {
      $data = \SampleDataHelper::getSampleData("resource");
      return new JsonResponse($data, 200);
    }

    $response = $this->bookingHelper->getResourceById($resourceId);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
