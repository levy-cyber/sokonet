import React, { useEffect, useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

const COOKIE_KEY = 'netsoko_cookie_consent';
const INSTALL_KEY = 'netsoko_install_dismissed';
const INSTALL_REMIND_DAYS = 7;

const PwaInstallPrompt = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [appInstalled, setAppInstalled] = useState(false);
  const [promptSupported, setPromptSupported] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [promptHiddenUntil, setPromptHiddenUntil] = useState(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_KEY);
    const storedInstallHidden = localStorage.getItem(INSTALL_KEY);
    const nextRemind = storedInstallHidden ? new Date(storedInstallHidden) : null;
    setPromptHiddenUntil(nextRemind);

    if (!storedConsent) {
      setShowCookieBanner(true);
      setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
      return;
    }

    setCookiesAccepted(storedConsent === 'accepted');
    setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    if (storedConsent === 'accepted') {
      if (!nextRemind || new Date() >= nextRemind) {
        setTimeout(() => setShowInstallPrompt(true), 2200);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      setDeferredPrompt(event);
      setPromptSupported(true);
      const storedConsent = localStorage.getItem(COOKIE_KEY);
      const storedInstallHidden = localStorage.getItem(INSTALL_KEY);
      const nextRemind = storedInstallHidden ? new Date(storedInstallHidden) : null;

      if (storedConsent === 'accepted' && (!nextRemind || new Date() >= nextRemind)) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setAppInstalled(true);
      setShowInstallPrompt(false);
      localStorage.removeItem(INSTALL_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setCookiesAccepted(true);
    setShowCookieBanner(false);
    if (promptSupported || isIos) {
      setTimeout(() => setShowInstallPrompt(true), 1600);
    }
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setShowCookieBanner(false);
  };

  const triggerInstall = async () => {
    if (appInstalled) return;
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setAppInstalled(true);
        setShowInstallPrompt(false);
        localStorage.removeItem(INSTALL_KEY);
      } else {
        const nextReminder = new Date();
        nextReminder.setDate(nextReminder.getDate() + INSTALL_REMIND_DAYS);
        localStorage.setItem(INSTALL_KEY, nextReminder.toISOString());
        setShowInstallPrompt(false);
      }
    } else {
      setShowInstallPrompt(true);
    }
  };

  const dismissInstall = () => {
    const nextReminder = new Date();
    nextReminder.setDate(nextReminder.getDate() + INSTALL_REMIND_DAYS);
    localStorage.setItem(INSTALL_KEY, nextReminder.toISOString());
    setShowInstallPrompt(false);
  };

  const promptEvent = deferredPrompt || window.deferredPrompt;
  const canShowInstallButton = !appInstalled && cookiesAccepted;

  if (showCookieBanner) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:inset-x-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Cookies</p>
            <h2 className="mt-2 text-lg font-bold text-white">We use cookies to improve your experience.</h2>
            <p className="mt-1 text-sm text-gray-300 max-w-xl">Accept cookies to personalize features, keep you logged in, and show the best experience across NetSoko.</p>
          </div>
            <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={declineCookies} className="rounded-2xl border border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5">Decline</button>
            <button type="button" onClick={acceptCookies} className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand/90">Accept</button>
          </div>
        </div>
      </div>
    );
  }

  const shouldShowInstall = showInstallPrompt && !appInstalled;

  return (
    <>
      {shouldShowInstall && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-brand/10 text-brand shadow-glow">
                  <span className="text-3xl">N</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-green-300">Install App</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">NetSoko</h3>
                  <p className="mt-2 text-sm text-gray-300 max-w-xl">Install this app for faster access and a better experience, with offline support and native-like navigation.</p>
                </div>
              </div>
              <button type="button" onClick={dismissInstall} className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10">
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button type="button" onClick={triggerInstall} className="flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]">
                <FiDownload className="h-4 w-4" />
                Install Now
              </button>
              <button type="button" onClick={dismissInstall} className="rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">Maybe Later</button>
            </div>
            {!promptEvent && isIos && (
              <p className="mt-4 text-sm text-gray-300">
                Tap the browser Share icon, then select "Add to Home Screen" to install NetSoko on iOS.
              </p>
            )}
            {!promptEvent && !isIos && (
              <p className="mt-4 text-sm text-gray-300">
                Native install is not available in this browser yet. Use the browser menu to install the app manually when available.
              </p>
            )}
            {promptEvent && (
              <p className="mt-4 text-sm text-gray-300">
                Click Install Now to add NetSoko to your device and use it offline.
              </p>
            )}
          </div>
        </div>
      )}

      {canShowInstallButton && (
        <button
          type="button"
          onClick={triggerInstall}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-black shadow-2xl shadow-brand/30 transition hover:bg-brand/90 sm:bottom-8 sm:right-8"
        >
          <FiDownload className="h-4 w-4" />
          Install App
        </button>
      )}
    </>
  );
};

export default PwaInstallPrompt;
