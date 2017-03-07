<?php

use SilverStripe\CMS\Model\SiteTree;

/**
 * An extension of the site tree class for a page.
 */
class Page extends SiteTree
{
    /**
     * Human-readable singular name.
     *
     * @var string
     * @config
     */
    private static $singular_name = 'Page';
    
    /**
     * Human-readable plural name.
     *
     * @var string
     * @config
     */
    private static $plural_name = 'Pages';
    
    /**
     * Description of this object.
     *
     * @var string
     * @config
     */
    private static $description = 'Generic content page';
}
