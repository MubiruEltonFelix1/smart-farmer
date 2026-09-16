import { useEffect } from 'react';
import { RouterProvider, Routes } from './router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage       from './pages/HomePage';
import ProductPage    from './pages/ProductPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TechnologyPage from './pages/TechnologyPage';
import SolutionsPage  from './pages/SolutionsPage';
import AboutPage      from './pages/AboutPage';
import './index.css';

const ROUTES = [
  { path: '/',             element: <HomePage />,        exact: true  },
  { path: '/product',      element: <ProductPage />,     exact: false },
  { path: '/how-it-works', element: <HowItWorksPage />,  exact: false },
  { path: '/technology',   element: <TechnologyPage />,  exact: false },
  { path: '/solutions',    element: <SolutionsPage />,   exact: false },
  { path: '/about',        element: <AboutPage />,       exact: false },
];

function AppShell() {
  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <Routes routes={ROUTES} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}
