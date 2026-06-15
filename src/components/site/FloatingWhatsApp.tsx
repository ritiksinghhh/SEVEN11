const MSG = "Hello, I'd like to inquire about your services.";
const URL = `https://wa.me/918840230877?text=${encodeURIComponent(MSG)}`;

export function FloatingWhatsApp() {
  return (
    <a
      href={URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.55c-.27-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.04-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.33-.79-.71-1.33-1.58-1.49-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22 0 1.31.96 2.58 1.09 2.76.13.18 1.89 2.88 4.57 4.04.64.28 1.14.44 1.53.56.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.79-1.26.22-.62.22-1.16.16-1.26-.07-.11-.24-.18-.51-.31zM16 4C9.37 4 4 9.37 4 16c0 2.11.55 4.18 1.6 6L4 28l6.16-1.55c1.74.93 3.7 1.42 5.85 1.42 6.63 0 12-5.37 12-12S22.63 4 16 4zm0 21.69c-1.84 0-3.65-.49-5.22-1.42l-.37-.22-3.66.92.98-3.56-.24-.37C6.55 19.51 6 17.77 6 16c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 9.69-10 9.69z" />
      </svg>
    </a>
  );
}
