import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import Home from './pages/Home';
import Services from './pages/Services';
import Tracking from './pages/Tracking';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Help from './pages/Help';
import HelpCategory from './pages/HelpCategory';
import HelpArticle from './pages/HelpArticle';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Blog from "./pages/Blog";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/rastreamento" element={<Tracking />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/carreiras" element={<Careers />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/ajuda" element={<Help />} />
        <Route path="/ajuda/:categoria" element={<HelpCategory />} />
        <Route path="/ajuda/:categoria/:artigo" element={<HelpArticle />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
