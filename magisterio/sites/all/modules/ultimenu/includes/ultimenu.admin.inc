<?php

/**
 * @file
 * The setting for Ultimenu.
 */

/**
 * Menu callback for 'admin/structure/ultimenu'.
 */
function ultimenu_admin_settings() {
  $path = drupal_get_path('module', 'ultimenu');

  $form['ultimenu'] = array(
    '#type' => 'fieldset',
    '#title' => t('Ultimenu settings'),
    '#description' => t('An Ultimenu <strong>block</strong> is based on a <strong>menu</strong>. Ultimenu <strong>regions</strong> are based on the <strong>menu items</strong>. The result is a block contains regions containing blocks, as opposed to: a region contains blocks.'),
  );

  $form['#attached']['css'][] = $path . '/css/ultimenu.admin.css';

  $menus  = ultimenu_get_menus();
  $blocks = ultimenu_get_settings('blocks');
  $form['ultimenu']['blocks'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Toggle Ultimenu blocks.'),
    '#options' => array(),
    '#default_value' => !empty($blocks) ? array_values((array) $blocks) : array(),
    '#description' => t('Check one to create an Ultimenu <strong>block</strong>. The block will be available at <a href="@block_admin">block admin</a>, or context admin. And the relevant regions based on its enabled menu items will be available below after saving. Ultimenu will only care for the first top level menus. If you are willing to use submenus, please use <A href="@menu_block">menu_block.module</a>, and embed them inside Ultimenu regions, or use regular dropdown method, instead.', array('@block_admin' => url('admin/structure/block'), '@menu_block' => '//drupal.org/project/menu_block')),
  );

  foreach ($menus as $key => $menu) {
    $form['ultimenu']['blocks']['#options'][$key] = $menu;

    if (!empty($blocks[$key])) {
      $form['ultimenu']['blocks'][$key]['#field_suffix'] = t('[<a href="@edit">edit</a>]', array('@edit' => url("admin/structure/block/manage/ultimenu/{$key}/configure")));
    }
  }

  // All available Ultimenu regions.
  $ultimenu_regions = ultimenu_regions();

  $regions = ultimenu_get_settings('regions');
  $form['ultimenu']['regions'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Toggle Ultimenu regions.'),
    '#options' => $ultimenu_regions,
    '#default_value' => !empty($regions) ? array_values((array) $regions) : array(),
    '#description' => t('Check one to enable an Ultimenu <strong>region</strong>. The regions will be available at block/context admin.'),
  );

  // Compare settings against Ultimenu regions stored in theme .info.
  if ($theme_regions = ultimenu_get_ultimenu_theme_info()) {
    foreach ($theme_regions as $key => $region) {
      $form['ultimenu']['regions'][$key]['#attributes']['class'][] = 'stored-in-theme';
      // Option disabled, but region stored in theme .info, provide hint.
      if (empty($regions[$key])) {
        // Ultimenu region is stored in .info, and force remove is enabled.
        if (ultimenu_remove_ultimenu_theme_info()) {
          $form['ultimenu']['regions'][$key]['#field_suffix'] = t('&#8592; Stored, but force removed');
        }
        // Ultimenu region is stored in .info, and force remove is disabled.
        else {
          $form['ultimenu']['regions'][$key]['#attributes']['class'][] = 'error';
          $form['ultimenu']['regions'][$key]['#field_suffix'] = t('&#8592; Stored, but disabled?');
        }
      }
    }
  }

  $goodies = ultimenu_get_settings('goodies');
  // Menu title tooltip: http://webdesign.about.com/od/htmltags/a/aa101005.htm
  $form['ultimenu']['goodies'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Toggle Ultimenu goodies.'),
    '#default_value' => !empty($goodies) ? array_values((array) $goodies) : array(),
    '#options' => array(
      'menu-desc' => t('Render menu description'),
      'desc-top' => t('Menu description above menu title'),
      'title-class' => t('Add title class to menu item list'),
      'mlid-class' => t('Add mlid class to menu item list'),
      'counter-class' => t('Add menu counter class'),
      'no-tooltip' => t('Remove browser tooltip'),
      'ultimenu-mlid' => t('Use mlid, not title for Ultimenu region key'),
      'force-remove-region' => t('Force remove Ultimenu region stored in <strong>@theme_default.info</strong>', array('@theme_default' => variable_get('theme_default', 'bartik'))),
      // 'use-hoverintent' => t('Use hoverIntent'),
      // 'use-easing' => t('Use easing'),
    ),
    '#description' => t('You can force remove unwanted Ultimenu regions stored in <strong>@theme_default.info</strong>. Otherwise theme .info will always win, ignoring the region checkboxes above.',
      array('@theme_default' => variable_get('theme_default', 'bartik'))),
    // If using hoverIntent, please install jquery_hoverintent.module, and its
    // library. If using easing, please select the following easing method.
  );

  $form['ultimenu']['skins'] = array(
    '#type' => 'textfield',
    '#title' => t('Path to custom Ultimenu skins library'),
    '#default_value' => ultimenu_get_settings('skins'),
    '#description' => t('The path to Ultimenu skins folder, e.g.: <strong>sites/all/skins/ultimenu</strong> containing CSS files that will be used as options for each Ultimenu block. Please be specific with <strong>ultimenu</strong> directory to limit the scan. Or place skins in your theme default: <strong>@theme_default/css/ultimenu</strong> for auto discovery.',
    array(
      '@theme_default' => drupal_get_path('theme', variable_get('theme_default', 'bartik')),
    )),
    '#element_validate' => array('ultimenu_element_validate_skins'),
  );

  if (!empty($regions)) {
    $regions_enabled = ultimenu_regions_enabled();
    foreach ($regions_enabled as $key => $region) {
      $copies[] = "regions[$key] = $region";
    }
    $copies = implode("\n", $copies);
    $form['ultimenu']['markups'] = array(
      '#type' => 'item',
      '#markup' => '<textarea class="getfocus" spellcheck="false">' . $copies . '</textarea>' . t("<ol><li>Optionally copy the provided regions to your <strong>@theme_default.info</strong> to permanently store Ultimenu regions.</li><li>If a menu item is deleted or disabled, the related Ultimenu region is deleted.</li><li>Don't forget to clear cache whenever you update <strong>@theme_default</strong> file.</li><li>If you disable a region here, but stored in <strong> @theme_default</strong>, you can force remove <strong>@theme_default </strong> regions by checking <strong>Force remove Ultimenu region stored in @theme_default</strong> above. Otherwise <strong> @theme_default</strong> always wins ignoring the above settings.</li></ol>",
        array(
          '@theme_default' => variable_get('theme_default', 'bartik'),
        )),
    );
  }

  $form['#submit'][] = 'ultimenu_admin_settings_form_submit';

  return system_settings_form($form);
}

