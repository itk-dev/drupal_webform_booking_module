<?php

namespace Drupal\itkdev_booking\Helper;

use Drupal\Component\Utility\Crypt;
use Drupal\Core\Site\Settings;
use Symfony\Component\HttpFoundation\Request;

class UserHelper {
  protected bool $bookingApiSampleUser;

  public function __construct() {
    $this->bookingApiSampleUser = Settings::get('itkdev_booking_api_sample_user', FALSE);
  }

  /**
   * @throws \JsonException
   */
  public function attachUserToQueryParameters(Request $request, array $query, bool $attachUserId = false): array {
    $userArray = $this->getUserValues($request);

    if ($userArray != null) {
      if ($attachUserId) {
        $query['userId'] = $userArray['userId'];
      }

      $permission = $userArray['permission'];
      $query['permission'] = $permission;

      if ($permission == 'businessPartner') {
        if (isset($userArray['whitelistKey'])) {
          $query['whitelistKey'] = $userArray['whitelistKey'];
        }
      }
    }

    return $query;
  }

  /**
   * @throws \JsonException
   */
  public function getUserValues(Request $request): ?array {
    if ($this->bookingApiSampleUser) {
      return SampleDataHelper::getSampleData('user');
    }

    $session = $request->getSession();
    $userToken = $session->get('os2forms_nemlogin_openid_connect.user_token');

    if (is_null($userToken) ||
      !array_key_exists('pid', $userToken) ||
      !array_key_exists('name', $userToken) ||
      !array_key_exists('given_name', $userToken)) {
      return null;
    }

    $permission = null;

    if (isset($userToken['cpr'])) {
      $permission = 'citizen';
    } else if (isset($userToken['cvr'])) {
      // TODO: Test this.
      $permission = 'businessPartner';
      $whitelistKey = $userToken['cvr'];
    }

    if ($permission == null) {
      return null;
    }

    return [
      'name' => $userToken['name'],
      'givenName' => $userToken['given_name'],
      'permission' => $permission,
      'userId' => $this->generateUserId($userToken),
      'whitelistKey' => $whitelistKey ?? null,
    ];
  }

  private function generateUserId(array $userToken): string {
    return Crypt::hashBase64($userToken['pid']);
  }
}
