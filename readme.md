# 🌍 Global Crisis Watch

A real-time global crisis monitoring dashboard that aggregates and visualizes data from multiple sources, including USGS earthquake data, international news, and emergency services.



## 🎯 Project Overview

**Global Crisis Watch** was developed as a learning exercise to explore:
- Integrating multiple APIs and data sources
- Real-time data fetching and processing
- Async/Await patterns in TypeScript
- Geospatial data visualization with Leaflet
- React hooks and state management
- Server-side rendering with Next.js
- Dark mode UI/UX design principles
- Infinite scrolling and data pagination
- Ensuring TypeScript type safety and interfaces

## 🚀 Features

- **Real-Time Monitoring**: Stay updated with live global disaster and emergency data
- **Interactive Map**: Explore events using custom markers and clustering
- **Multi-Source Integration**:
  - USGS Earthquake Data
  - International News APIs
  - Emergency Services Updates
- **Smart Filtering**: Filter events by type, severity, or location
- **Detailed Analytics**: Assess impact and track severity levels
- **Responsive Design**: Fully functional across desktop and mobile devices
- **Keyboard Shortcuts**: Improve navigation and usability
- **Infinite Scrolling**: Dynamically load historical events

## 🛠️ Tech Stack

**Frontend**:
- Next.js
- React
- TypeScript

**Styling**:
- Tailwind CSS

**Mapping**:
- Leaflet with a custom dark theme

**Data Sources**:
- USGS API
- NewsAPI
- OpenCage Geocoding

**Authentication**:
- Auth0

**Deployment**:
- Vercel

## 📦 Installation

Follow these steps to get started:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/afaanbayes/global-crisis-watch.git
   cd global-crisis-watch
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory and add the required API keys:
   ```env
   NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
   NEXT_PUBLIC_GEOCODING_API_KEY=your_geocoding_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   Open your browser and navigate to `http://localhost:3000`

## 🧠 Learning Outcomes

Through this project, I gained insights into:
- Handling asynchronous operations with `async/await`
- Implementing TypeScript interfaces for better type safety
- Managing complex state using React hooks
- Adding infinite scroll and pagination functionality
- Processing and visualizing geospatial data with Leaflet
- Designing responsive and accessible UI components
- Integrating multiple third-party APIs
- Effectively handling errors and managing loading states
- Applying performance optimization techniques

## 📝 License

This project is licensed under the [MIT License](./LICENSE). Feel free to use it for learning and development!

## 🙏 Acknowledgments

A big thank you to the following resources and tools:
- **USGS** for earthquake data
- **NewsAPI** for global news coverage
- **OpenCage** for geocoding services
- **Leaflet** for mapping capabilities
- **Auth0** for authentication
- **Vercel** for hosting

## 🤝 Contributing

Contributions are welcome! If you’d like to:
- Report bugs
- Suggest new features
- Submit pull requests

Feel free to contribute to this learning project.

## 📧 Contact

Developed by **Afaan**. Connect with me on [GitHub](https://github.com/trulynotafan).
