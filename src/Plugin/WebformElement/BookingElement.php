<?php

namespace Drupal\itkdev_booking\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Annotation\WebformElement;
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
        'enable_resource_tooltips' => false,
        'step1' => false,
        'redirect_url' => ''
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

    $form['element']['step1'] = array(
      '#type' => 'checkbox',
      '#title' => $this
        ->t('Display mode only'),
      '#description' => $this
        ->t('If checked the form will perform a redirect with booking parameters when booking choices are made.'),
    );

    $form['element']['redirect_url'] = array(
      '#type' => 'url',
      '#title' => $this
        ->t('Redirect url'),
      '#states' => [
        'visible' => [
          ':input[name="properties[step1]"]' => ['checked' => TRUE],
        ],
      ]
    );


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
      'step_one' => isset($element['#step1']),
      'redirect_url' => $element['#redirect_url'] ?? null,
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

  /**
   * Validate booking data in hidden field.
   *
   * @param $form
   *   The form to validate.
   * @param FormStateInterface $form_state
   *   The state of the form.
   */
  public function validateBooking(&$form, FormStateInterface $form_state) {
    // @todo handle validation after react submisison.
    $elements = $form['elements'];
    foreach ($elements as $key => $form_element) {
      if (is_array($form_element) && isset($form_element['#type']) && 'booking_element' === $form_element['#type']) {
        $bookingValues = json_decode($form_state->getValues()[$key], TRUE);
        foreach ($bookingValues as $bookingKey => $bookingValue) {
          if (empty($bookingValue)) {
            switch ($bookingKey) {
              case 'subject':
                $form_state->setError($form, t('Error in "Booking title"'));
                break;
              case 'authorName':
                $form_state->setError($form, t('Error in "Your Name"'));
                break;
              case 'authorEmail':
                $form_state->setError($form, t('Error in "Your email"'));
                break;
              case 'resourceEmail':
              case 'startTime':
              case 'endTime':
                $form_state->setError($form, t('Error in booking selection'));
                break;
              default:
                $form_state->setError($form, t('Error in form. Please reload page and try again.'));
            }
          }
        }
      }
    }
  }
}
