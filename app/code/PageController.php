<?php

use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Control\Director;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\View\Requirements;

/**
 * An extension of the content controller class for a page controller.
 */
class PageController extends ContentController
{
    /**
     * Configuration for the webpack development server.
     *
     * @var array
     * @config
     */
    private static $dev_server = [
        
    ];
    
    /**
     * Specifies whether to load themed CSS.
     *
     * @var boolean
     * @config
     */
    private static $load_themed_css = true;
    
    /**
     * Specifies whether to load themed JavaScript.
     *
     * @var boolean
     * @config
     */
    private static $load_themed_javascript = true;
    
    /**
     * Defines the URL routes handled by this controller.
     *
     * @var array
     * @config
     */
    private static $url_handlers = [
        
    ];
    
    /**
     * Defines the actions permitted for this controller.
     *
     * @var array
     * @config
     */
    private static $allowed_actions = [
        
    ];
    
    /**
     * Is there a development server currently active?
     *
     * @var boolean
     */
    protected $devServerActive = false;
    
    /**
     * Has the development server connection been tested?
     *
     * @var boolean
     */
    protected $devServerTested = false;
    
    /**
     * Answers true if a webpack development server is currently being used.
     *
     * @return boolean
     */
    public function isDevServerActive()
    {
        // Using Development Environment?
        
        if (!Director::isDev()) {
            return false;
        }
        
        // Already Checked Server?
        
        if ($this->devServerTested) {
            return $this->devServerActive;
        }
        
        // Test Server Connection:
        
        return $this->testDevServer();
    }
    
    /**
     * Answers the URL for the webpack development server.
     *
     * @param string $path Path to append to the URL.
     *
     * @return string
     */
    public function getDevServerURL($path = null)
    {
        // Using Development Environment?
        
        if (!Director::isDev()) {
            return;
        }
        
        // Obtain Development Server Config:
        
        if ($config = $this->getDevServerConfig()) {
            
            if (isset($config['host']) && isset($config['port'])) {
                
                // Define Protocol:
                
                $protocol = (isset($config['https']) && $config['https']) ? 'https' : 'http';
                
                // Answer URL String:
                
                return sprintf(
                    '%s://%s:%d/%s',
                    $protocol,
                    $config['host'],
                    $config['port'],
                    $path
                );
                
            }
            
        }
    }
    
    /**
     * Answers the development server configuration array.
     *
     * @return array
     */
    public function getDevServerConfig()
    {
        return $this->config()->dev_server;
    }
    
    /**
     * Tests whether a connection can be established to the configured development server.
     *
     * @return boolean
     */
    protected function testDevServer()
    {
        if ($config = $this->getDevServerConfig()) {
            
            if (isset($config['host']) && isset($config['port'])) {
                
                // Define Timeout:
                
                $timeout = isset($config['timeout']) ? $config['timeout'] : 10;
                
                // Attempt to Open Connection:
                
                $socket = @fsockopen(
                    $config['host'],
                    $config['port'],
                    $errno,
                    $error,
                    $timeout
                );
                
                // Update Status Attributes:
                
                $this->devServerActive = (!$socket ? false : true);
                $this->devServerTested = true;
                
            }
            
        }
        
        return $this->devServerActive;
    }
    
    /**
     * Performs initialisation before any action is called on the receiver.
     *
     * @return void
     */
    protected function init()
    {
        // Call Parent Method:
        
        parent::init();
        
        // Attempt Initialisation:
        
        try {
            
            // Load Requirements:
            
            $this->initRequirements();
            
        } catch (InvalidArgumentException $e) {
            
            // Log Exception:
            
            Injector::inst()->get('Logger')->debug(
                sprintf(
                    'Controller initialisation failed, invalid argument: %s',
                    $e->getMessage()
                )
            );
            
        }
    }
    
    /**
     * Initialises the requirements for the extended controller.
     *
     * @return void
     */
    protected function initRequirements()
    {
        // Themed CSS Enabled?
        
        if ($this->config()->load_themed_css) {
            
            // Load Themed CSS:
            
            foreach ($this->config()->themed_css as $name) {
                $this->loadThemedCSS($name);
            }
            
        }
        
        // Themed JavaScript Enabled?
        
        if ($this->config()->load_themed_javascript) {
            
            // Load Themed JavaScript:
            
            foreach ($this->config()->themed_javascript as $name) {
                $this->loadThemedJS($name);
            }
            
        }
    }
    
    /**
     * Loads the themed JavaScript with the given name.
     *
     * @param string $name Name of themed JavaScript file.
     *
     * @return void
     */
    protected function loadThemedJS($name)
    {
        if ($this->isDevServerActive()) {
            Requirements::javascript($this->getDevServerURL($this->ext($name, 'js')));
        } else {
            Requirements::themedJavascript($name);
        }
    }
    
    /**
     * Loads the themed CSS with the given name.
     *
     * @param string $name Name of themed CSS file.
     *
     * @return void
     */
    protected function loadThemedCSS($name)
    {
        if ($this->isDevServerActive()) {
            Requirements::css($this->getDevServerURL($this->ext($name, 'css')));
        } else {
            Requirements::themedCSS($name);
        }
    }
    
    /**
     * Applies the given extension to the given file name if it is not already present.
     *
     * @param string $name Filename to process.
     * @param string $ext Required file extension.
     *
     * @return string
     */
    protected function ext($name, $ext)
    {
        // Obtain Info:
        
        $info = pathinfo($name);
        
        // Check Extension:
        
        if (!isset($info['extension']) || $info['extension'] !== $ext) {
            $name = sprintf('%s.%s', $name, $ext);
        }
        
        // Answer Name:
        
        return $name;
    }
}
