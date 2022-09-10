<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Component\Utility\Crypt;
use Drupal\Core\Site\Settings;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserHelper {
  protected bool $bookingApiSampleUser;

  public function __construct() {
    $this->bookingApiSampleUser = Settings::get('itkdev_booking_api_sample_user', FALSE);
  }

  public function getUserValues(Request $request): array {
    if ($this->bookingApiSampleUser) {
      return [
        'name' => 'Test Testesen',
        'givenName' => 'Test',
        'userId' => Crypt::hashBase64('1234567890'),
      ];
    }

    $session = $request->getSession();
    $userToken = $session->get('os2forms_nemlogin_openid_connect.user_token');

    if (is_null($userToken) ||
      !array_key_exists('pid', $userToken) ||
      !array_key_exists('name', $userToken) ||
      !array_key_exists('given_name', $userToken)) {
      throw new UnauthorizedHttpException('User should authenticate.');
    }

    return [
      'name' => $userToken['name'],
      'givenName' => $userToken['given_name'],
      'userId' => $this->generateUserId($userToken),
    ];
  }

  private function generateUserId(array $userToken): string {
    return Crypt::hashBase64($userToken['pid']);
  }
}
