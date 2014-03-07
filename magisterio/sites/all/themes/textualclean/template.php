<?php

function textualclean_theme(&$existing, $type, $theme, $path) {
  $hooks['user_login'] = array(
    'template' => 'templates/user_login',
    'render element' => 'form',
    // other theme registration code...
  );
  return $hooks;
}

function textualclean_preprocess_user_login(&$variables) {
  $variables['intro_text'] = t('This is my awesome login form');
  $variables['rendered'] = drupal_render_children($variables['form']);
}
?>
