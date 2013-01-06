<?php
add_action( 'widgets_init', 'my_register_sidebars' );
add_action( 'init', 'register_my_menus' );

function my_register_sidebars() {

    register_sidebar( array(
		'name'			=> 'Destacat-esquerra',
		'id' 			=> 'destacat-esquerra',
		'description' 	=> 'Destacat esquerra',
        'before_widget' => '',
        'after_widget' 	=> '',
        'before_title'	=> '<h2>',
        'after_title'	=> '</h2>',
    ));
	
	register_sidebar( array(
		'name'			=> 'Destacat-dreta',
		'id' 			=> 'destacat-dreta',
		'description' 	=> 'Destacat dreta',
        'before_widget' => '',
        'after_widget' 	=> '',
        'before_title'	=> '<h2>',
        'after_title'	=> '</h2>',
    ));
	
	register_sidebar( array(
		'name'			=> 'barra-lateral',
		'id' 			=> 'barra-lateral',
		'description' 	=> 'barra-lateral',
        'before_widget' => '<div class="widget">',
        'after_widget' 	=> '</div>',
        'before_title'	=> '<h2>',
        'after_title'	=> '</h2>',
    ));
}

function register_my_menus() {
  register_nav_menus(
    array( 	'menu-lateral' => __( 'Menú lateral' ),
			'menu-principal' => __( 'Menú horitzontal' )
	 )
  );
}

//add_theme_support( 'post-thumbnails' );


?>