<?php
/**
 * The main template file.
 *
 * @package WordPress
 * @subpackage bcnvisualsound10a
 * @version 1.0
 */
?>
<?php get_header(); ?>
<!-- inici barra ajuntament -->
<div class="barra"> <?php // @ToDo: falla el onFocus en el logo y en idioma ?>
	<div id="brand" class="v2012 collapsed">
			<div class="brand-wrapper">
				<div class="main" style="background-position: -268px 0px; ">
					<div class="logotype"> <a href="<?php echo site_url(); ?>"><img src="<?php echo get_template_directory_uri(); ?>/images/brand/banner/2012/logo-ajment.png" alt="Logotip de l'Ajuntament de Barcelona. Enllaç a la pàgina principal del web de Barcelona" height="43" width="130" /></a> </div>
					<div class="navigation">
						<ul class="languages">
							<?php
					if('ca' == get_bloginfo( 'language' )) :
            		?>
							<li class="active"> <span>CAT</span> </li>
							<li class="last"> <a href="<?php bloginfo( 'wpurl' ); ?>/es/" title="Castellano" hreflang="es" lang="es" xml:lang="es">CAS</a> </li>
							<?php else: ?>
							<li> <a href="http://barcelonavisualsound.org/10a/" title="Català" hreflang="ca" lang="ca" xml:lang="ca">CAT</a> </li>
							<li class="active last"> <span>CAS</span> </li>
							<?php endif; ?>
						</ul>
					</div>
				</div>
			</div>
		</div>
</div>
	<!-- fi barra ajuntament -->
<div class="container"> <!-- inici contenidor -->
	
	<div id="navegacio">
		<div>
		<!-- inici menu -->
		<?php wp_nav_menu( array( 	'theme_location' => 'menu-principal', 
									'items_wrap' => '<ul id="menu-principal">%3$s</ul>',
									'before'          => '<span>',  
   									'after'           => '</span>',  
									'container' => '' 
								) 
						); 
		?>
		</div>
	</div>
	<!-- fi capsal  --> 
	<br class="clearfloat" />
	<!-- inici capsal --> 
	<div id="cap"> 
		<div>
			<a href="#"> <img src="<?php echo get_template_directory_uri(); ?>/images/cap/0<?php echo rand(1, 5); ?>.jpg" alt="Barcelona Visual Sound. Festival Audiovisual de Creació Jove. 10a edició" /> </a> 
		</div>	
	</div>
	<!-- fi capsal  -->
	
	<br class="clearfloat" />
	
	<div id="destacat1"> <!-- inici destacat 1 -->
		<div class="box1">
		<?php dynamic_sidebar( 'destacat-esquerra' ); ?>
		</div>
	</div>
	<!-- fi destacat 1 -->
	
	<div id="destacat2"><!-- inici destacat 2 -->
		<div class="box2">
		<?php dynamic_sidebar( 'destacat-dreta' ); ?>
		</div>
	</div>
	<!-- fi destacat 2 --> 
	
	<br class="clearfloat separador" />
	<div class="sidebar1"> <!-- inici barra lateral --> 
		<div class="box3">
		<!-- inici widgets -->
		<?php dynamic_sidebar( 'barra-lateral' ); ?>
		<!-- fi widgets --> 
		
		<!-- inici menú principal -->
		<h2>Menú Principal</h2>
		<?php wp_nav_menu( array( 	'theme_location' => 'menu-lateral', 
									'items_wrap' => '<ul id="menu-lateral">%3$s</ul>',
									'container' => '' 
								) 
						); 
		?>
		<!-- fi menú principal --> 
		</div>
	</div>
	<!-- fi barra lateral -->
	
	<div id="content"> <!-- inici contingut -->
		<div>
		<?php include_once('loop/loop.php') ?>
		</div>
	</div>
	<!-- end content --> 
	
	<br class="clearfloat" />
	<?php get_footer(); ?>
<!-- fi contenidor --> 

