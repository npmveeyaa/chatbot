# @veeyaainnovatives/chatbot

A reusable chatbot component for React applications supporting multiple providers (Tawk.to and custom Veeyaa chatbot) with route-based visibility and error handling.

## Installation

```bash
npm install @veeyaainnovatives/chatbot
```

## Usage

### Tawk.to Chatbot

```jsx
import { Chatbot } from '@veeyaainnovatives/chatbot';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Chatbot 
        provider="tawk"
        tawkPropertyId="69401d325921b4197ee500f1"
        tawkWidgetId="1jch7cecr"
      />
      {/* Your app content */}
    </BrowserRouter>
  );
}
```

### Veeyaa Custom Chatbot

```jsx
import { Chatbot } from '@veeyaainnovatives/chatbot';
import '@veeyaainnovatives/chatbot/styles.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Chatbot 
        provider="veeyaa"
        position="bottom-right"
        primaryColor="#677a58"
        backgroundColor="#ffffff"
        apiUrl="https://api.example.com/chat"
        onMessage={(message) => console.log('Message sent:', message)}
      />
      {/* Your app content */}
    </BrowserRouter>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `'tawk' \| 'veeyaa'` | `'tawk'` | Chatbot provider to use |
| `tawkPropertyId` | `string` | **required if provider='tawk'** | Tawk.to property ID |
| `tawkWidgetId` | `string` | **required if provider='tawk'** | Tawk.to widget ID |
| `hideOnRoutes` | `string[]` | `['/customer']` | Routes where chatbot should be hidden |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Chatbot position (Veeyaa only) |
| `primaryColor` | `string` | `'#677a58'` | Primary color for Veeyaa chatbot |
| `backgroundColor` | `string` | `'#ffffff'` | Background color for Veeyaa chatbot |
| `apiUrl` | `string` | `undefined` | API URL for Veeyaa chatbot messages |
| `onMessage` | `function` | `undefined` | Callback when a message is sent (Veeyaa) |
| `enableErrorHandling` | `boolean` | `true` | Enable error handling for Tawk.to |
| `enableTitleProtection` | `boolean` | `true` | Prevent Tawk.to from changing page title |
| `onLoad` | `function` | `undefined` | Callback when Tawk.to script loads |
| `onError` | `function` | `undefined` | Callback when Tawk.to script fails to load |

## Features

### Tawk.to Provider
- ✅ Automatic script loading
- ✅ Route-based visibility
- ✅ Error handling for Tawk.to errors
- ✅ Title protection (prevents Tawk.to from changing page title)
- ✅ Show/hide widget programmatically
- ✅ React Router integration

### Veeyaa Provider
- ✅ Custom chatbot UI
- ✅ Message history
- ✅ Typing indicators
- ✅ Customizable colors and position
- ✅ Route-based visibility
- ✅ Ready for API integration (API integration to be added)

## Requirements

- React 16.8+ or 17+ or 18+
- React Router DOM 5+ or 6+

## License

MIT
