FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:20

# Electron の依存 + OpenGL + dbus
RUN apt-get update && apt-get install -y \
    libgtk-3-0 libx11-xcb1 libnss3 libasound2 libxss1 \
    libatk1.0-0 libxcomposite1 libxcursor1 libxdamage1 libxrandr2 libgbm1 \
    libgl1 libgles2 libegl1 \
    dbus dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

# パッケージマネージャ
RUN npm install -g pnpm
