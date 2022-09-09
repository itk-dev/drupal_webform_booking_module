<?php

namespace Drupal\itkdev_booking\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\itkdev_booking\Helper\BookingHelper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Resource controller.
 */
class ResourceController extends ControllerBase {
  protected BookingHelper $bookingHelper;

  /**
   * ResourceImportController constructor.
   *
   * @param BookingHelper $bookingHelper
   *   A booking helper service.
   */
  public function __construct(BookingHelper $bookingHelper) {
    $this->bookingHelper = $bookingHelper;
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
   * Fetch resources from booking service.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *
   * @throws \Exception
   */
  public function getResources(Request $request): JsonResponse {
    $query = $request->query->all();

    $response = $this->bookingHelper->getResources($query);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }

  /**
   * Fetch resources from booking service.
   *
   * @param $resourceId
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   * @throws \JsonException
   */
  public function getResource($resourceId): JsonResponse {
    $response = $this->bookingHelper->getResourceById($resourceId);
    $data = json_decode($response->getBody()->getContents(), TRUE, 512, JSON_THROW_ON_ERROR);

    return new JsonResponse($data, $response->getStatusCode());
  }
}
