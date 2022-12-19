<?php

namespace Drupal\itkdev_booking\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Site\Settings;
use Drupal\webform\Annotation\WebformElement;
use Drupal\webform\Plugin\WebformElement\Hidden;
use Drupal\webform\WebformInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Url;

/**
 * Provides a webform 'user_bookings_element'.
 *
 * @WebformElement(
 *   id = "user_bookings_element",
 *   api = "https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!Hidden.php/class/Hidden",
 *   label = @Translation("User Bookings"),
 *   description = @Translation("Provides a user bookings form element."),
 *   category = @Translation("Advanced elements"),
 * )
 */
class UserBookingsElement extends Hidden
{

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->extensionList = $container->get('extension.list.module');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  protected function defineDefaultProperties()
  {
    return [
      'rooms' => [],
      'enable_booking' => false,
      'enable_resource_tooltips' => false
    ] + parent::defineDefaultProperties();
  }

  /**
   * {@inheritdoc}
   */
  public function preview()
  {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getTestValues(array $element, WebformInterface $webform, array $options = [])
  {
    // Hidden elements should never get a test value.
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state)
  {
    $form = parent::form($form, $form_state);
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function alterForm(array &$element, array &$form, FormStateInterface $form_state)
  {
    $params = [
      'api_endpoint' => Settings::get('itkdev_booking_api_endpoint_frontend'),
      'front_page_url' => Url::fromRoute('<front>', [], ['absolute' => TRUE])->toString(),
      'license_key' => Settings::get('itkdev_booking_fullcalendar_license'),
      'enable_booking' => (isset($element['#enable_booking'])),
      'enable_resource_tooltips' => (isset($element['#enable_booking'])),
      'output_field_id' => 'submit-values',
      'app-type' => 'user-bookings',
    ];

    $prefix = twig_render_template($this->extensionList->getPath('itkdev_booking') . '/templates/booking_app.html.twig', [
      'params' => $params,
      // Needed to prevent notices when Twig debugging is enabled.
      'theme_hook_original' => 'not-applicable',
    ]);

    if ('booking_element' == $element['#type']) {
      $form['#attached']['library'][] = 'itkdev_booking/booking_app';
      $form['#attached']['drupalSettings']['booking_app'] = $params;
      $form['elements'][$element['#webform_key']]['#prefix'] = $prefix;
      $form['elements'][$element['#webform_key']]['#attributes']['id'] = 'submit-values';
      $form['elements'][$element['#webform_key']]['#default_value'] = json_encode([]);
      $form['#validate'][] = [$this, 'validateBooking'];
    }
  }
}