/**
 * Validate skins directory.
 */
function ultimenu_element_validate_skins($element, &$form_state, $form) {
  if (!empty($element['#value']) && !is_dir($element['#value'])) {
    form_set_error($element['#name'], t('<strong>@skins</strong> do not exists. Please create the directory first.', array('@skins' => $element['#value'])));
  }
}

/**
 * Submit handler for ultimenu_admin_settings().
 */
function ultimenu_admin_settings_form_submit($form, &$form_state) {
  // We compact the variables for the sake of simplicity.
  $data = array();
  $data['blocks']  = $form_state['values']['blocks'];
  // @todo move/add to block instance.
  $data['regions'] = $form_state['values']['regions'];
  $data['goodies'] = $form_state['values']['goodies'];
  $data['skins']   = $form_state['values']['skins'];

  $old_data = variable_get('ultimenu_settings', array());

  // Do not litter global $conf.
  foreach ($data['regions'] as $key => $value) {
    if (empty($value)) {
      unset($data['regions'][$key]);
    }
  }
  foreach ($data['blocks'] as $key => $value) {
    if (empty($value)) {
      unset($data['blocks'][$key]);
    }
  }

  variable_set('ultimenu_settings', array_merge($old_data, $data));

  // Delete variables since we merged them already.
  unset($form_state['values']['blocks'], $form_state['values']['regions'], $form_state['values']['goodies']);

  drupal_static_reset('ultimenu_regions');
  drupal_static_reset('ultimenu_regions_enabled');

  // Rebuild theme registry to register new regions.
  module_invoke('system', 'theme_data');
  drupal_theme_rebuild();
  cache_clear_all();

  // Warn to clear cache if anything fails.
  drupal_set_message(t('Please make sure to clear cache if trouble to see the updated regions at block admin.'));
}

/**
 * Off loaded hooks.
 */
/**
 * Implements hook_theme().
 */
function _ultimenu_theme($existing, $type, $theme, $path) {
  return array(
    'ultimenu' => array(
      'render element' => 'element',
      'pattern' => 'ultimenu__',
      'template' => 'ultimenu',
      'path' => $path . '/templates',
    ),
    'ultimenu_link' => array(
      'render element' => 'element',
      'pattern' => 'ultimenu_link__',
    ),
    'ultimenu_region' => array(
      'render element' => 'element',
    ),
  );
}

/**
 * Implements hook_block_info().
 */
function _ultimenu_block_info() {
  $blocks = array();
  $block_items = ultimenu_get_blocks();

  foreach ($block_items as $delta => $info) {
    $blocks[$delta] = array(
      'info' => t('Ultimenu: @title', array('@title' => $info)),
      'cache' => DRUPAL_CACHE_PER_PAGE,
      'status' => 0,
      'region' => 'none',
    );
  }

  return $blocks;
}

