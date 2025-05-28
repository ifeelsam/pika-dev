export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 py-12 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3
              className="text-xl font-bold text-[#F6FF00] mb-6"
              style={{ fontFamily: "'Monument Extended', sans-serif" }}
            >
              PIKAVAULT
            </h3>
            <p className="text-white/70 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The next evolution in digital collectibles with Neo-Brutalist Maximalism design for 2025 and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              EXPLORE
            </h4>
            <ul className="space-y-4">
              {["Collection", "Marketplace"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-[#F6FF00] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              COMPANY
            </h4>
            <ul className="space-y-4">
              {["About", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-[#F6FF00] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              CONNECT
            </h4>
            <ul className="space-y-4">
              {["Discord", "Twitter"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-[#F6FF00] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            © 2025 PikaVault. All rights reserved.
          </p>

          <div className="flex space-x-6">
            {["Terms", "Privacy", "Support"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/50 hover:text-[#F6FF00] text-sm transition-colors"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
