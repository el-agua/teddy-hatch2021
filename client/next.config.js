module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.demo.federico.codes/:path*", // Matched parameters can be used in the destination
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
