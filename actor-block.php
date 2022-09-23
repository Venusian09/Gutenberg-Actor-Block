<?php

/*

    Plugin Name: Actor Block
    Description: Show actor details with Gutenberg Block!
    Version: 1.0
    Author: Kamil Dębczak
    Author URI: https://github.com/Venusian09

*/

class ActorBlock {
    function __construct() {
        add_action('admin_menu', array($this, 'actorApi'));
        add_action('rest_api_init', array($this, 'actorApiKey'));
        if (get_option('actor-api')) {
            add_action('init', array($this, 'blockAssets'));
        }
    }
    function actorApiKey() {
        register_rest_route( 'my-custom-route/v1', '/opt/', array(
            'methods' => 'GET',
            'callback' => function ($data) {
                if( $data['option_name'] === 'actor-api'){
                    return get_option( $data['option_name'] );
                } else {
                    return 'Unauthorized. Use `siteurl` or `blogname`';
                }
            },
            'permission_callback' => function ( ) {
                return current_user_can( 'publish_posts' );
            },
        ) );
    }

    

    function actorApi() {
        add_menu_page('Actor API', 'Actor', 'manage_options', 'actor-api', array($this, 'actorApiHTML'), 'dashicons-admin-users', 100);
    }

    function handleForm() {
        if (wp_verify_nonce($_POST['customNonce'], 'apiActor') AND current_user_can('manage_options')) {
            update_option('actor-api', sanitize_text_field($_POST['actor-api'])); ?>
            <div class="updated">
              <p>Your API key has been saved.</p> 
            </div>
          <?php } else { ?>
            <div class="error">
              <p>Sorry, you do not have permission to perform that action.</p>
            </div>
          <?php } 
    }

    function actorApiHTML() { ?>
       <div class="wrap">
        <h1>Actor Block API Key</h1>
        <?php if ($_POST['submitInfo'] == "true") $this->handleForm() ?>
        
        <form method="POST">
            <input type="hidden" name="submitInfo" value="true">
            <?php wp_nonce_field('apiActor', 'customNonce') ?>
            <label for="actor-api">Please insert API Key</label>
            <input type="text" placeholder="API Key" name="actor-api" id="actor-api" value="<?php echo esc_attr(get_option('actor-api')) ?>">
            <input type="submit" name="submit" id="submit" class="button button-primary" value="Save">
        </form>
       </div>
    <? }

    function blockAssets() {
        wp_register_script('actorapi', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-components', 'wp-editor'));
        wp_enqueue_style('actorapiCss', plugin_dir_url(__FILE__) . 'build/index.css');

        if (!is_admin()) {
            wp_enqueue_script('actorFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'), '1.0', true);
                wp_enqueue_style('actorFrontendCss', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }
        
        register_block_type('actorapi/actorapi', array(
            'editor_script' => 'actorapi',
        ));
        wp_localize_script('actorapi', 'apiNonce', array(
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'page_url' => get_site_url(),
        ));
        wp_enqueue_script('actorapi');
    }
}

$actorBlock = new ActorBlock();