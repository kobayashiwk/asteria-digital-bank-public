# Asteria Digital Bank

Asteria Digital Bank is a self-contained reference web application for local development. It provides account views, transfer workflows, transaction history, and an assistant integration in a single Node.js process.

## Requirements

- Node.js 20 or later
- No external npm packages are required

## Start

```bash
npm start
```

The application listens on `http://127.0.0.1:3000` by default. At startup, a six-digit local access code is printed to the terminal. Use that code on the sign-in screen.

For a fixed code during repeatable local sessions:

```bash
ASTERIA_ACCESS_CODE=246810 npm start
```

On Windows Command Prompt:

```bat
set ASTERIA_ACCESS_CODE=246810
npm start
```

## Reference users

- `yamada` - Taro Yamada
- `sato` - Misaki Sato

## Main workflows

- Account overview and account details
- Recent transaction history
- Instant transfer
- Daily transfer limit display
- Asteria Assistant for balance and registered-payee information

The application binds to the loopback interface by default.
