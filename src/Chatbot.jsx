import TawkChatbot from './TawkChatbot.jsx';
import VeeyaaChatbot from './VeeyaaChatbot.jsx';
import './VeeyaaChatbot.css';

/**
 * Main Chatbot Component
 * 
 * A unified chatbot component that supports multiple providers.
 * 
 * @param {Object} props - Component props
 * @param {string} props.provider - Chatbot provider: 'tawk' | 'veeyaa' (default: 'tawk')
 * @param {string} props.tawkPropertyId - Tawk.to property ID (required if provider is 'tawk')
 * @param {string} props.tawkWidgetId - Tawk.to widget ID (required if provider is 'tawk')
 * @param {Array<string>} props.hideOnRoutes - Routes where chatbot should be hidden (default: ['/customer'])
 * @param {string} props.position - Chatbot position for Veeyaa: 'bottom-right' | 'bottom-left' (default: 'bottom-right')
 * @param {string} props.primaryColor - Primary color for Veeyaa chatbot (default: '#677a58')
 * @param {string} props.backgroundColor - Background color for Veeyaa chatbot (default: '#ffffff')
 * @param {string} props.apiUrl - API URL for Veeyaa chatbot messages
 * @param {Function} props.onMessage - Callback when a message is sent (Veeyaa)
 * @param {boolean} props.enableErrorHandling - Enable error handling for Tawk.to (default: true)
 * @param {boolean} props.enableTitleProtection - Prevent Tawk.to from changing page title (default: true)
 * @param {Function} props.onLoad - Callback when Tawk.to script loads
 * @param {Function} props.onError - Callback when Tawk.to script fails to load
 */
const Chatbot = ({
  provider = 'tawk',
  tawkPropertyId,
  tawkWidgetId,
  hideOnRoutes = ['/customer'],
  position = 'bottom-right',
  primaryColor = '#677a58',
  backgroundColor = '#ffffff',
  apiUrl,
  onMessage,
  enableErrorHandling = true,
  enableTitleProtection = true,
  onLoad,
  onError
}) => {
  if (provider === 'tawk') {
    if (!tawkPropertyId || !tawkWidgetId) {
      console.warn('Chatbot: tawkPropertyId and tawkWidgetId are required when provider is "tawk"');
      return null;
    }

    return (
      <TawkChatbot
        propertyId={tawkPropertyId}
        widgetId={tawkWidgetId}
        hideOnRoutes={hideOnRoutes}
        enableErrorHandling={enableErrorHandling}
        enableTitleProtection={enableTitleProtection}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  if (provider === 'veeyaa') {
    return (
      <VeeyaaChatbot
        hideOnRoutes={hideOnRoutes}
        position={position}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
        apiUrl={apiUrl}
        onMessage={onMessage}
      />
    );
  }

  console.warn(`Chatbot: Unknown provider "${provider}". Supported providers: "tawk", "veeyaa"`);
  return null;
};

export default Chatbot;
