
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blocktix-dark border-t border-white/10 py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-purple flex items-center justify-center">
                <span className="font-bold text-white">BT</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-purple">
                BlockTix
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              The next generation of event ticketing on the Solana blockchain.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm">Browse Events</Link></li>
              <li><Link to="/create" className="text-gray-400 hover:text-white text-sm">Create Event</Link></li>
              <li><Link to="/my-tickets" className="text-gray-400 hover:text-white text-sm">My Tickets</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Solana Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 BlockTix. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
