# IntelliMart

IntelliMart is a modern, high-performance, front-end-only e-commerce platform and analytics workstation. It delivers two integrated environments: a customer-facing **Storefront View** and an analytics workstation called the **DWM Center**. Everything runs 100% locally in the browser with deterministic data generation, requiring zero backend servers, zero databases, and zero external API keys.

---

## Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Launch

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Launch the local development workstation
npm run dev
```

Open `http://localhost:5173/` in your browser to access the application.

---

## Project Structure

```
intellimart/
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
└─ src/
   ├─ main.jsx                       # Application entry point
   ├─ App.jsx                        # Master layout controller (Storefront & DWM Center views)
   ├─ index.css                      # Global styles, Tailwind utilities, and theme tokens
   ├─ context/
   │  └─ AppContext.jsx              # Unified reactive application state & cart storage
   ├─ data/
   │  ├─ generateDataset.js          # Deterministic seeded generator (1,465 authentic items)
   │  ├─ categories.js               # Commercial department schema and product templates
   │  └─ analytics.js                # Precomputed analytical metrics and models
   ├─ utils/
   │  ├─ labels.js                   # Human-readable business field mapping
   │  ├─ format.js                   # Currency (INR ₹), percentage, and numeric formatting
   │  ├─ seededRandom.js             # Deterministic Mulberry32 pseudorandom engine
   │  └─ recommend.js                # Smart Product Matching Engine
   └─ components/
      ├─ common/
      │  ├─ GradientText.jsx         # Stylized gradient typography
      │  ├─ Badge.jsx                # Reusable status badges
      │  ├─ KpiCard.jsx              # Metric cards with animated count-up
      │  ├─ SectionHeader.jsx        # Modular section headings
      │  ├─ StarRating.jsx           # Vector star rating displays
      │  ├─ ProductArt.jsx           # Generative vector artwork
      │  ├─ Toast.jsx                # Global notification toasts
      │  └─ EmptyState.jsx           # Filter fallback states
      ├─ store/
      │  ├─ Navbar.jsx               # Dark glassmorphism sticky navigation with cart badge
      │  ├─ Hero.jsx                 # Ambient hero banner with calibrated headline statistics
      │  ├─ ProductCard.jsx          # Interactive item card with add-to-cart
      │  ├─ ProductGrid.jsx          # Trending collection grid with department chips
      │  ├─ SmartRecommendations.jsx # Reactive basket-matching recommendations
      │  ├─ CatalogView.jsx          # Multi-filter search, price slider, and pagination
      │  ├─ AboutData.jsx            # Catalog overview and distribution metrics
      │  ├─ CartDrawer.jsx           # Interactive slide-over shopping basket
      │  └─ Footer.jsx               # Navigation footer
      └─ dwm/
         ├─ Sidebar.jsx              # Workstation navigation sidebar (9 modules)
         ├─ Overview.jsx             # Workstation hub and model readiness cards
         ├─ DatasetExplorer.jsx      # Summary metrics and descriptive distribution tables
         ├─ CustomDataSlicer.jsx     # 5-operation dimension query explorer and live SQL
         ├─ RatingTierClassifier.jsx # Multi-class quality tier classification metrics
         ├─ Segmentation.jsx         # Customer and product archetype clustering (k=2–8)
         ├─ SentimentInsights.jsx    # Review polarity analysis and customer testimonials
         ├─ CrossSell.jsx            # Market basket affinity and co-purchase rules
         ├─ PriceDiscountTrends.jsx  # Price elasticity and review volume trends
         └─ SalesForecaster.jsx      # Interactive success probability simulator
```

---

## DWM Center Workstation Modules

The DWM Center provides 9 integrated business intelligence and commercial data workstation modules:

1. **Overview**: Executive dashboard with calibrated catalog KPIs (1,465 Products, 9 Categories, 4.1/5.0 Rating, 47.7% Discount) and analytical engine readiness status.
2. **Dataset Explorer**: Ingestion audits, data quality indicators, department distribution charts, and comprehensive descriptive statistics.
3. **Custom Data Slicer**: Multi-dimensional exploration supporting Slice, Dice, Roll-Up, Drill-Down, and Pivot heatmap operations with live ANSI SQL queries.
4. **Product Rating Tier Classifier**: Quality grading model evaluating items into Low, Medium, and High rating tiers with confusion matrix and tier breakdowns.
5. **Market & Customer Segmentation**: Dynamic clustering across price and engagement dimensions with interactive scatter plots and archetype profiles.
6. **Customer Review Sentiment Insights**: Sentiment distribution donut visual, polarity score histogram, department benchmarks, and verified customer testimonials.
7. **Frequently Bought Together (Cross-Sell)**: Basket affinity rules quantifying cross-category purchase probabilities with support and confidence filters.
8. **Price & Discount Impact Trends**: Fitted trendlines modeling customer review volume response across promotional discount bands.
9. **Sales Success Forecaster**: Interactive simulator predicting High Sales Tier probability with real-time what-if sensitivity curves.
