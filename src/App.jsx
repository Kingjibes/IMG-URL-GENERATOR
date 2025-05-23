import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
    import HomePage from '@/pages/HomePage';
    import ContactPage from '@/pages/ContactPage';
    import { Toaster } from '@/components/ui/toaster';
    import { motion } from 'framer-motion';

    function App() {
      return (
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
            <header className="py-4 px-6 shadow-md bg-slate-900/50 backdrop-blur-md">
              <div className="container mx-auto flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold tracking-tight"
                >
                  Made by Hackerpro
                </motion.div>
                <nav className="space-x-4">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/contact" className="hover:text-sky-400 transition-colors">Contact</Link>
                  </motion.div>
                </nav>
              </div>
            </header>

            <main className="flex-grow container mx-auto py-8 px-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>

            <footer className="py-6 px-6 text-center bg-slate-900/50 backdrop-blur-md mt-auto">
              <div className="container mx-auto">
                <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} ImageURL Generator. All rights reserved.</p>
                <p className="text-sm text-slate-400">
                  <Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Us</Link>
                </p>
              </div>
            </footer>
            <Toaster />
          </div>
        </Router>
      );
    }

    export default App;