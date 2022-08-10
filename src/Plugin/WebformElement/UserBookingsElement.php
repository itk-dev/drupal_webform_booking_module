<?php

namespace Drupal\itkdev_booking\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
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
    $instance->bookingHelper = $container->get('itkdev_booking.user_bookings_helper');
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
      'test_msg' => "Hello World!",
      'element_id' => $element['#webform_key'],
      'front_page_url' => Url::fromRoute('<front>', [], ['absolute' => TRUE])->toString(),
    ];

    $prefix = twig_render_template($this->extensionList->getPath('itkdev_booking') . '/templates/user_bookings.html.twig', [
      'params' => $params,
      // Needed to prevent notices when Twig debugging is enabled.
      'theme_hook_original' => 'not-applicable',
    ]);

    if ('user_bookings_element' == $element['#type']) {
      $form['#attached']['library'][] = 'itkdev_booking/booking_calendar';
      $form['#attached']['drupalSettings']['user_bookings'][$element['#webform_key']] = $params;
      $form['elements'][$element['#webform_key']]['#prefix'] = $prefix;
    }
  }
}
