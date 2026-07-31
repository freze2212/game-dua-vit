module.exports = {
  apps: [
    {
      name: "game-dua-vit",
      script: "preview-server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 6033
      }
    }
  ]
};
