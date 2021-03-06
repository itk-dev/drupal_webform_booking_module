<?php

namespace Drupal\itkdev_booking\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Plugin\WebformElement\Hidden;
use Drupal\Core\Site\Settings;
use Drupal\webform\WebformInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Url;

/**
 * Provides a webform 'booking_element'.
 *
 * @WebformElement(
 *   id = "booking_element",
 *   api = "https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!Hidden.php/class/Hidden",
 *   label = @Translation("Booking"),
 *   description = @Translation("Provides a booking form element."),
 *   category = @Translation("Advanced elements"),
 * )
 */
class BookingElement extends Hidden
{

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->extensionList = $container->get('extension.list.module');
    $instance->bookingHelper = $container->get('itkdev_booking.booking_helper');
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

    $form['element']['rooms_wrapper'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Select rooms'),
      '#weight' => -50,
    ];

    $options = [];
    $resources = $this->bookingHelper->getResources();
    foreach ($resources['hydra:member'] as $resource) {
      $options[$resource['email']] = $resource['title'];
    }
    $form['element']['rooms_wrapper']['rooms'] = [
      '#type' => 'checkboxes',
      '#options' => $options,
      '#description' => !$resources ? $this->t('Using test data while API endpoint is not set. Define $settings["itkdev_booking_api_endpoint"] in settings.php') : '',
      '#weight' => -50,
    ];

    $form['element']['enable_booking'] = array(
      '#type' => 'checkbox',
      '#title' => $this
        ->t('Enable booking'),
    );
    $form['element']['enable_resource_tooltips'] = array(
      '#type' => 'checkbox',
      '#title' => $this
        ->t('Enable resource tooltips'),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function alterForm(array &$element, array &$form, FormStateInterface $form_state)
  {
    $params = [
      'api_endpoint' => Settings::get('itkdev_booking_api_endpoint', NULL),
      'element_id' => $element['#webform_key'],
      'rooms' => $element['#rooms'],
      'front_page_url' => Url::fromRoute('<front>', [], ['absolute' => TRUE])->toString(),
      'license_key' => Settings::get('itkdev_booking_fullcalendar_license', NULL),
      'enable_booking' => (isset($element['#enable_booking'])),
      'enable_resource_tooltips' => (isset($element['#enable_booking']))
    ];

    $prefix = twig_render_template($this->extensionList->getPath('itkdev_booking') . '/templates/booking_calendar.html.twig', [
      'params' => $params,
      // Needed to prevent notices when Twig debugging is enabled.
      'theme_hook_original' => 'not-applicable',
    ]);

    if ('booking_element' == $element['#type']) {
      $form['#attached']['library'][] = 'itkdev_booking/booking_calendar';
      $form['#attached']['drupalSettings']['booking_calendar'][$element['#webform_key']] = $params;
      $form['elements'][$element['#webform_key']]['#prefix'] = $prefix;
    }
  }
}
