# Dev-Snap

A Chrome extension to facilitate web development tasks, allowing you to automate repetitive actions on web pages.

> ⚠️ **Attention**: This extension does **not yet implement data security features**. Avoid storing sensitive information, such as passwords or personal data, in the configurations.

## Features

- **URL Management**: Add and organize development URLs
- **Click Automation**: Configure automatic clicks on specific elements
- **Value Filling**: Automatically fill fields with predefined values
- **Redirection**: Configure automatic redirects to other pages
- **Custom Names**: Define custom names for your URLs and functionalities

## How to Use

### 1. Installation
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

### 2. Adding URLs

#### Custom URL
1. Click the extension icon in the toolbar
2. Enter the desired URL in the input field
3. Click "Adicionar" button

#### Current URL
1. Click the extension icon in the toolbar
2. Click the location button to add the current URL 

### 3. Configuring Functionalities
1. Click the URL that you want to add or edit a functionalitie
2. Choose the functionality type from the dropdown menu:
   - **Click**: Automates clicks on elements
   - **Value**: Fills fields with values
   - **Redirect**: Redirects to other pages
3. Configure the specific parameters for each functionality

> 💡 **Tip:** To easily find the selector for an element you want to automate, open the browser's Developer Tools (Inspect Element), locate the desired element in the DOM, right-click it, and choose "Copy" -> "Copy JS path." This will copy a command like `document.querySelector("your-selector")` just use the selector part inside the quotes for your configuration.

### 4. Detailed Configuration

#### Click
- **Selector**: CSS selector of the element to be clicked
- **Delay**: Wait time (in ms) before executing the click

#### Value
- **Selector**: CSS selector of the field to be filled
- **Value**: Text to be inserted in the field
- **Delay**: Wait time (in ms) before filling

#### Redirect
- **URL**: Destination URL for redirection
- **New Tab**: Whether to open in a new tab or the same one
- **Delay**: Wait time (in ms) before redirecting

## 📝 Saved Configurations

The extension saves configurations in Chrome's synchronized storage:

- `devSnapFaciliterIPs`: List of registered URLs
- `devSnapFaciliterConfigs`: Functionality configurations per URL

---

⭐ If this project helped you, consider giving it a star!