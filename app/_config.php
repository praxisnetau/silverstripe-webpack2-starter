<?php

/**
 * SilverStripe application configuration file.
 *
 * PHP version >=5.5.0
 *
 * For full copyright and license information, please view the
 * LICENSE.md file that was distributed with this source code.
 */

// Define Globals:

global $project;

// Define Project Name:

$project = 'app';

// Configure Environment:

require_once 'conf/ConfigureFromEnv.php';

// Define Application Constants:

if (!defined('APP_DIR')) {
    define('APP_DIR', basename(__DIR__));
}

if (!defined('APP_PATH')) {
    define('APP_PATH', realpath(__DIR__));
}
