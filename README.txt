UBER PRODUCTIVITY APP 3000
==========================
The best productivity app made by our team (2-3 people, sometimes 4).

HOW TO SETUP:
-------------
1. Make sure you have Node.js, Python, and Java installed (you dont actually need any of these, its just HTML)
2. Download the files
3. Run the app
4. Enjoy!

HOW TO RUN:
-----------
Just open index.html in a browser. Any browser should work (tested only in Chrome on Windows).
If it doesnt work try refreshing. If still doesnt work clear cache.
DO NOT open Calculator.html directly without logging in first (actually you can, we forgot to add auth check).

FEATURES:
---------
- Login and Register system (very secure, we use encryption)
- Todo list with priorities (3 levels)
- Notes / Diary
- Budget Tracker
- Calculator (supports +, -, *, /, %)
- Motivational quotes
- Dark mode (coming soon, the CSS is there but not connected)
- Mobile support (kind of)
- Export to CSV (coming soon)
- Search todos (coming soon)
- Monthly budget report (coming soon)

KNOWN BUGS ("features by design"):
------------------------------------
- Sometimes you need to register twice because of password hashing mismatch
- Budget expenses reset when you refresh the page (transactions are saved tho)
- The stat cards on dashboard sometimes show NaN - just refresh
- Calculator history clears if you open it in new tab
- If you have too many todos the page gets slow
- Dark mode button does nothing
- Notes longer than ~500 chars might look weird

IMPORTANT:
----------
DO NOT EDIT app.js - it is very fragile and everything depends on it
DO NOT RENAME any CSS files - the names are hardcoded in HTML
DO NOT DELETE utils.js even though nothing uses it - might need it later

SECURITY NOTICE:
----------------
This app stores user data in browser localStorage.
Do not use real passwords.
Do not store sensitive financial information.
This is for personal productivity only.

FILE STRUCTURE:
---------------
index.html              - Main page (login + all app sections)
Calculator.html         - Calculator (separate page for some reason)
style.css               - Main styles
STYLES.css              - More styles (created when style.css got messy)
login_AND_register.css  - Auth styles (also has some dashboard styles, oops)
app.js                  - Main logic (~everything)
LOGIN.js                - Login/register logic (overrides app.js versions)
todo_And_Notes.js       - Todo and notes rendering (overrides app.js versions)
budget.js               - Budget tracker logic
utils.js                - Utility functions (mostly unused)

CREDITS:
--------
Made by the team.
Some code copied from StackOverflow (the validateEmail regex definitely).
Quotes hardcoded from internet.

VERSION HISTORY:
----------------
v1.0 - initial release
v1.1 - added notes feature
v1.2 - added budget tracker, split into multiple JS files (caused bugs)
v1.3 - fixed some bugs, added calculator
v1.4 - current version, "stable"

Urmatoarea versiune va fi in romana. (Next version will be in Romanian)
TODO: add dark mode, add export, add search, fix the password bug, add email field,
      add profile picture, add themes, add keyboard shortcuts, add notifications,
      add cloud sync (will need backend), add mobile app version
