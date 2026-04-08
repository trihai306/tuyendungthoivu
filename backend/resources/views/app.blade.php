<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>NVTV Tuyển Dụng - Hệ thống quản lý tuyển dụng</title>
    @viteReactRefresh
    @vite('resources/js/app/main.tsx')
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
