<?php

class SampleDataHelper {
  /**
   * Get sample data from local file.
   *
   * @param $apiEndpoint
   *   The api endpoint specification.
   * @return false|string
   *   The sample data requested.
   */
  public static function getSampleData($apiEndpoint)
  {
    switch ($apiEndpoint) {
      case 'v1/busy-intervals':
        return file_get_contents(__DIR__ . '/../../sampleData/busy-intervals.json');
      case 'v1/resources':
        return file_get_contents(__DIR__ . '/../../sampleData/resources.json');
      case 'v1/user-bookings':
        return file_get_contents(__DIR__ . '/../../sampleData/user-bookings.json');
    }
  }
}
