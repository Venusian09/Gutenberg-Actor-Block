<?php

/*

    Plugin Name: Weather Block
    Description: Show current weather for city with custom Gutenberg Block!
    Version: 1.0
    Author: Kamil Dębczak
    Author URI: https://github.com/Venusian09

*/

class WeatherBlock {
    function __construct() {
        add_action('admin_menu', array($this, 'weatherApiMenu'));
    }

    function weatherApiMenu() {
        add_menu_page('Weather API', 'Weather', 'manage_options', 'weather-api', array($this, 'weatherApiMenuHTML'), 'dashicons-cloud', 100);
    }

    function handleForm() {
        if (wp_verify_nonce($_POST['customNonce'], 'apiWeather') AND current_user_can('manage_options')) {
            update_option('weather-api', sanitize_text_field($_POST['weather-api'])); ?>
            <div class="updated">
              <p>Your filtered words were saved.</p>
            </div>
          <?php } else { ?>
            <div class="error">
              <p>Sorry, you do not have permission to perform that action.</p>
            </div>
          <?php } 
    }

    function weatherApiMenuHTML() { ?>
       <div class="wrap">
        <h1>Weather Block API Key</h1>
        <?php if ($_POST['submitInfo'] == "true") $this->handleForm() ?>
        <form method="POST">
            <input type="hidden" name="submitInfo" value="true">
            <?php wp_nonce_field('apiWeather', 'customNonce') ?>
            <label for="weather-api">Please insert API Key</label>
            <input type="text" placeholder="API Key" name="weather-api" id="weather-api" value="<?php echo esc_attr(get_option('weather-api')) ?>">
            <input type="submit" name="submit" id="submit" class="button button-primary" value="Save">
        </form>
       </div>
    <? }
}

$weatherBlock = new WeatherBlock();