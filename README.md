# Kwena Student Heights

A static student residence website with Firebase-powered applicant profiles.

- `index.html` is the introduction page.
- `profile.html` lets applicants create an account, sign in, and save their profile before applying.
- `application.html` requires a signed-in account with a completed profile and prepares an application email.
- Applicants choose Vaal University of Technology or North-West University. Programme/qualification and residence preference fields are not collected.
- Applications open an email draft to `kwenastudentheights@gmail.com`; applicants must review and send it themselves.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Copy the web app configuration into `firebase-config.js`. These web configuration values are public; never put service-account credentials in this website.
3. In Firebase Authentication, enable the Email/Password provider.
4. Create a Firestore database and publish the rules in `firestore.rules`.
5. Add the website's host to Firebase Authentication's authorized domains.

Run locally from the project directory with `python3 -m http.server 8000`, then open <http://localhost:8000>. Profile and application flows require an HTTPS host (or localhost) and the Firebase setup above.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Copy the web app configuration into `firebase-config.js`. These web configuration values are public; never put service-account credentials in this website.
3. In Firebase Authentication, enable the Email/Password provider.
4. Create a Firestore database and publish the rules in `firestore.rules`.
5. Add the website's host to Firebase Authentication's authorized domains.

Run locally from the project directory with `python3 -m http.server 8000`, then open <http://localhost:8000>. Profile and application flows require an HTTPS host (or localhost) and the Firebase setup above.
