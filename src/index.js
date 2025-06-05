require("dotenv").config();
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');

const cookieJar = new CookieJar();
const client = wrapper(axios.create({ jar: cookieJar }));

const API_BASE = "https://challenge.sunvoy.com";
const OUTPUT_FILE = path.join(__dirname, "../users.json");

class ScrapUserList {
  constructor() {
    this.isAuthenticated = false;
    this.sessionCookies = null;
  }

  async loading () {
    try {
      console.log("Page loading...");
      const response = await client.get(
        `${API_BASE}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Page loaded successfully.");

      const  data = response.data;
      const pattern = '<input type="hidden" name="nonce" value="';
      const nonce_pos = data.indexOf(pattern);
      if (nonce_pos == -1) {
        console.log("Can not find nonce");
        return false;
      } else {
        const nonce = data.substring(pattern.length + nonce_pos, pattern.length + nonce_pos + 32);
        console.log(`nonce = ${nonce}`);
        return nonce;
      }
    } catch(error) {
      console.log("Page load failed.");
      return false;
    }
  }

  async login() {
    const nonce = await (this.loading());
    if (!nonce) {
      return false;
    }
    try {
      console.log("Attempting login...");    
      
      const _params = new URLSearchParams();
      _params.append('nonce', nonce);
      _params.append('username', 'demo@example.org');
      _params.append('password', 'test');

      console.log(`${API_BASE}/login`);
      
      const apiUrl = this.constructApiUrl(`login`, {});
      console.log(apiUrl);
      var response = await client.post(apiUrl, _params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      //console.log("Login successful");
      this.isAuthenticated = true;
      console.log(response.status);
      return true;
      //}
      //throw new Error('Login failed - invalid response');
    } catch (error) {
      console.error("Login failed:", error.message);
      return false;
    }
  }

  async getUsers() {
    if (!this.isAuthenticated) 
      if (!await this.login())
        return;

    try {
      console.log("Fetching users...");
      const response = await client.post(
        `${API_BASE}/api/users`,
        {},
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
      return [];
    }
  }

  async getCurrentUser() {
    if (!this.isAuthenticated) await this.login();

    try {
      console.log("Fetching current user...");
      const response = await client.get(
        `${API_BASE}/settings/tokens`,
        {},
      );
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error.message);
      return null;
    }
  }

  async run() {
    try {
      await this.login();
      const users = await this.getUsers();
      const currentUser_html = await this.getCurrentUser();
      const $ = cheerio.load(currentUser_html);
      const currentUser = {};

      $('input[type="hidden"]').each((_, el) => {
        const key = $(el).attr('id') || $(el).attr('name');
        currentUser[key] = $(el).attr('value');
      });

      const output = {
        users,
        currentUser,
        timestamp: new Date().toISOString(),
      };

      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
      console.log(`Data successfully saved to ${OUTPUT_FILE}`);
    } catch (error) {
      console.error("Runtime error:", error.message);
      process.exit(1);
    }
  }
  constructApiUrl(endpoint, params) {
    const url = new URL(`${API_BASE}/${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url.toString();
  }
}

new ScrapUserList().run();
