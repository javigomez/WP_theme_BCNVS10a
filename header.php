<?php 
if ('ca' == get_bloginfo('language'))
{
	$es_catala = true;
	$language_iso_code = "ca";
} 
else
{
	$es_catala = false;
	$language_iso_code = "es";
} 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="<?= $language_iso_code ?>" xml:lang="<?= $language_iso_code ?>">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php bloginfo('name'); ?> <?php wp_title(); ?></title>
<meta http-equiv="Content-Style-Type" content="text/css" />
<meta http-equiv="Content-Language" content="<?= $language_iso_code ?>" />

<meta name="keywords" content="
<?php 
if ($es_catala) 
{
	echo "Barcelona, Ajuntament de Barcelona, ciutat, Festival, Audio, Visual, Jove, Sound
";
}
else
{
	echo "Barcelona, Ayuntamiento de Barcelona, ciudad, Festival, Audio, Visual, Joven, Sound
";
}
?>

<meta name="description" content="<?php bloginfo('description'); ?>" />
<meta name="Author" content="Ajuntament de Barcelona" />

<meta name="Copyright" content="http://www.bcn.cat/catala/copyright/" />
<meta name="rating" content="General" />
<meta name="distributor" content="Global" />
<meta name="robots" content="index,follow" />
<link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
<meta name="DC.title" content="<?php bloginfo('name'); ?>" />
<meta name="DC.identifier" content="<?php bloginfo( 'wpurl' ); ?>" />
<meta name="DC.description" content="<?php bloginfo( 'description' ); ?>" />
<meta name="DC.subject" content="
<?php 
if ($es_catala) 
{
	echo "Barcelona, Ajuntament de Barcelona, ciutat, Festival, Audio, Visual, Jove, Sound
";
}
else
{
	echo "Barcelona, Ayuntamiento de Barcelona, ciudad, Festival, Audio, Visual, Joven, Sound
";
}
?>

" />
<meta name="DC.language" scheme="ISO639-1" content="<?= $language_iso_code ?>" />
<meta name="DC.creator" content="http://w3.bcn.cat/V04/Home/V04HomeLinkPl/0,2687,394566_400116_1,00.html" />
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,800,300,600,700' rel='stylesheet' type='text/css' />
<link id="headers" href="<?php echo get_template_directory_uri(); ?>/images/cap/"/>
<link rel="start" title="Pàgina inicial" href="<?php bloginfo( 'wpurl' ); ?>" />
<link rel="contents" title="Mapa del web" href="http://barcelonavisualsound.org/10a<?php if(!$es_catala) { echo "/es"; } ?>/mapa-web" />
<link rel="copyright" title="Copyright" href="http://www.bcn.cat/catala/copyright/" />
<link rel="help" title="Informació d&#39;accessibilitat" href="http://www.bcn.cat/ca/accessibilitat.shtml" />
<link rel="alternate" type="text/html" title="Versión en castellano" hreflang="es" lang="es" xml:lang="es" href="<?php bloginfo('url'); ?>/es/" /><?php //@TODO: falta enlace a la versión en spanish ?>
<link rel="alternate" type="application/rss+xml" title="Sumari de les notícies en RSS 2.0" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="all" />

<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/css/barra.css" charset="utf-8" />
<!--[if IE 7]><link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/css/barra-ie7.css" charset="utf-8" /><![endif]-->
<!--[if IE 6]><link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/css/barra-ie6.css" charset="utf-8" /><![endif]-->
<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/jquery-ready-home10.js"></script>

<script type="text/javascript" charset="utf-8" src="<?php echo get_template_directory_uri(); ?>/js/core.js"></script>


<link rel="Shortcut Icon" type="image/ico" href="<?php echo get_template_directory_uri(); ?>/favicon.ico" />

</head>
<body>