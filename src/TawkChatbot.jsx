import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tawk.to Chatbot Component
 * 
 * A React component that manages Tawk.to chatbot visibility based on routes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.propertyId - Tawk.to property ID (e.g., '69401d325921b4197ee500f1')
 * @param {string} props.widgetId - Tawk.to widget ID (e.g., '1jch7cecr')
 * @param {Array<string>} props.hideOnRoutes - Array of route patterns where chatbot should be hidden (default: ['/customer'])
 * @param {boolean} props.enableErrorHandling - Enable error handling for Tawk.to (default: true)
 * @param {boolean} props.enableTitleProtection - Prevent Tawk.to from changing page title (default: true)
 * @param {Function} props.onLoad - Callback when Tawk.to script loads
 * @param {Function} props.onError - Callback when Tawk.to script fails to load
 */
const TawkChatbot = ({
  propertyId,
  widgetId,
  hideOnRoutes = ['/customer'],
  enableErrorHandling = true,
  enableTitleProtection = true,
  onLoad,
  onError
}) => {
  const location = useLocation();

  useEffect(() => {
    // Check if current route should hide chatbot
    const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

    // Function to check if Tawk.to is loaded
    const isTawkLoaded = () => {
      return typeof window.Tawk_API !== 'undefined' && window.Tawk_API;
    };

    // Function to hide chatbot
    const hideChatbot = () => {
      if (isTawkLoaded()) {
        try {
          if (window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
          }
          if (window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
              'hideOnMobile': true,
              'hideOnDesktop': true
            });
          }
          if (enableTitleProtection && window.Tawk_API.onStatusChange) {
            window.Tawk_API.onStatusChange = function(status) {
              return false;
            };
          }
        } catch (error) {
          console.warn('TawkChatbot: Error hiding widget', error);
        }
      }
    };

    // Function to show chatbot
    const showChatbot = () => {
      if (isTawkLoaded()) {
        try {
          if (window.Tawk_API.showWidget) {
            window.Tawk_API.showWidget();
          }
          if (window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
              'hideOnMobile': false,
              'hideOnDesktop': false
            });
          }
        } catch (error) {
          console.warn('TawkChatbot: Error showing widget', error);
        }
      }
    };

    // Load Tawk.to script if not already loaded
    if (!window.Tawk_API || !window.Tawk_LoadStart) {
      // Set up error handling before loading script
      if (enableErrorHandling) {
        setupErrorHandling();
      }

      // Initialize Tawk.to
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onload = () => {
        if (onLoad) onLoad();
        // Wait a bit for Tawk.to to initialize, then show/hide
        setTimeout(() => {
          if (shouldHide) {
            hideChatbot();
          } else {
            showChatbot();
          }
        }, 500);
      };

      script.onerror = () => {
        console.warn('TawkChatbot: Failed to load Tawk.to script');
        if (onError) onError(new Error('Failed to load Tawk.to script'));
      };

      document.head.appendChild(script);
    } else {
      // Script already loaded, just show/hide based on route
      setTimeout(() => {
        if (shouldHide) {
          hideChatbot();
        } else {
          showChatbot();
        }
      }, 100);
    }

    // Monitor title changes if title protection is enabled
    let titleCheckInterval;
    if (enableTitleProtection && shouldHide) {
      const originalTitle = document.title;
      titleCheckInterval = setInterval(() => {
        if (document.title !== originalTitle) {
          if (document.title.includes('new message') || document.title.match(/\(\d+\)/)) {
            document.title = originalTitle;
          }
        }
      }, 500);
    }

    return () => {
      if (titleCheckInterval) {
        clearInterval(titleCheckInterval);
      }
    };
  }, [location.pathname, propertyId, widgetId, hideOnRoutes, enableErrorHandling, enableTitleProtection, onLoad, onError]);

  // This component doesn't render anything
  return null;
};

/**
 * Setup error handling for Tawk.to
 */
const setupErrorHandling = () => {
  // Global error handler
  const originalErrorHandler = window.onerror;
  window.onerror = function(msg, url, line, col, error) {
    if (msg && (msg.includes('Tawk') || msg.includes('i18next') || 
        msg.includes('$_Tawk') || msg.includes('is not a function')) ||
        (url && url.includes('tawk'))) {
      console.warn('TawkChatbot: Tawk.to error caught and prevented:', msg);
      return true;
    }
    if (originalErrorHandler) {
      return originalErrorHandler.apply(this, arguments);
    }
    return false;
  };

  // Error event listener
  window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('Tawk') || e.message.includes('i18next') || 
        e.message.includes('$_Tawk') || e.message.includes('is not a function')) ||
        (e.filename && e.filename.includes('tawk'))) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('TawkChatbot: Tawk.to error caught and prevented:', e.message);
      return true;
    }
  }, true);

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && (e.reason.message && (e.reason.message.includes('Tawk') || 
        e.reason.message.includes('i18next') || e.reason.message.includes('$_Tawk')) ||
        (e.reason.stack && e.reason.stack.includes('tawk')))) {
      e.preventDefault();
      console.warn('TawkChatbot: Tawk.to promise rejection caught and prevented');
      return true;
    }
  });

  // Protect Tawk_API with Proxy
  if (typeof window.Tawk_API === 'undefined') {
    window.Tawk_API = {};
  }

  const originalTawkAPI = window.Tawk_API;
  window.Tawk_API = new Proxy(originalTawkAPI, {
    get: function(target, prop) {
      try {
        return target[prop];
      } catch(e) {
        if (e.message && (e.message.includes('i18next') || e.message.includes('$_Tawk'))) {
          console.warn('TawkChatbot: Tawk.to API error prevented:', prop);
          return function() {};
        }
        throw e;
      }
    }
  });
};

export default TawkChatbot;
