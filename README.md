# Linear CLI Tool (lc)

lc (Linear Create and Open) is a command-line interface tool that simplifies the process of creating Linear issues and generating corresponding branch names. It integrates with the Linear API to create issues and provides options for opening the issue in the browser or copying a generated branch name to the clipboard.

## Features

- Create Linear issues from the command line
- Generate branch names based on the created issue
- Open the created issue in the default web browser
- Copy the generated branch name to the clipboard
- Specify team stub for issue creation
- Environment variable support for API key and default settings

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/lc.git
   cd lc
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add the following environment variables:
   ```
   LINEAR_API_KEY=your_linear_api_key
   USER_ID=your_linear_user_id
   DEFAULT_TEAM_STUB=default_team_stub
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Make the CLI tool globally accessible:
   ```
   npm link
   ```

## Usage

lc <ticketName> [options]


### Options

- `-t, --teamstub <stub>`: Specify the team stub (e.g., bknd, frtd). Defaults to the value in DEFAULT_TEAM_STUB.
- `-o, --open`: Open the created issue in Linear using the default web browser.
- `--help`: Show help information.

### Examples

1. Create an issue and copy the branch name to clipboard:
   ```
   lc "Implement user authentication"
   ```

2. Create an issue for a specific team and open it in the browser:
   ```
   lc "Fix pagination bug" -t bknd -o
   ```

3. Show help information:
   ```
   lc --help
   ```

## Contributing

Contributions are welcme! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.