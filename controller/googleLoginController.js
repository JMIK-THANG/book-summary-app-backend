const {OAuth2Client} = require("google-auth-library"); 
const pool = require("../config/db"); 

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.SECRET_ID,
      process.env.DOMAIN,
    );

    const { tokens } = await client.getToken(code);

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const userInfo = await response.json();
    console.log(userInfo);

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      userInfo.email,
    ]);

    if (user.rows.length === 0) {
      const newUser = await pool.query(
        "INSERT INTO users(name, email, role) VALUES($1, $2, $3) RETURNING *",
        [userInfo.name, userInfo.email, "user"],
      );

      res.json({ user: newUser.rows[0] });
    } else {
      res.json({ user: user.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = googleLogin; 