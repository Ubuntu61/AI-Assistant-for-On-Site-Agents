module.exports = {
  apps: [{
    name: 'my-v0-project',
    script: 'npm',
    args: 'run start',
    cwd: '/root/my-product-site/v0-interactive-product-showcase-40',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
}
