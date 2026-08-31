# 🍕 PizzaPoint

**Drop a pin. Get your pizza.**

PizzaPoint is a full-stack pizza ordering platform where customers build their own pizza — base, sauce, cheese, and veggies — and track it live from kitchen to their doorstep.

**Live Site:** [pizzapoint-wheat.vercel.app](https://pizzapoint-wheat.vercel.app/)
**Repository:** [github.com/md-moynul/pizzapoint](https://github.com/md-moynul/pizzapoint)

---

## ✨ Features

- **Build Your Own Pizza** — pick base, sauce, cheese, and veggies for a fully custom pizza
- **Menu Browsing** — filter pizzas by category: Veg, Non-Veg, and Special
- **Live Order Tracking** — track orders in real time from *Order Received* → *In Kitchen* → *Sent to Delivery*
- **Pin-Based Delivery** — drop a location pin so orders are delivered to the exact spot
- **User Accounts & Auth** — sign in, manage a cart, and view order history from a personal dashboard
- **Secure Payments** — checkout powered by Stripe
- **Inventory Awareness** — ingredient stock is tracked so customization always reflects what's available
- **Responsive, Modern UI** — built with Tailwind CSS v4 and HeroUI components

## 🛠️ Tech Stack

| Layer              | Technology                                                         |
|---------------------|----------------------------------------------------------------------|
| Framework           | [Next.js 16](https://nextjs.org/) (App Router)                     |
| Language            | TypeScript                                                          |
| UI                  | React 19, [HeroUI](https://www.heroui.com/), Tailwind CSS v4, [@gravity-ui/icons](https://gravity-ui.com/) |
| Auth                | [better-auth](https://www.better-auth.com/) + MongoDB adapter       |
| Database            | MongoDB (native driver)                                             |
| Payments            | [Stripe](https://stripe.com/) + Stripe.js                          |
| Charts / Analytics  | [Recharts](https://recharts.org/)                                   |
| Notifications       | react-toastify                                                       |
| Hosting             | [Vercel](https://vercel.com/)                                       |

## 📁 Project Structure

```
pizzapoint/
├── public/            # Static assets (images, icons, etc.)
├── src/               # Application source (routes, components, logic)
├── AGENTS.md          # Notes/config for AI coding agents
├── CLAUDE.md          # Claude-specific project instructions
├── next.config.ts      # Next.js configuration
├── eslint.config.mjs   # Linting rules
├── postcss.config.mjs  # PostCSS / Tailwind config
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18 or later
- A [MongoDB](https://www.mongodb.com/atlas) database
- A [Stripe](https://dashboard.stripe.com/) account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/md-moynul/pizzapoint.git
cd pizzapoint

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Auth (better-auth)
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> Adjust these to match the exact variable names used in the codebase.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build & Run for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## ☁️ Deployment

PizzaPoint is built to deploy seamlessly on **Vercel**:

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repository to Vercel for automatic deployments on every push to `main`.

## 🧭 Key Pages

| Route                          | Description                              |
|---------------------------------|--------------------------------------------|
| `/`                              | Home page — hero, categories, highlights   |
| `/menu`                          | Full menu with category filters            |
| `/menu/[id]`                     | Individual pizza details                    |
| `/dashboard/user/build`         | Build-your-own-pizza tool                   |
| `/dashboard/user/cart`          | Cart / checkout                             |
| `/auth/signin`                   | Sign in                                     |
| `/about`                         | About PizzaPoint                            |
| `/contact`                       | Contact page                                |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project currently has no license specified — add one (e.g. MIT) if you plan to open source it.

## 👤 Author

**Md Moynul**
GitHub: [@md-moynul](https://github.com/md-moynul)

---

<p align="center">Built with Next.js · 🍕 Rangpur, Bangladesh</p>