/**
 * Implements hook_block_configure().
 */
function _ultimenu_block_configure($delta = '') {
  $form = array();

  if (user_access('administer ultimenu')) {
    $form['ultimenu_settings'] = array(
      '#type' => 'fieldset',
      '#title' => t('Block settings'),
    );

    $safe_delta = ultimenu_truncate_menu_property($delta);
    // TRUE to keep original skin array without being converted to full URL.
    // @see ultimenu_get_skins()
    $config = ultimenu_get_config($delta, TRUE);
    $skin = $config['skin'];
    $orientation = $config['orientation'];

    $form['ultimenu_settings']['skin_' . $safe_delta] = array(
      '#type' => 'select',
      '#title' => t('Ultimenu skin'),
      '#default_value' => !empty($skin) ? $skin : 'module|ultimenu-basic',
      '#options' => ultimenu_get_skins(),
      '#empty_option' => t('- None -'),
      '#description' => t('Choose the skin for this block. You can supply custom skins at <a href="@skin_path">Ultimenu settings</a>. The skin can be made specific to this block using the proper class by menu name as used by the each label.', array('@skin_path' => url('admin/structure/ultimenu'))),
    );

    $form['ultimenu_settings']['orientation_' . $safe_delta] = array(
      '#type' => 'select',
      '#title' => t('Flyout orientation'),
      '#default_value' => !empty($orientation) ? $orientation : 'ultimenu-basic',
      '#options' => array(
        'ultimenu-htb' => t('Horizontal to bottom'),
        'ultimenu-htt' => t('Horizontal to top'),
        'ultimenu-vtl' => t('Vertical to left'),
        'ultimenu-vtr' => t('Vertical to right'),
      ),
      '#description' => t('Choose the orientation of the flyout, depending on the placement. At sidebar left, <strong>Vertical to right</strong>. At header, <strong>Horizontal to bottom</strong>. At footer, <strong>Horizontal to top</strong>'),
    );
  }

  return $form;
}

/**
 * Implements hook_block_save().
 */
function _ultimenu_block_save($delta = '', $edit = array()) {
  $data = array();
  $safe_delta = ultimenu_truncate_menu_property($delta);

  if (ultimenu_blocks_enabled($delta)) {
    $menu_name = str_replace(array("-", "'"), "_", $delta);
    $data[$menu_name] = $edit['orientation_' . $safe_delta] . ':' . $edit['skin_' . $safe_delta];
  }

  $new_data = array_merge(variable_get('ultimenu_settings', array()), $data);

  variable_set('ultimenu_settings', $new_data);
}


/**
 * Retrieves stored CSS files for Ultimenu skins.
 *
 * @param bool $refresh
 *   If TRUE, reload the CSS and flush the cached version.
 *
 * @return array
 *   An array of available CSS files.
 */
function ultimenu_get_skins($refresh = FALSE) {
  $skins = &drupal_static(__FUNCTION__);

  if (!isset($skins) || $refresh) {
    // @todo: Drop useless cache.
    if (!$refresh && $cache = cache_get('ultimenu:skin')) {
      $skins = $cache->data;
    }
    else {
      $theme_skin  = drupal_get_path('theme', variable_get('theme_default', 'bartik')) . '/css/ultimenu';
      $custom_skin = ultimenu_get_settings('skins');
      $module_skin = drupal_get_path('module', 'ultimenu') . '/skins';
      $mask        = '/.css$/';

      $files = array();
      if (is_dir($module_skin)) {
        foreach (file_scan_directory($module_skin, $mask) as $filename => $file) {
          $files[$filename] = $file;
        }
      }
      if (!empty($custom_skin) && is_dir($custom_skin)) {
        foreach (file_scan_directory($custom_skin, $mask) as $filename => $file) {
          $files[$filename] = $file;
        }
      }
      if (is_dir($theme_skin)) {
        foreach (file_scan_directory($theme_skin, $mask) as $filename => $file) {
          $files[$filename] = $file;
        }
      }
      if ($files) {
        $skins = array();
        foreach ($files as $file) {
          $uri = $file->uri;
          // Simplify lengthy deep directory structure.
          if (strpos($uri, $module_skin) !== FALSE) {
            $uri = str_replace($module_skin . '/', "module|", $uri);
          }
          elseif (strpos($uri, $custom_skin) !== FALSE) {
            $uri = str_replace($custom_skin . '/', "custom|", $uri);
          }
          elseif (strpos($uri, $theme_skin) !== FALSE) {
            $uri = str_replace($theme_skin . '/', "theme|", $uri);
          }

          // Convert file name to CSS friendly for option label and styling.
          $skins[$uri] = drupal_html_class($file->name);
        }
        cache_set('ultimenu:skin', $skins, 'cache');
      }
    }
  }
  return $skins;
}
