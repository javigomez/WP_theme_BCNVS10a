<?php if (have_posts()) : ?>
		<?php  while (have_posts()) : ?>
		<?php the_post(); ?>
		<h1 id="post-<?php the_ID(); ?>"> <a href="<?php the_permalink() ?>" rel="bookmark" title="Enllaç permanent a <?php the_title(); ?>">
			<?php the_title(); ?>
			</a></h1>
		<div class="article">
			<?php /*
			// check if the post has a Post Thumbnail assigned to it.
			if ( has_post_thumbnail() ) : 
			?>
			<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" >
			<?php the_post_thumbnail('thumbnail'); ?>
			</a>
			<?php endif; */ ?>
			<?php //the_excerpt(); ?>
			<?php the_content(); ?>
		</div>
		<?php endwhile; ?>
		<?php else : ?>
		<h2 class="center">No s'ha trobat articles a mostrar</h2>
<?php endif; ?>