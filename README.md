# Verified Account Counter

A Chrome extension for monitoring and analyzing X (formerly Twitter) follower data. This tool provides comprehensive insights into follower counts and verification status.

## Features

- Detailed follower analysis, including total and verified account counts.
- Visual identification of verified profiles with distinctive highlighting.
- Sequential numbering of the follower list for efficient reference.
- Real-time status updates during the analysis process.
- Optimized content loading through smooth scrolling implementation.
- Highlighting of non-verified users who do not follow back.

## Installation and Usage

1. **Extension Installation:**
   - Clone the extension files from the official GitHub repository:
   ```bash
   git clone https://github.com/developer-subhajit/X-Verified-Account-Counter.git
   ```
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top-right corner.
   - Click "Load unpacked" and select the directory containing the extension files.

2. **Accessing Your X Follower Data:**
   - Log in to your X account at [https://x.com](https://x.com).
   - Navigate to your own profile page.
   - Click on your "Followers" count to access your followers page.

3. **Initiating the Analysis:**
   - Ensure you are on your own followers page.
   - Locate the Verified Account Counter interface on the right side of the screen.
   - Click "Start Count" to begin the analysis.
   - The extension will automatically process your follower list.

4. **Monitoring Progress:**
   - Observe real-time status updates in the Verified Account Counter interface.
   - Allow the counting process to complete for accurate results.

5. **Reviewing Analysis Results:**
   - Upon completion, the extension will display comprehensive follower statistics.
   - Examine the follower list to view highlighted verified profiles and sequential numbering.
   - Non-verified users who do not follow you back will be visually highlighted.

## Technical Specifications

- **Manifest Version**: 3
- **Languages Used**: JavaScript for efficient DOM manipulation and data processing.
- **Content Scripts**: Utilizes content scripts for seamless integration with X's user interface.
- **UI Management**: Features a user-friendly interface for progress monitoring and result display, managed by `uiManager.js`.
- **Counting Logic**: Implements counting logic in `counter.js` to analyze follower data.
- **Background Processing**: Uses `background.js` to handle button highlighting and user interaction.

For detailed implementation information, please refer to the `manifest.json`, `counter.js`, `uiManager.js`, and `background.js` files in the source code.

