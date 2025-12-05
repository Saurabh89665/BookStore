import React, { useEffect, useRef } from "react";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const updateFooterHeight = () => {
      if (!footerRef.current) return;
      const height = footerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--footer-height", `${height}px`);
    };

    updateFooterHeight();

    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-black via-gray-900 to-black py-3 text-center border-t border-gray-700 z-50"
    >
      <p className="text-gray-300 text-sm sm:text-base">
        &copy; {new Date().getFullYear()} — Made with ❤️ by{" "}
        <span className="text-emerald-400 font-semibold">Saurabh Nirmal</span>
      </p>
    </footer>
  );
};

export default Footer;
