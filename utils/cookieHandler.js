// utils/cookieHandler.js

// Function to generate and set the JWT in an HTTP-Only cookie
export const createHttpOnlyCookie = (res, token) => {
    // Determine if the environment is production
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        // Prevent client-side JavaScript from accessing the cookie
        httpOnly: true,

        // Only send cookie over HTTPS in production
        secure: isProduction,

        // Allow cookie to be sent between Vercel and Render
        sameSite: isProduction ? "none" : "lax",

        // Cookie expiry (30 days)
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};