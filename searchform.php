<div id="search">
	<form method="get" id="searchform" action="<?php echo home_url( '/' ); ?>">
		<p>
			<label for="cerca" style="display: block;">
				<?php _e( 'Search' ) ?>
			</label>
			<?php /* <label class="screen-reader-text" for="search"><?php _e( 'Search' ) ?></label> */ ?>
			<input type="text" value="<?php _e( 'Search' ) ?>..." name="s" id="cerca" />
			<input type="submit" id="envia" value="<?php _e( 'Search' ) ?>" alt="Envia" />
		</p>
	</form>
</div>
