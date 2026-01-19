import React from 'react';

const FooterGov = () => {
  return (
    <footer className="mt-8" style={{ backgroundColor: '#002147' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold mb-2">Ministry of Tribal Affairs</div>
            <p className="text-sm opacity-90">Empowering tribal communities through inclusive development, rights, and opportunities.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Links</div>
            <ul className="space-y-1 text-sm">
              <li><a className="hover:underline" href="#">Privacy Policy</a></li>
              <li><a className="hover:underline" href="#">Terms of Use</a></li>
              <li><a className="hover:underline" href="#">Feedback</a></li>
            </ul>
          </div>
          <div className="text-sm">
            <div>© Government of India</div>
            <div className="opacity-80">All content is in the public domain unless otherwise stated.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterGov;
