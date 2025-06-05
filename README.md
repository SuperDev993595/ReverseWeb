# ReverseWeb

## Project Overview

ReverseWeb is a Node.js project that demonstrates web scraping, authentication, and data extraction from a remote API. It fetches a list of users and current user information, then saves the results to a local JSON file.

## Project Structure

```
ReverseWeb/
├── src/
│   └── index.js
├── users.json
├── package.json
├── .gitignore
└── README.md
```

## Project Creation

1. **Initialize the project:**
   ```sh
   npm init -y
   ```
2. **Install dependencies:**
   ```sh
   npm install axios axios-cookiejar-support tough-cookie dotenv cheerio
   ```
3. **Create the main script:**  
   Implement your logic in `src/index.js`.

4. **Add a start script:**  
   In your `package.json`, add:
   ```json
   "scripts": {
     "start": "node src/index.js"
   }
   ```

## Usage

1. **(Optional) Configure environment variables:**  
   If needed, create a `.env` file in the root directory.

2. **Run the project:**
   ```sh
   npm start
   ```
   This will execute `src/index.js`, perform authentication, fetch user data, and save it to `users.json`.

## Deployment

To deploy or run this project on another machine or server:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/SuperDev993595/ReverseWeb.git
   cd ReverseWeb
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the application:**
   ```sh
   npm start
   ```

## Output

- The output file `users.json` will contain the fetched users and current user information.

## GitHub Repository

- https://github.com/SuperDev993595/ReverseWeb

## Loom Video

- [Project Walkthrough Video](https://www.loom.com/share/dafe8d6017754611a3c8a2df5173985c?sid=78af5a3b-0b1d-4bf5-b9cf-7692139b7803)

## Total Development Time

- 3 hours

## License

This project is licensed under the ISC License.